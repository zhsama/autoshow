# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoShow is an automated audio/video content processing tool that generates customizable show notes. It follows a multi-stage pipeline architecture: audio input → transcription → LLM processing → formatted output.

**Core Tech Stack:**
- **Frontend & Backend**: Next.js 15 + React 19 + TypeScript (full-stack app with API routes)
- **UI**: shadcn/ui + Tailwind CSS 4 + Radix UI
- **State Management**: Zustand store with TypeScript
- **AI Services**: Deepgram, AssemblyAI, Groq, WhisperX (transcription) + OpenAI, Anthropic, Google, Ollama (LLM)
- **Storage**: AWS S3 + Supabase

## Common Development Commands

```bash
# Development
pnpm dev             # Start Next.js dev server with hot reload
pnpm build           # Build all packages and Next.js app
pnpm start           # Start production server
pnpm setup           # Initialize project (install dependencies and build)

# Testing
pnpm test            # Run all test suites
pnpm test:models     # Test AI model integrations
pnpm test:prompts    # Test prompt configurations
pnpm test:steps      # Test workflow steps

# Linting
pnpm lint            # Run ESLint across all packages
```

## Architecture & Code Structure

### Pipeline Architecture
The application follows a **processing pipeline** pattern:
1. **Input Layer**: File upload or YouTube URL processing
2. **Transcription Layer**: Multi-provider transcription services
3. **Processing Layer**: LLM-based content generation
4. **Output Layer**: Markdown-formatted show notes

### Key Directories
- `src/app/`: Next.js 15 App Router pages and API routes
- `src/components/`: React 19 components with shadcn/ui
- `src/stores/`: Zustand state management stores
- `src/hooks/`: Custom React hooks for form steps
- `packages/shared/`: Shared types, configurations, and utilities
- `packages/transcription/`: Transcription service implementations
- `packages/llm/`: LLM service implementations

### Service Configuration Pattern
The app uses a **multi-provider pattern** for AI services defined in `packages/shared/src/types.ts`:
- `T_CONFIG`: Transcription service configurations with cost/speed metrics
- `L_CONFIG`: LLM service configurations with token cost calculations
- `ENV_VARS_MAP`: Environment variable mappings for API keys

### Component Architecture
- **Server Components**: Next.js 15 Server Components for optimal performance
- **Client Components**: React 19 components with 'use client' directive
- **State Management**: Zustand stores replace prop drilling
- **Form Steps**: Modular step components with custom hooks

## Environment Variables

Critical API keys required:
```bash
DEEPGRAM_API_KEY=     # Transcription service
ASSEMBLY_API_KEY=     # Alternative transcription
OPENAI_API_KEY=       # GPT models
ANTHROPIC_API_KEY=    # Claude models  
GEMINI_API_KEY=       # Google models
AWS_ACCESS_KEY_ID=    # S3 storage
AWS_SECRET_ACCESS_KEY= # S3 storage
SUPABASE_URL=         # Database
SUPABASE_ANON_KEY=    # Database access
```

## Development Patterns

### Adding New AI Services
1. Update service configs in `packages/shared/src/types.ts` (`T_CONFIG` or `L_CONFIG`)
2. Add implementation in respective package (`packages/transcription/` or `packages/llm/`)
3. Update environment variable mapping in `ENV_VARS_MAP`
4. Add UI selection in appropriate form step component

### Modifying Processing Pipeline
- API routes in `src/app/api/` handle each pipeline stage
- Each stage is independently testable and swappable
- State management flows through Zustand stores with TypeScript

### Testing Strategy
- Model tests validate AI service integrations
- Prompt tests verify LLM output quality
- Step tests ensure pipeline integrity
- Use existing test structure in respective test files

## Configuration Notes

- **Next.js Config**: Runs with App Router and Server Components
- **Cost Optimization**: Service selection UI shows cost per minute/token
- **Type Safety**: All API interactions are strictly typed through shared types
- **Error Handling**: Each service includes fallback provider options