---
title: Humanoid Robotics Chatbot API
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Humanoid Robotics Chatbot API

An AI-powered chatbot API for querying the Humanoid Robotics e-book using a RAG (Retrieval-Augmented Generation) pipeline.

## Features

- **RAG Pipeline**: Uses ChromaDB for vector storage and Groq LLM for generation
- **Authentication**: JWT-based authentication for secure API access
- **FastAPI**: High-performance async API framework

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/health` | GET | Health check endpoint |
| `/token` | POST | Get JWT access token |
| `/query` | POST | Query the RAG pipeline (requires auth) |
| `/users/me` | GET | Get current user info (requires auth) |

## Environment Variables

Set these as secrets in your Hugging Face Space:

- `GROQ_API_KEY`: Your Groq API key for LLM inference
- `SECRET_KEY`: JWT secret key for authentication
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Usage

### Health Check
```bash
curl https://your-space.hf.space/health
```

### Get Token
```bash
curl -X POST https://your-space.hf.space/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpassword"
```

### Query the Chatbot
```bash
curl -X POST https://your-space.hf.space/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the main components of humanoid robots?"}'
```

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 7860
```

## Docker

```bash
# Build
docker build -t humanoid-robotics-chatbot .

# Run
docker run -p 7860:7860 -e GROQ_API_KEY=your_key humanoid-robotics-chatbot
```
