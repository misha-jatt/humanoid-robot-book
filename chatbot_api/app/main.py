import os
from datetime import timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import logging

from .schemas import QueryRequest, QueryResponse, Token
from .rag_pipeline import create_rag_chain
from .config import settings
from .auth import (
    User,
    UserInDB,
    get_current_active_user,
    fake_users_db,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

# --- Basic Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Humanoid Robotics Chatbot API",
    description="An API for querying the Humanoid Robotics e-book using a RAG pipeline.",
    version="1.0.0"
)

# --- CORS Middleware ---
# Configure allowed origins for production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "https://misha-jatt.github.io",  # GitHub Pages
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# --- RAG Pipeline Loading ---
try:
    logger.info("Loading RAG pipeline...")
    rag_chain = create_rag_chain()
    logger.info("RAG pipeline loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load RAG pipeline: {e}")
    rag_chain = None


# --- API Endpoints ---

@app.get("/", tags=["General"])
async def read_root():
    """
    Root endpoint providing a welcome message.
    """
    return {"message": "Welcome to the Humanoid Robotics Chatbot API!"}


@app.get("/health", tags=["General"])
async def health_check():
    """
    Health check endpoint for deployment platforms (Hugging Face Spaces).
    Returns 200 OK when the service is ready to accept requests.
    """
    return {
        "status": "healthy",
        "rag_pipeline": "available" if rag_chain else "unavailable",
        "service": "humanoid-robotics-chatbot"
    }


@app.head("/health", tags=["General"])
async def health_check_head():
    """
    HEAD request for health check (some platforms use this).
    """
    return None

# --- Auth Endpoints ---

@app.post("/token", response_model=Token, tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Logs in a user and returns a JWT access token.
    """
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=User, tags=["Authentication"])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Returns the current authenticated user's information.
    """
    return current_user


# --- Protected RAG Endpoint ---

@app.post("/query", response_model=QueryResponse, tags=["RAG"])
async def query_rag(
    request: QueryRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Accepts a user query, processes it through the RAG pipeline,
    and returns the answer along with source documents.
    Requires authentication.
    """
    if not rag_chain:
        raise HTTPException(status_code=503, detail="RAG pipeline is not available.")
    
    logger.info(f"Received query from user '{current_user.username}': {request.query}")
    
    try:
        # The chain returns just the answer string now
        answer = rag_chain.invoke(request.query)

        logger.info(f"Generated answer for query: {request.query}")
        return QueryResponse(answer=answer, sources=[])

    except Exception as e:
        logger.error(f"Error processing query '{request.query}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process the query.")
