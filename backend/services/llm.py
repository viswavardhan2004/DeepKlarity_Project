import os
import google.generativeai as genai
import json
import random

# Configure API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def generate_quiz_content(text_content: str):
    if not GEMINI_API_KEY:
        print("No GEMINI_API_KEY found. using mock mode.")
        return generate_mock_quiz()

    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are an expert educational content creator. Based on the following article text, generate a quiz.
    
    Article Text:
    {text_content}
    
    Output structured JSON ONLY with the following schema:
    {{
        "summary": "2-3 sentence summary of the article",
        "key_entities": {{
            "people": ["List of people"],
            "organizations": ["List of orgs"],
            "locations": ["List of places"]
        }},
        "quiz": [
            {{
                "question": "Question text",
                "options": ["A", "B", "C", "D"],
                "answer": "The correct option text (must be one of the options)",
                "difficulty": "easy|medium|hard",
                "explanation": "Short explanation"
            }}
        ],
        "related_topics": ["Topic 1", "Topic 2", "Topic 3"]
    }}
    
    Generate 5-7 questions mixed difficulties. Ensure the output is valid raw JSON, no markdown formatting like ```json.
    """
    
    try:
        response = model.generate_content(prompt)
        # Cleanup if model returns markdown
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_text)
        return data
    except Exception as e:
        print(f"LLM Error: {e}")
        return generate_mock_quiz()

def generate_mock_quiz():
    return {
        "summary": "This is a MOCK summary because no API Key was provided. Alan Turing was a pioneer.",
        "key_entities": {
            "people": ["Alan Turing Mock", "Grace Hopper Mock"],
            "organizations": ["Bletchley Park Mock"],
            "locations": ["UK Mock"]
        },
        "quiz": [
            {
                "question": "What is 2+2 (Mock Question)?",
                "options": ["3", "4", "5", "6"],
                "answer": "4",
                "difficulty": "easy",
                "explanation": "Math basics."
            },
            {
                "question": "Who is the father of AI (Mock)?",
                "options": ["Turing", "Einstein", "Newton", "Darwin"],
                "answer": "Turing",
                "difficulty": "medium",
                "explanation": "Turing test."
            }
        ],
        "related_topics": ["Artificial Intelligence", "Cryptography", "Computing"]
    }
