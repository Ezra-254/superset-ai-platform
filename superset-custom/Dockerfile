FROM apache/superset:latest

USER root

# Install system build dependencies for MySQL
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    gcc \
    python3-dev \
    libssl-dev \
    libffi-dev \
  && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python3 -m venv /app/.venv

# Activate venv and install dependencies
RUN /bin/bash -c "source /app/.venv/bin/activate && \
    pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir mysqlclient pymysql apache-superset"

# Copy custom logo
COPY static/smart-logo-final.png /app/superset/static/assets/images/superset-logo-horiz.png
COPY static/smart-logo-final.png /app/.venv/lib/python3.10/site-packages/superset/static/assets/images/superset-logo-horiz.png
COPY static/logo-smart.png /app/superset/static/assets/images/favicon.png
COPY static/logo-smart.png /app/.venv/lib/python3.10/site-packages/superset/static/assets/images/favicon.png

# Ensure Superset runs as non-root user
USER superset

# Use /app/.venv/bin/python for Superset commands
ENV PATH="/app/.venv/bin:$PATH"
