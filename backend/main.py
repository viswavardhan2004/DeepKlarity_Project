import os
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

import models
import database
from services import scraper, llm

# Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Wiki Quiz Generator")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class GenerateRequest(BaseModel):
    url: str

class GenerateResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    key_entities: dict
    sections: List[str]
    quiz: List[dict]
    related_topics: List[str]

class HistoryItem(BaseModel):
    id: int
    url: str
    title: str
    summary: str

# Endpoints

@app.post("/api/generate", response_model=GenerateResponse)
def generate_quiz(request: GenerateRequest, db: Session = Depends(database.get_db)):
    # 1. Check if URL already exists in DB
    existing_quiz = db.query(models.Quiz).filter(models.Quiz.url == request.url).first()
    if existing_quiz:
        # Return existing quiz data
        questions_data = []
        for q in existing_quiz.questions:
            questions_data.append({
                "question": q.question_text,
                "options": q.options,
                "answer": q.answer,
                "difficulty": q.difficulty,
                "explanation": q.explanation
            })
        return {
            "id": existing_quiz.id,
            "url": existing_quiz.url,
            "title": existing_quiz.title,
            "summary": existing_quiz.summary,
            "key_entities": existing_quiz.key_entities,
            "sections": existing_quiz.sections,
            "quiz": questions_data,
            "related_topics": existing_quiz.related_topics
        }
    
    # 2. Scrape
    try:
        scraped_data = scraper.scrape_wikipedia(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # 3. LLM Gen
    try:
        generated_data = llm.generate_quiz_content(scraped_data['text'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Generation failed: {str(e)}")
    
    # 4. Save to DB
    db_quiz = models.Quiz(
        url=request.url,
        title=scraped_data['title'],
        summary=generated_data.get('summary', 'No summary available'),
        raw_html=scraped_data.get('html', ''),
        key_entities=generated_data.get('key_entities', {}),
        sections=scraped_data['sections'],
        related_topics=generated_data.get('related_topics', [])
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    
    # Save questions
    for q_data in generated_data.get('quiz', []):
        db_question = models.Question(
            quiz_id=db_quiz.id,
            question_text=q_data['question'],
            options=q_data['options'],
            answer=q_data['answer'],
            difficulty=q_data['difficulty'],
            explanation=q_data['explanation']
        )
        db.add(db_question)
    
    db.commit()
    
    # 5. Return Response
    return {
        "id": db_quiz.id,
        "url": db_quiz.url,
        "title": db_quiz.title,
        "summary": db_quiz.summary,
        "key_entities": db_quiz.key_entities,
        "sections": db_quiz.sections,
        "quiz": generated_data.get('quiz', []),
        "related_topics": db_quiz.related_topics
    }

@app.get("/api/history", response_model=List[HistoryItem])
def get_history(db: Session = Depends(database.get_db)):
    quizzes = db.query(models.Quiz).order_by(models.Quiz.id.desc()).all()
    return [
        {
            "id": q.id,
            "url": q.url,
            "title": q.title,
            "summary": q.summary[:200] + "..." if q.summary else ""
        } 
        for q in quizzes
    ]

@app.get("/api/quiz/{quiz_id}", response_model=GenerateResponse)
def get_quiz_details(quiz_id: int, db: Session = Depends(database.get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Format questions
    questions_data = []
    for q in quiz.questions:
        questions_data.append({
            "question": q.question_text,
            "options": q.options,
            "answer": q.answer,
            "difficulty": q.difficulty,
            "explanation": q.explanation
        })
        
    return {
        "id": quiz.id,
        "url": quiz.url,
        "title": quiz.title,
        "summary": quiz.summary,
        "key_entities": quiz.key_entities,
        "sections": quiz.sections,
        "quiz": questions_data,
        "related_topics": quiz.related_topics
    }

@app.get("/")
def read_root():
    return {"message": "Wiki Quiz API is running"}
