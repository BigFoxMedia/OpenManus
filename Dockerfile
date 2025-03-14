FROM python:3.12

RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libdrm2 \
    libxkbcommon0 \
    libasound2 && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Install Playwright
RUN pip install playwright && \
    python -m playwright install

# Copy application source code
COPY . .

# Expose the API port (8000)
EXPOSE 8000

# Run the API via uvicorn (web_server.py)
CMD ["uvicorn", "web_server:app", "--host", "0.0.0.0", "--port", "8000"]
