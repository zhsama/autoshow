# AutoShow Monorepo

<div align="center">
  <img alt="autoshow logo" src="https://ajc.pics/autoshow/autoshow-cover-01.webp" width="300" />
</div>

AutoShow is a comprehensive AI-powered podcast and content processing platform built with Astro, SolidJS, and Fastify. It automates the processing of audio and video content from various sources, leveraging advanced transcription services and language models to generate formatted show notes and diverse content formats.

## 🏗️ Monorepo Structure

This project uses pnpm workspaces to manage multiple packages:

```
packages/
├── shared/          # Shared utilities, types, and configurations
├── transcription/   # Transcription services (Deepgram, AssemblyAI, Whisper)
├── llm/             # LLM integrations (OpenAI, Anthropic, Gemini, Groq, etc.)
├── ui/              # Reusable UI components (SolidJS)
├── api/             # Backend API server (Fastify)
└── web/             # Frontend web application (Astro + SolidJS)
```

## 📋 Key Features

- **Multiple Input Support**: YouTube videos, playlists, podcast RSS feeds, and local media files
- **Advanced Transcription**: Deepgram, AssemblyAI, and OpenAI Whisper integration
- **Multi-LLM Support**: OpenAI, Anthropic, Google Gemini, Groq, Cohere, Mistral, and more
- **Customizable Output**: Generate summaries, chapters, social media posts, creative content, and educational materials
- **Real-time Processing**: Live status updates and progress tracking
- **S3 Integration**: Optional cloud storage for processed content
- **Markdown Output**: Formatted content with metadata

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- API keys for transcription and LLM services (see Configuration section)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/autoshow.git
cd autoshow

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server
pnpm dev
```

Open [localhost:4321](http://localhost:4321/) to access the web interface.

### Development Commands

```bash
# Run all packages in development mode
pnpm dev

# Run specific package
pnpm --filter @autoshow/web dev
pnpm --filter @autoshow/api dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## 📦 Package Details

### @autoshow/shared
Common utilities, types, and configurations used across all packages.

### @autoshow/transcription
Transcription service integrations:
- **Deepgram** - Fast, accurate transcription
- **AssemblyAI** - Advanced transcription with speaker detection
- **OpenAI Whisper** - Local or API-based transcription

### @autoshow/llm
Language Model integrations for content generation:
- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
- **Google** (Gemini 1.5 Pro, Flash)
- **Groq** (Llama 3, Mixtral)
- **Cohere** (Command R+)
- **Mistral** (Large, Medium, Small)
- **Fireworks**
- **Together**
- **Perplexity**

### @autoshow/ui
Reusable SolidJS components for the user interface.

### @autoshow/api
Fastify-based API server handling:
- Audio/video downloads
- Transcription processing
- Content generation
- S3 storage integration

### @autoshow/web
Astro-based web application providing:
- User interface for content processing
- Show notes viewing and management
- Real-time processing status updates

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Transcription Services
DEEPGRAM_API_KEY=your_deepgram_key
ASSEMBLY_API_KEY=your_assembly_key
OPENAI_API_KEY=your_openai_key  # For Whisper

# LLM Services
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
COHERE_API_KEY=your_cohere_key
MISTRAL_API_KEY=your_mistral_key
FIREWORKS_API_KEY=your_fireworks_key
TOGETHER_API_KEY=your_together_key
PERPLEXITY_API_KEY=your_perplexity_key

# S3 Storage (Optional)
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
S3_REGION=your_s3_region
S3_BUCKET_NAME=your_s3_bucket

# Other
VERCEL_URL=http://localhost:3000  # For local development
```

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

- Built with [Astro](https://astro.build/), [SolidJS](https://www.solidjs.com/), and [Fastify](https://www.fastify.io/)
- Transcription powered by [Deepgram](https://deepgram.com/), [AssemblyAI](https://www.assemblyai.com/), and [OpenAI Whisper](https://openai.com/research/whisper)
- Content generation powered by various LLM providers

## 👥 Contributors

- ✨Hello beautiful human! ✨[Jenn Junod](https://jennjunod.dev/) host of [Teach Jenn Tech](https://teachjenntech.com/) & [Shit2TalkAbout](https://shit2talkabout.com)