FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends gcc && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y gcc && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Copy application source code
COPY . .

# Expose the API port (8000)
EXPOSE 8000

# Run the API via uvicorn (web_server.py)
CMD ["uvicorn", "web_server:app", "--host", "0.0.0.0", "--port", "8000"]
