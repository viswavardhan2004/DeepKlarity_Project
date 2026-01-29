from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    title = Column(String)
    summary = Column(Text)
    raw_html = Column(Text) # Bonus: Store raw HTML
    key_entities = Column(JSON)  # Stores JSON object of entities
    sections = Column(JSON)      # Stores list of section names
    related_topics = Column(JSON) # Stores list of related topics

    questions = relationship("Question", back_populates="quiz")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_text = Column(Text)
    options = Column(JSON)       # Stores list of 4 options
    answer = Column(String)
    difficulty = Column(String)
    explanation = Column(Text)

    quiz = relationship("Quiz", back_populates="questions")
