import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Settings:
    """
    Application settings loaded from environment variables.
    """
    # RAG Pipeline Configuration
    DB_DIRECTORY: str = os.getenv("DB_DIRECTORY", "db")
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")

    # Groq Configuration (Free, Fast)
    GROQ_MODEL_NAME: str = os.getenv("GROQ_MODEL_NAME", "llama-3.1-8b-instant")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")


# Create a single settings instance to be used across the application
settings = Settings()
