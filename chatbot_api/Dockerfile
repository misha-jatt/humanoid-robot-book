# Hugging Face Spaces Docker Template
# https://huggingface.co/docs/hub/spaces-sdks-docker

FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for Hugging Face Spaces
# HF Spaces runs containers as user with uid 1000
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Copy the requirements file and install dependencies
COPY --chown=user ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Switch to non-root user
USER user

# Copy the application code with correct ownership
COPY --chown=user ./app /app/app

# Copy the ChromaDB database (pre-built vector store)
COPY --chown=user ./db /app/db

# Hugging Face Spaces requires port 7860
EXPOSE 7860

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    GRADIO_SERVER_NAME=0.0.0.0 \
    GRADIO_SERVER_PORT=7860

# Health check for HF Spaces
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/health')" || exit 1

# Run the FastAPI server on port 7860 (required by HF Spaces)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
