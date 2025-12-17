import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from .config import settings

# --- 1. Load the Vector Store and Initialize Retriever ---

def get_retriever():
    """
    Initializes and returns the vector store retriever.
    """
    if not os.path.exists(settings.DB_DIRECTORY):
        raise FileNotFoundError(f"Vector store not found at {settings.DB_DIRECTORY}. Please run the ingestion script first.")

    embeddings = HuggingFaceEmbeddings(
        model_name=settings.EMBEDDING_MODEL_NAME,
        model_kwargs={'device': 'cpu'}
    )

    vector_store = Chroma(
        persist_directory=settings.DB_DIRECTORY,
        embedding_function=embeddings
    )

    return vector_store.as_retriever(search_kwargs={"k": 5})

# --- 2. Define the RAG Chain ---

def format_docs(docs):
    """
    Formats the retrieved documents into a single string.
    """
    return "\n\n".join(doc.page_content for doc in docs)

def create_rag_chain():
    """
    Creates and returns the full RAG chain.
    """
    retriever = get_retriever()
    llm = ChatGroq(
        model=settings.GROQ_MODEL_NAME,
        api_key=settings.GROQ_API_KEY,
        temperature=0
    )

    template = """You are an expert assistant for the 'Humanoid Robotics' e-book.
Answer the user's question based *only* on the provided context.
If the answer is not in the context, explicitly state that you don't have enough information.
Be concise and clear.

Context:
{context}

Question:
{question}

Answer:"""

    prompt = ChatPromptTemplate.from_template(template)

    # Simple RAG chain without reranking for compatibility
    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain

# Create the chain on module load
rag_chain = None

def get_rag_chain():
    """Get or create the RAG chain."""
    global rag_chain
    if rag_chain is None:
        rag_chain = create_rag_chain()
    return rag_chain
