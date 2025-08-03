# Use Python 3.11 with CUDA support
FROM nvidia/cuda:11.8-devel-ubuntu22.04

# Set environment variables
ENV PYTHON_VERSION=3.11
ENV DEBIAN_FRONTEND=noninteractive
ENV CUDA_HOME=/usr/local/cuda
ENV PATH=${CUDA_HOME}/bin:${PATH}
ENV LD_LIBRARY_PATH=${CUDA_HOME}/lib64:${LD_LIBRARY_PATH}

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3.11-dev \
    python3-pip \
    ffmpeg \
    git \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic links
RUN ln -s /usr/bin/python3.11 /usr/bin/python
RUN ln -s /usr/bin/python3.11 /usr/bin/python3

# Set working directory
WORKDIR /app

# Install Python dependencies
RUN pip install --no-cache-dir \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118 \
    whisperx \
    fastapi \
    uvicorn \
    python-multipart \
    aiofiles

# Create directories
RUN mkdir -p /app/models /app/temp

# Copy WhisperX API server
COPY whisperx_server.py /app/
COPY requirements.txt /app/

# Install additional requirements if any
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "whisperx_server:app", "--host", "0.0.0.0", "--port", "8000"]