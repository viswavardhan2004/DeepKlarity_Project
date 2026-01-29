# Deployment Guide

This guide explains how to deploy the Wiki Quiz App to production using free-tier services.

## Prerequisites
1.  **GitHub Account**: Push this project to a new GitHub repository.
    -   Structure should be:
        ```
        /repo
          /backend
          /frontend
          /sample_data
        ```

## 1. Deploy Backend (Render.com)

We will use **Render** for the Python FastAPI backend and the PostgreSQL database.

### Step A: Create Database
1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **PostgreSQL**.
3.  Name: `wiki-quiz-db`.
4.  Plan: **Free**.
5.  Click **Create Database**.
6.  Copy the `Internal Database URL` (starts with `postgres://...`).

### Step B: Deploy Web Service
1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub repository.
3.  **Settings**:
    -   **Name**: `wiki-quiz-api`
    -   **Root Directory**: `backend` (Important!)
    -   **Runtime**: Python 3
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    -   **Plan**: Free
4.  **Environment Variables**:
    -   `DATABASE_URL`: (Paste the Internal Database URL from Step A)
    -   `GEMINI_API_KEY`: (Your Google Gemini API Key)
    -   `PYTHON_VERSION`: `3.9.0` (Optional but recommended)
5.  Click **Create Web Service**.
6.  Wait for deployment. Copy your backend URL (e.g., `https://wiki-quiz-api.onrender.com`).

---

## 2. Deploy Frontend (Vercel)

We will use **Vercel** for the React frontend.

1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    -   **Framework Preset**: Vite
    -   **Root Directory**: Click `Edit` and select `frontend`.
5.  **Environment Variables**:
    -   Name: `VITE_API_URL`
    -   Value: (Your Render Backend URL, e.g., `https://wiki-quiz-api.onrender.com`)
    -   *Note: Do NOT add a trailing slash.*
6.  Click **Deploy**.

## 3. Final Verification

1.  Open your Vercel URL (e.g., `https://wiki-quiz-app.vercel.app`).
2.  Try generating a quiz.
    -   The frontend will call your Render backend.
    -   The backend will use the Render PostgreSQL database.
3.  Check the History tab to ensure data persistence.
