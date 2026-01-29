# Wikipedia Auto-Quiz Generator

A full-stack application that generates interactive quizzes from any Wikipedia article using AI.

## Features
- **URL Scraping**: Extracts content from Wikipedia.
- **AI Quiz Generation**: Uses Google Gemini to create questions, answers, and summaries.
- **History Tracking**: Saves past quizzes in a database.
- **Responsive UI**: Clean, glassmorphism-inspired React interface.

## Quick Start

### Backend
1. Navigate to `backend/`.
2. Create virtual env: `python -m venv venv`.
3. Activate:
    - Windows: `venv\Scripts\activate`
    - Mac/Linux: `source venv/bin/activate`
4. Install: `pip install -r requirements.txt`.
5. (Optional) Set `GEMINI_API_KEY` in `.env`.
6. Run: `uvicorn main:app --reload`.

### Frontend
1. Navigate to `frontend/`.
2. Install: `npm install`.
3. Run: `npm run dev`.

## Tech Stack
- **Backend**: FastAPI, SQLAlchemy, BeautifulSoup
- **Frontend**: React, Vite, Vanilla CSS
- **AI**: Google Gemini 1.5 Flash

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on how to publish to Render and Vercel.
