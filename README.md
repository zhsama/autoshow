# AutoShow

<div align="center">
  <img alt="autoshow logo" src="https://ajc.pics/autoshow/autoshow-cover-01.webp" width="300" />
</div>

AutoShow is a comprehensive AI-powered content processing platform built with **Next.js 15**, **React 19**, **Tailwind CSS 4**, and **shadcn/ui**. It automates the processing of audio and video content from various sources, leveraging advanced transcription services and language models to generate formatted show notes and diverse content formats.

## 🎯 New in V2: Local AI Support

🚀 **Major Update**: AutoShow now supports local AI processing with zero ongoing costs!

- **WhisperX Integration**: Local transcription with speaker diarization
- **Ollama Support**: Run LLMs locally (LLaMA, Mistral, Qwen, etc.)
- **Enhanced Video Support**: Upload local video files directly
- **Next.js 15 + React 19**: Modern web framework with Server Components
- **shadcn/ui**: Beautiful, customizable UI components

## 🏗️ Architecture

AutoShow uses a modern monorepo structure with **pnpm workspaces**:

```
apps/
└── web/              # Next.js 15 + React 19 full-stack app with API routes
packages/
├── shared/           # Shared utilities, types, and configurations
├── transcription/    # Transcription services (Deepgram, AssemblyAI, Groq, WhisperX)
└── llm/              # LLM integrations (OpenAI, Anthropic, Gemini, Ollama)
```

## 📋 Key Features

### Content Processing

- **Multiple Input Types**: YouTube videos, local video/audio files
- **Video Format Support**: MP4, MKV, AVI, MOV, WebM, MP3, WAV, M4A, AAC, OGG, FLAC
- **Automatic Conversion**: FFmpeg-powered format conversion

### Transcription Services

- **WhisperX (Local)** 🆕: Enhanced local transcription with speaker diarization
- **Groq**: Fast Whisper models via API
- **Deepgram**: Professional transcription service
- **AssemblyAI**: Advanced audio intelligence

### LLM Processing

- **Ollama (Local)** 🆕: Run models locally (LLaMA, Mistral, Qwen, Gemma)
- **OpenAI**: GPT models (o1, o3, 4o, etc.)
- **Anthropic**: Claude models (Opus, Sonnet, Haiku)
- **Google**: Gemini models (2.5 Pro, 2.0 Flash, etc.)

### Output Formats

- Summaries (short, medium, long)
- Chapter breakdowns with timestamps
- Key takeaways and quotes
- Social media posts (X, LinkedIn, Facebook)
- Creative content (rap songs, country songs, etc.)
- Blog posts and educational materials

## 🚀 Quick Start

### Option 1: Local AI Setup (Recommended)

```bash
# Clone and install
git clone https://github.com/yourusername/autoshow.git
cd autoshow
pnpm install

# Run the local AI setup script
./setup-local-ai.sh

# Start development server
pnpm dev
```

### Option 2: Cloud Services Only

```bash
# Clone and install
git clone https://github.com/yourusername/autoshow.git
cd autoshow

# Quick setup with dependency installer
./install-dependencies.sh

# OR manual setup:
pnpm install

# Set up environment variables (see Configuration)
cp apps/web/.env.example apps/web/.env.local

# Start development server
pnpm dev
```

## 🔧 System Dependencies

AutoShow requires the following system tools:

- **yt-dlp**: For downloading videos from YouTube and other platforms
- **ffmpeg**: For audio/video processing and format conversion
- **Node.js 18+** and **pnpm**: For running the application

### Quick Installation

Run the automated installer:

```bash
./install-dependencies.sh
```

### Manual Installation

**macOS (using Homebrew):**

```bash
brew install yt-dlp ffmpeg
npm install -g pnpm
```

**Linux (Ubuntu/Debian):**

```bash
# Install yt-dlp
mkdir -p ~/.local/bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ~/.local/bin/yt-dlp
chmod +x ~/.local/bin/yt-dlp
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

# Install ffmpeg
sudo apt update && sudo apt install ffmpeg

# Install pnpm
npm install -g pnpm
```

## 📖 Documentation

- [Local AI Setup Guide](./LOCAL_AI_SETUP.md) - Complete guide for WhisperX and Ollama setup
- [YouTube Issues Guide](./YOUTUBE_ISSUES.md) - Solutions for YouTube bot detection and cookie issues
- [CLAUDE.md](./CLAUDE.md) - Development guidance and project architecture

## 🛠️ Configuration

### Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
# Required for S3 storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-2
S3_BUCKET_NAME=your_s3_bucket

# Required for Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Cloud Transcription Services
DEEPGRAM_API_KEY=your_deepgram_key
ASSEMBLY_API_KEY=your_assembly_key
GROQ_API_KEY=your_groq_key

# Optional: Cloud LLM Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key

# Optional: Custom Ollama URL
OLLAMA_BASE_URL=http://localhost:11434
```

### Local AI Services (Zero Cost)

For completely free operation, use local AI services:

1. **WhisperX** for transcription (speaker diarization included)
2. **Ollama** for LLM processing

See [LOCAL_AI_SETUP.md](./LOCAL_AI_SETUP.md) for detailed setup instructions.

## 📦 Package Details

### Apps

#### @autoshow/web

Next.js 15 + React 19 web application featuring:

- Modern UI with shadcn/ui components
- Server Components and Server Actions
- Zustand state management
- File upload support for local videos
- Real-time processing status

### Packages

#### @autoshow/shared

Common utilities, types, and configurations:

- Service configurations (T_CONFIG, L_CONFIG)
- TypeScript types and interfaces
- Shared server utilities

#### @autoshow/transcription

Transcription service integrations:

- **WhisperX** 🆕 - Local transcription with speaker diarization
- **Groq** 🆕 - Fast Whisper models via API
- **Deepgram** - Professional transcription service
- **AssemblyAI** - Advanced audio intelligence

#### @autoshow/llm

Language Model integrations:

- **Ollama** 🆕 - Local LLM processing (LLaMA, Mistral, Qwen, etc.)
- **OpenAI** - GPT models (o1, o3, 4o, etc.)
- **Anthropic** - Claude models (Opus, Sonnet, Haiku)
- **Google** - Gemini models (2.5 Pro, 2.0 Flash, etc.)

## 🎯 Content Generation Options

AutoShow can generate diverse content formats including:

### Summaries and Chapters

- Concise summaries
- Detailed chapter descriptions
- Bullet-point summaries
- Chapter titles with timestamps

### Social Media Posts

- X (Twitter)
- Facebook
- LinkedIn

### Creative Content

- Rap songs
- Rock songs
- Country songs

### Educational Content

- Key takeaways
- Comprehension questions
- Frequently asked questions (FAQs)
- Curated quotes
- Blog outlines and drafts

## 📚 Documentation

- [API Endpoints](docs/01-step-endpoints.md)
- [Transcription Options](docs/02-transcription-options.md)
- [LLM Options](docs/03-llm-options.md)
- [Prompt Customization](docs/04-prompt-options.md)
- [Querying Show Notes](docs/05-querying-show-notes.md)
- [Database Schema](docs/06-database.md)
- [Test Suite](docs/07-test-suite.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @autoshow/transcription test
pnpm --filter @autoshow/llm test

# Run specific test file
pnpm test test/models.test.ts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/)
- Transcription powered by [Deepgram](https://deepgram.com/), [AssemblyAI](https://www.assemblyai.com/), and [OpenAI Whisper](https://openai.com/research/whisper)
- Content generation powered by various LLM providers

## 👥 Contributors

- ✨Hello beautiful human! ✨[Jenn Junod](https://jennjunod.dev/) host of [Teach Jenn Tech](https://teachjenntech.com/) & [Shit2TalkAbout](https://shit2talkabout.com)
