from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    """
    The request model for a user query.
    """
    query: str
    session_id: Optional[str] = None # For session-based chat history

class Document(BaseModel):
    """
    The model for a retrieved source document.
    """
    page_content: str
    metadata: dict

class QueryResponse(BaseModel):
    """
    The response model for a user query.
    """
    answer: str
    sources: List[Document]

class Token(BaseModel):
    """
    The response model for the authentication token.
    """
    access_token: str
    token_type: str
