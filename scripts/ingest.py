import os
import shutil
from glob import glob
from multiprocessing import Pool
from tqdm import tqdm

from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# --- Configuration ---
# Source directory for the book's markdown files
SOURCE_DIRECTORY = "docs"
# Directory to save the vector store
PERSIST_DIRECTORY = "db"
# Embedding model to use
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
# Text splitting parameters
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

def load_single_document(file_path):
    """Loads a single document from a file path."""
    try:
        loader = UnstructuredMarkdownLoader(file_path)
        return loader.load()[0]
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None

def load_documents(source_dir):
    """Loads all markdown documents from the source directory in parallel."""
    all_files = glob(os.path.join(source_dir, "**/*.md"), recursive=True)
    
    with Pool(processes=os.cpu_count()) as pool:
        documents = list(tqdm(pool.imap(load_single_document, all_files), total=len(all_files), desc="Loading documents"))
    
    # Filter out any documents that failed to load
    documents = [doc for doc in documents if doc is not None]
    return documents

def main():
    """
    Main function to run the document ingestion pipeline.
    """
    print("--- Starting Document Ingestion Pipeline ---")

    # Cleanup existing vector store
    if os.path.exists(PERSIST_DIRECTORY):
        print(f"Removing existing vector store at {PERSIST_DIRECTORY}...")
        shutil.rmtree(PERSIST_DIRECTORY)
    
    # 1. Load documents
    print(f"Loading documents from '{SOURCE_DIRECTORY}'...")
    documents = load_documents(SOURCE_DIRECTORY)
    if not documents:
        print("No documents found. Exiting.")
        return
    print(f"Loaded {len(documents)} documents.")

    # 2. Split documents into chunks
    print("Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    # 3. Create embeddings
    print(f"Creating embeddings using '{EMBEDDING_MODEL}' model...")
    # Using device='cpu' to ensure compatibility, change to 'cuda' if you have a GPU
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL, model_kwargs={'device': 'cpu'})

    # 4. Create and persist the vector store
    print(f"Creating and persisting vector store at '{PERSIST_DIRECTORY}'...")
    db = Chroma.from_documents(
        chunks, 
        embeddings, 
        persist_directory=PERSIST_DIRECTORY
    )

    # 5. Test the vector store
    print("Testing the vector store...")
    query = "What is a digital twin?"
    try:
        retrieved_docs = db.similarity_search(query, k=3)
        if retrieved_docs:
            print(f"Successfully retrieved {len(retrieved_docs)} documents for test query.")
            print("--- Document Ingestion Pipeline Complete ---")
        else:
            print("Test query returned no results. The vector store might be empty or there was an issue.")
    except Exception as e:
        print(f"An error occurred during the vector store test: {e}")


if __name__ == "__main__":
    main()
