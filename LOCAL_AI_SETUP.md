# AutoShow Local AI Setup Guide

This guide explains how to set up local AI services (WhisperX and Ollama) for AutoShow's transcription and LLM processing.

## WhisperX Local Transcription Setup

WhisperX provides enhanced transcription with speaker diarization and improved accuracy.

### Installation

1. Install WhisperX:
```bash
pip install whisperx
```

2. For GPU acceleration (recommended):
```bash
# For CUDA
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# For Apple Silicon (M1/M2)
pip install torch torchvision torchaudio
```

### Usage

WhisperX models available in AutoShow:
- `large-v3` - Best accuracy, slower processing
- `medium` - Good balance of speed and accuracy  
- `small` - Fast processing, good for testing
- `base` - Very fast, basic accuracy
- `tiny` - Fastest, lowest accuracy

### Features

- **Speaker Diarization**: Automatically identifies different speakers
- **Word-level Timestamps**: Precise timing for each word
- **Enhanced Accuracy**: Better transcription quality than standard Whisper
- **Local Processing**: No API calls, completely private
- **Zero Cost**: No per-minute charges

## Ollama Local LLM Setup

Ollama enables running large language models locally for show note generation.

### Installation

1. Install Ollama:
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

2. Start Ollama service:
```bash
ollama serve
```

### Model Setup

Pull models you want to use:

```bash
# Recommended models
ollama pull llama3.2:3b      # Fast, good quality
ollama pull qwen2.5:7b       # Excellent for text generation
ollama pull mistral:7b       # Good general purpose
ollama pull gemma2:9b        # Google's model, very capable

# Larger models (require more RAM)
ollama pull llama3.3:70b     # Best quality, needs 32GB+ RAM
ollama pull qwen2.5:32b      # Excellent quality, needs 16GB+ RAM
```

### Available Models in AutoShow

#### Small Models (4-8GB RAM)
- `llama3.2:1b` - Ultra fast, basic quality
- `llama3.2:3b` - Fast, good quality
- `phi3:mini` - Microsoft's efficient model
- `gemma2:2b` - Google's small model

#### Medium Models (8-16GB RAM)
- `mistral:7b` - Good general purpose
- `qwen2.5:7b` - Excellent text generation
- `codellama:7b` - Optimized for code
- `gemma2:9b` - Google's capable model

#### Large Models (16GB+ RAM)
- `qwen2.5:14b` - High quality
- `deepseek-coder-v2:16b` - Advanced coding model
- `qwen2.5:32b` - Excellent quality
- `llama3.3:70b` - Best quality (needs 32GB+ RAM)
- `mixtral:8x7b` - Mixture of experts model

### Configuration

Ollama runs on `http://localhost:11434` by default. AutoShow will automatically:

1. Check if Ollama is running
2. Pull missing models automatically
3. Use local processing with zero cost

## Environment Setup

### Required Environment Variables

```bash
# For cloud transcription services (optional)
DEEPGRAM_API_KEY=your_deepgram_key
ASSEMBLY_API_KEY=your_assembly_key
GROQ_API_KEY=your_groq_key

# For cloud LLM services (optional)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key

# For S3 storage (required)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-2
S3_BUCKET_NAME=your_bucket_name

# For Supabase (required)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

### Optional: Custom Ollama URL

If running Ollama on a different port or remote server:

```bash
OLLAMA_BASE_URL=http://localhost:11434  # Default
# or
OLLAMA_BASE_URL=http://your-server:11434
```

## Usage in AutoShow

### 1. Video/Audio Processing

- **Video URLs**: Supports YouTube, Vimeo, and other yt-dlp compatible sites
- **File Uploads**: Supports MP4, MKV, AVI, MOV, WebM, MP3, WAV, M4A, AAC, OGG, FLAC
- **Automatic Conversion**: FFmpeg automatically converts to optimal format

### 2. Transcription Options

Choose from multiple services:
- **WhisperX (Local)**: Free, private, with speaker diarization
- **Deepgram**: Cloud service, fast and accurate
- **AssemblyAI**: Cloud service, good accuracy
- **Groq**: Cloud service, very fast Whisper models

### 3. LLM Processing

Generate show notes with:
- **Ollama (Local)**: Free, private, various model sizes
- **ChatGPT**: OpenAI's models (API key required)
- **Claude**: Anthropic's models (API key required)  
- **Gemini**: Google's models (API key required)

## Performance Tips

### WhisperX Optimization

1. **GPU Usage**: Ensure CUDA/Metal is properly installed for GPU acceleration
2. **Model Selection**: Use `large-v3` for best quality, `medium` for speed/quality balance
3. **Batch Size**: Increase for faster processing with more VRAM available
4. **Diarization**: Disable if you don't need speaker identification for faster processing

### Ollama Optimization  

1. **Model Size**: Choose based on available RAM:
   - 8GB RAM: Use 3B-7B models
   - 16GB RAM: Use 7B-14B models  
   - 32GB+ RAM: Use 32B-70B models

2. **Performance Settings**:
```bash
# Increase context window
ollama run llama3.2:3b --num-ctx 4096

# Adjust temperature for creativity vs consistency
# Lower = more consistent, Higher = more creative
```

3. **Resource Management**: Monitor RAM and CPU usage, consider running on dedicated GPU server for large models

## Troubleshooting

### WhisperX Issues

1. **"WhisperX not found"**: Ensure WhisperX is installed and in PATH
2. **GPU not detected**: Install proper CUDA/PyTorch version
3. **Out of memory**: Use smaller model or reduce batch size
4. **Model download fails**: Check internet connection and disk space

### Ollama Issues

1. **"Ollama not running"**: Start with `ollama serve`
2. **Model not found**: Pull model with `ollama pull model_name`
3. **Out of memory**: Use smaller model or increase system RAM
4. **Slow performance**: Consider GPU acceleration or smaller models

### General Issues

1. **File upload fails**: Check file format and size limits
2. **FFmpeg errors**: Ensure FFmpeg is installed and in PATH  
3. **S3 upload fails**: Verify AWS credentials and bucket permissions
4. **Permission errors**: Check file system permissions for temp directories

## Cost Comparison

| Service | Type | Cost | Notes |
|---------|------|------|-------|
| WhisperX | Local | $0 | One-time setup, unlimited usage |
| Ollama | Local | $0 | One-time setup, unlimited usage |
| Deepgram | Cloud | $0.43-1.45/min | API usage charges |
| AssemblyAI | Cloud | $0.20-0.62/min | API usage charges |
| ChatGPT | Cloud | $0.075-75/1K tokens | Varies by model |
| Claude | Cloud | $0.80-75/1K tokens | Varies by model |

## Hardware Requirements

### Minimum Requirements
- **CPU**: 4 cores, 2.5GHz+
- **RAM**: 8GB system RAM
- **Storage**: 10GB free space
- **GPU**: Optional but recommended

### Recommended for Best Performance
- **CPU**: 8+ cores, 3.0GHz+
- **RAM**: 16GB+ system RAM
- **Storage**: 50GB+ free space (for models)
- **GPU**: NVIDIA RTX 3060+ or Apple M1/M2

### Enterprise/Heavy Usage
- **CPU**: 16+ cores, 3.5GHz+
- **RAM**: 32GB+ system RAM
- **Storage**: 100GB+ NVMe SSD
- **GPU**: NVIDIA RTX 4080+ or multiple GPUs