# Humanoid Robotics E-book with RAG Chatbot

This project is a Docusaurus-based e-book on Humanoid Robotics, enhanced with a sophisticated, AI-powered chatbot. The chatbot uses a Retrieval-Augmented Generation (RAG) architecture to answer questions based on the book's content.

## Features

- **Interactive E-book:** Built with Docusaurus, providing a modern and readable platform for the book content.
- **RAG-Powered Chatbot:** A smart assistant that can answer questions by retrieving information directly from the book's text.
- **Secure Backend:** A production-ready FastAPI backend serves the RAG pipeline, protected by a JWT-based authentication system.
- **Embeddable Chat UI:** A React-based chat widget is seamlessly integrated into the Docusaurus site.
- **Auth-Aware UI:** The chat widget includes a full authentication flow (login/logout).
- **Contextual Chat:** The widget supports a "selected-text mode," allowing users to highlight text on the page and ask questions about it.

## Architecture

The system consists of three main components:

1.  **Frontend (Docusaurus):** The `Docusaurus` site that serves the book content. It includes the custom `React` chat widget.
2.  **Backend (FastAPI):** A `FastAPI` server located in the `chatbot_api/` directory. It exposes the RAG endpoint, handles authentication, and serves the chatbot's responses.
3.  **Ingestion Pipeline:** A `Python` script located in the `scripts/` directory that processes the book's content, creates vector embeddings, and stores them in a local `ChromaDB` database.

---

## Setup and Installation

Follow these steps to set up and run the entire system locally.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (LTS version recommended)
-   [Python](https://www.python.org/downloads/) (version 3.9 or higher)
-   `pip` (Python package installer)

### Step 1: Install Frontend Dependencies

Install the necessary Node.js packages for the Docusaurus site.

```bash
npm install
```

### Step 2: Install Ingestion & Backend Dependencies

This project uses two separate `requirements.txt` files for the ingestion script and the backend API.

Install the dependencies for the ingestion script:

```bash
pip install -r scripts/requirements.txt
```

Install the dependencies for the backend API:

```bash
pip install -r chatbot_api/requirements.txt
```

### Step 3: Configure the Backend Environment

1.  Navigate to the `chatbot_api` directory.
2.  Create a `.env` file by copying the template:
    ```bash
    # In the chatbot_api directory
    cp .env_template .env
    ```
3.  Open the `.env` file and add your secret keys for `OPENAI_API_KEY` and `COHERE_API_KEY`.

---

## How to Run the System

To run the application, you must start the three components in the correct order.

### 1. Run the Data Ingestion

First, run the ingestion script to process the book's content and create the vector database. This only needs to be done once, or whenever the book's content changes.

From the project's root directory, run:

```bash
python scripts/ingest.py
```

This will create a `db/` directory in the project root, which contains the vector store.

### 2. Start the Backend API

With the database created, start the FastAPI server.

From the `chatbot_api` directory, run:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Start the Frontend Application

Finally, start the Docusaurus development server.

From the project's root directory, run:

```bash
npm run start
```

Your e-book and chatbot will be available at `http://localhost:3000`.

## Using the Chatbot

-   **Login:** Open the chat widget and use the following credentials to log in:
    -   **Username:** `testuser`
    -   **Password:** `password`
-   **Normal Mode:** Type a question into the input box and press Enter.
-   **Selected-Text Mode:** Highlight any text on a page. A small "Ask AI" button will appear. Click it to ask a question about the selected text.
