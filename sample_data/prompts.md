# Quiz Generation Prompt Template

The following prompt is used to generate the quiz from the scraped Wikipedia content.

### System Role
You are an expert educational content creator.

### Prompt Content
```text
Based on the following article text, generate a quiz.

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
```
