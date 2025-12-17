# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies that might be needed by Python packages
# For example, if you were using a library that needed build-essential
# RUN apt-get update && apt-get install -y build-essential

# Copy the requirements file into the container at /app
COPY ./requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
# --no-cache-dir: Disables the cache, which can reduce image size
# --trusted-host pypi.python.org: Can help in some network environments
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy the rest of the application's code into the container at /app
COPY ./app /app/app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable to ensure python prints things without buffering
ENV PYTHONUNBUFFERED 1

# Run main.py when the container launches
# The host "0.0.0.0" makes the server accessible from outside the container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
