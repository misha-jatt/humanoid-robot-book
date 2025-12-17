"""
Ingestion script to load all e-book content into ChromaDB vector store.
Run this script to populate the database with all documentation.
"""

import os
import glob
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

# Load environment variables
load_dotenv()

# Configuration
DOCS_DIR = "../docs"
DB_DIRECTORY = os.getenv("DB_DIRECTORY", "db")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")

def load_documents():
    """Load all markdown and mdx files from the docs directory."""
    documents = []

    # Find all .md and .mdx files
    patterns = [
        os.path.join(DOCS_DIR, "**/*.md"),
        os.path.join(DOCS_DIR, "**/*.mdx"),
    ]

    files_found = []
    for pattern in patterns:
        files_found.extend(glob.glob(pattern, recursive=True))

    print(f"Found {len(files_found)} documentation files")

    for file_path in files_found:
        try:
            # Read the file content directly
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Skip empty files
            if not content.strip():
                print(f"  Skipping empty file: {file_path}")
                continue

            # Create a document object
            doc = Document(
                page_content=content,
                metadata={"source": file_path}
            )
            documents.append(doc)
            print(f"  Loaded: {file_path}")

        except Exception as e:
            print(f"  Error loading {file_path}: {e}")

    return documents

def split_documents(documents):
    """Split documents into smaller chunks for better retrieval."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n## ", "\n### ", "\n#### ", "\n\n", "\n", " ", ""]
    )

    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")
    return chunks

def create_vector_store(chunks):
    """Create or update the ChromaDB vector store."""
    print(f"Creating embeddings with model: {EMBEDDING_MODEL_NAME}")

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={'device': 'cpu'}
    )

    # Try to remove existing database, skip if locked
    if os.path.exists(DB_DIRECTORY):
        import shutil
        try:
            print(f"Removing existing database at {DB_DIRECTORY}")
            shutil.rmtree(DB_DIRECTORY)
        except PermissionError:
            print("WARNING: Database is locked (server running?). Adding to existing database.")

    print("Creating vector store...")
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_DIRECTORY
    )

    print(f"Vector store created with {len(chunks)} documents")
    return vector_store

def main():
    print("=" * 50)
    print("E-Book Content Ingestion Script")
    print("=" * 50)

    # Step 1: Load documents
    print("\n[1/3] Loading documents...")
    documents = load_documents()

    if not documents:
        print("No documents found! Check your docs directory.")
        return

    # Step 2: Split into chunks
    print("\n[2/3] Splitting documents into chunks...")
    chunks = split_documents(documents)

    # Step 3: Create vector store
    print("\n[3/3] Creating vector store...")
    vector_store = create_vector_store(chunks)

    print("\n" + "=" * 50)
    print("Ingestion complete!")
    print(f"Total documents ingested: {len(documents)}")
    print(f"Total chunks in database: {len(chunks)}")
    print("=" * 50)

if __name__ == "__main__":
    main()
