# RAG Chatbot Deployment Guide

This guide covers deploying the Humanoid Robotics AI Assistant to production.

## Architecture Overview

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   GitHub Pages      │────▶│   Backend API        │────▶│   Groq API      │
│   (Docusaurus)      │     │   (Railway/Render)   │     │   (LLM)         │
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │   ChromaDB / Qdrant  │
                            │   (Vector Store)     │
                            └──────────────────────┘
```

## Prerequisites

- GitHub account
- Groq API key (free at https://console.groq.com/keys)
- One of: Railway, Render, or Fly.io account

---

## Option 1: Deploy to Railway (Recommended)

Railway offers easy deployment with generous free tier.

### Step 1: Prepare the Backend

1. Create a `Procfile` in `chatbot_api/`:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

2. Update `chatbot_api/requirements.txt`:

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-dotenv==1.0.0
langchain==0.1.0
langchain-community==0.0.13
langchain-groq==0.0.1
langchain-core==0.1.10
chromadb==0.4.22
sentence-transformers==2.2.2
huggingface-hub==0.20.2
pyjwt==2.8.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

3. Create `chatbot_api/runtime.txt`:

```
python-3.11.7
```

### Step 2: Deploy to Railway

1. Go to [Railway](https://railway.app) and sign in with GitHub

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your repository and choose the `chatbot_api` folder

4. Configure the service:
   - **Root Directory**: `chatbot_api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Add environment variables (Settings → Variables):

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL_NAME=llama-3.1-8b-instant
DB_DIRECTORY=db
EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2
JWT_SECRET_KEY=generate_a_secure_random_string_here
```

6. Deploy and get your URL (e.g., `https://your-app.railway.app`)

---

## Option 2: Deploy to Render

### Step 1: Create render.yaml

Create `chatbot_api/render.yaml`:

```yaml
services:
  - type: web
    name: humanoid-robotics-chatbot
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GROQ_API_KEY
        sync: false
      - key: GROQ_MODEL_NAME
        value: llama-3.1-8b-instant
      - key: DB_DIRECTORY
        value: db
      - key: EMBEDDING_MODEL_NAME
        value: all-MiniLM-L6-v2
      - key: JWT_SECRET_KEY
        generateValue: true
```

### Step 2: Deploy

1. Go to [Render](https://render.com) and sign in

2. Click **"New"** → **"Web Service"**

3. Connect your GitHub repository

4. Configure:
   - **Root Directory**: `chatbot_api`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Add environment variables in the dashboard

6. Deploy and get your URL (e.g., `https://your-app.onrender.com`)

---

## Option 3: Deploy to Fly.io

### Step 1: Create fly.toml

Create `chatbot_api/fly.toml`:

```toml
app = "humanoid-robotics-chatbot"
primary_region = "ord"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"
  GROQ_MODEL_NAME = "llama-3.1-8b-instant"
  DB_DIRECTORY = "db"
  EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

### Step 2: Create Dockerfile

Create `chatbot_api/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Download the embedding model at build time
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Step 3: Deploy

```bash
cd chatbot_api

# Install Fly CLI
# Windows: powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
# Mac/Linux: curl -L https://fly.io/install.sh | sh

# Login and deploy
fly auth login
fly launch
fly secrets set GROQ_API_KEY=your_groq_api_key_here
fly secrets set JWT_SECRET_KEY=your_secret_key_here
fly deploy
```

---

## Qdrant Cloud Setup (Optional - For Production Vector Store)

For production, consider using Qdrant Cloud instead of local ChromaDB.

### Step 1: Create Qdrant Cloud Account

1. Go to [Qdrant Cloud](https://cloud.qdrant.io)
2. Sign up and create a new cluster (free tier available)
3. Note your **Cluster URL** and **API Key**

### Step 2: Update the RAG Pipeline

Update `chatbot_api/app/rag_pipeline.py`:

```python
import os
from langchain_community.vectorstores import Qdrant
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from qdrant_client import QdrantClient

from .config import settings

def get_retriever():
    """Initialize Qdrant Cloud retriever."""
    embeddings = HuggingFaceEmbeddings(
        model_name=settings.EMBEDDING_MODEL_NAME,
        model_kwargs={'device': 'cpu'}
    )

    client = QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY,
    )

    vector_store = Qdrant(
        client=client,
        collection_name=settings.QDRANT_COLLECTION,
        embeddings=embeddings,
    )

    return vector_store.as_retriever(search_kwargs={"k": 5})

# ... rest of the code remains the same
```

### Step 3: Update Config

Add to `chatbot_api/app/config.py`:

```python
# Qdrant Cloud Configuration
QDRANT_URL: str = os.getenv("QDRANT_URL", "")
QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "humanoid_robotics")
```

### Step 4: Add Environment Variables

```env
QDRANT_URL=https://your-cluster.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=humanoid_robotics
```

### Step 5: Ingest Data to Qdrant

Create `chatbot_api/ingest_qdrant.py`:

```python
import os
from pathlib import Path
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from langchain_community.vectorstores import Qdrant

DOCS_PATH = "../docs"
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "humanoid_robotics"

def ingest():
    # Load documents
    loader = DirectoryLoader(
        DOCS_PATH,
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"}
    )
    documents = loader.load()
    print(f"Loaded {len(documents)} documents")

    # Split documents
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks")

    # Initialize embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )

    # Initialize Qdrant client
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

    # Create collection if not exists
    collections = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME not in collections:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )

    # Add documents
    Qdrant.from_documents(
        chunks,
        embeddings,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        collection_name=COLLECTION_NAME,
    )
    print("Ingestion complete!")

if __name__ == "__main__":
    ingest()
```

---

## Neon Postgres Setup (Optional - For User Management)

For production user authentication, use Neon Postgres.

### Step 1: Create Neon Account

1. Go to [Neon](https://neon.tech)
2. Create a project and database
3. Get your connection string

### Step 2: Install Dependencies

Add to `requirements.txt`:

```
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
```

### Step 3: Create Database Models

Create `chatbot_api/app/database.py`:

```python
import os
from sqlalchemy import create_engine, Column, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True, index=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
Base.metadata.create_all(bind=engine)
```

### Step 4: Update Auth

Update `chatbot_api/app/auth.py` to use the database instead of `fake_users_db`.

### Step 5: Add Environment Variable

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

---

## Update Frontend for Production

### Step 1: Update API URL

Update `src/components/MinimalChatWidget/index.tsx`:

```typescript
// Use environment variable or fallback to localhost for development
const API_URL = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost'
      ? 'http://localhost:8000'
      : 'https://your-app.railway.app')  // Replace with your deployed URL
  : 'http://localhost:8000';
```

Or better, create a config file `src/config.ts`:

```typescript
export const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-app.railway.app'
    : 'http://localhost:8000',
};
```

### Step 2: Update CORS in Backend

Update `chatbot_api/app/main.py` for production CORS:

```python
# --- CORS Middleware ---
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://misha-jatt.github.io",  # Your GitHub Pages URL
    "https://your-custom-domain.com",  # If you have one
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

---

## Environment Variables Summary

### Backend (Railway/Render/Fly.io)

| Variable | Description | Example |
|----------|-------------|---------|
| `GROQ_API_KEY` | Groq API key | `gsk_xxx...` |
| `GROQ_MODEL_NAME` | LLM model | `llama-3.1-8b-instant` |
| `DB_DIRECTORY` | ChromaDB path | `db` |
| `EMBEDDING_MODEL_NAME` | Embedding model | `all-MiniLM-L6-v2` |
| `JWT_SECRET_KEY` | JWT signing key | `random-secure-string` |
| `QDRANT_URL` | Qdrant Cloud URL (optional) | `https://xxx.qdrant.io` |
| `QDRANT_API_KEY` | Qdrant API key (optional) | `xxx` |
| `DATABASE_URL` | Neon Postgres URL (optional) | `postgresql://...` |

---

## Final Testing Checklist

### Backend API Tests

- [ ] Health check: `GET /` returns welcome message
- [ ] Auth: `POST /token` with valid credentials returns JWT
- [ ] Auth: `POST /token` with invalid credentials returns 401
- [ ] Query: `POST /query` with valid token returns answer
- [ ] Query: `POST /query` without token returns 401
- [ ] CORS: Requests from GitHub Pages work

```bash
# Test commands
curl https://your-app.railway.app/
curl -X POST https://your-app.railway.app/token \
  -d "username=testuser&password=password"
curl -X POST https://your-app.railway.app/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ROS 2?"}'
```

### Frontend Tests

- [ ] Chat widget appears on all pages
- [ ] Login form works
- [ ] Messages send and receive correctly
- [ ] Error states display properly
- [ ] Text selection "Ask AI" popup works
- [ ] Dark mode styling works
- [ ] Mobile responsive layout works

### Security Checklist

- [ ] JWT secret is strong and unique
- [ ] API keys are not exposed in frontend code
- [ ] CORS is restricted to your domains only
- [ ] HTTPS is enforced on all endpoints
- [ ] Rate limiting is configured (optional)

---

## Deployment Commands Quick Reference

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render

```bash
# Deploy via GitHub integration (recommended)
# Or use render.yaml blueprint
```

### Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly auth login
fly launch
fly deploy
```

### GitHub Pages (Frontend)

```bash
# Build and deploy
npm run build
npm run deploy  # If using gh-pages package
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your GitHub Pages URL is in `ALLOWED_ORIGINS`

2. **502 Bad Gateway**: Check Railway/Render logs for startup errors

3. **Model Loading Slow**: First request may be slow as models load. Consider adding a health check that preloads models.

4. **Out of Memory**: Upgrade to a larger instance or optimize model loading

5. **ChromaDB Not Found**: Ensure `db/` directory is included in deployment or use Qdrant Cloud

### Viewing Logs

```bash
# Railway
railway logs

# Fly.io
fly logs

# Render
# View in dashboard
```

---

## Cost Estimates

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway | $5/month credit | $0.000231/GB-hour |
| Render | 750 hours/month | $7/month |
| Fly.io | 3 shared VMs | $1.94/month |
| Qdrant Cloud | 1GB free | $25/month |
| Neon Postgres | 0.5GB free | $19/month |
| Groq API | Free tier | Pay per token |
| GitHub Pages | Free | Free |

**Recommended Budget Setup**: Railway (free tier) + Groq (free) + GitHub Pages (free) = **$0/month**
