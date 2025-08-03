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

# Package-specific development
pnpm --filter web dev           # Start only web app
pnpm --filter shared build      # Build only shared package
pnpm --filter transcription build  # Build only transcription package
pnpm --filter llm build         # Build only LLM package

# Testing
pnpm test            # Run all test suites
pnpm test:models     # Test AI model integrations
pnpm test:prompts    # Test prompt configurations
pnpm test:steps      # Test workflow steps
pnpm --filter shared test:models   # Test specific model integrations

# Linting and Quality
pnpm lint            # Run ESLint across all packages
pnpm check           # Type checking across packages
pnpm clean           # Clean build artifacts

# Local AI Setup
./setup-local-ai.sh  # Set up WhisperX and Ollama for local processing
```

## Architecture & Code Structure

### Pipeline Architecture
The application follows a **processing pipeline** pattern:
1. **Input Layer**: File upload or YouTube URL processing
2. **Transcription Layer**: Multi-provider transcription services
3. **Processing Layer**: LLM-based content generation
4. **Output Layer**: Markdown-formatted show notes

### Key Directories
- `apps/web/src/app/`: Next.js 15 App Router pages and API routes
- `apps/web/src/components/`: React 19 components with shadcn/ui
- `apps/web/src/stores/`: Zustand state management stores
- `apps/web/src/hooks/`: Custom React hooks for form steps
- `packages/shared/`: Shared types, configurations, and utilities
- `packages/transcription/`: Transcription service implementations
- `packages/llm/`: LLM service implementations

### Monorepo Structure
This is a **pnpm workspace** monorepo with:
- `apps/web/`: Next.js 15 full-stack application
- `packages/*/`: Shared libraries with independent build targets
- Workspace commands use `--filter` to target specific packages

### Service Configuration Pattern
The app uses a **multi-provider pattern** for AI services defined in `packages/shared/src/types.ts`:
- `T_CONFIG`: Transcription service configurations with cost/speed metrics
- `L_CONFIG`: LLM service configurations with token cost calculations
- `ENV_VARS_MAP`: Environment variable mappings for API keys

### Component Architecture
- **Server Components**: Next.js 15 Server Components for optimal performance
- **Client Components**: React 19 components with 'use client' directive
- **State Management**: Zustand stores with TypeScript for centralized state
- **Form Steps**: Modular step components with custom hooks (`use-form-steps.ts`)
- **API Routes**: Next.js API routes handle each pipeline stage independently

## Environment Variables

Critical API keys required:
```bash
# Storage (Required)
AWS_ACCESS_KEY_ID=    # S3 storage
AWS_SECRET_ACCESS_KEY= # S3 storage
AWS_REGION=us-east-2  # AWS region
S3_BUCKET_NAME=       # S3 bucket name
SUPABASE_URL=         # Database
SUPABASE_ANON_KEY=    # Database access

# Transcription Services (Optional - use WhisperX locally)
DEEPGRAM_API_KEY=     # Transcription service
ASSEMBLY_API_KEY=     # Alternative transcription
GROQ_API_KEY=         # Fast Whisper models

# LLM Services (Optional - use Ollama locally)
OPENAI_API_KEY=       # GPT models
ANTHROPIC_API_KEY=    # Claude models  
GEMINI_API_KEY=       # Google models

# Local AI (Zero cost alternative)
OLLAMA_BASE_URL=http://localhost:11434  # Local Ollama server
```

## Development Patterns

### Pipeline API Routes
Each processing stage has a dedicated API endpoint in `apps/web/src/app/api/`:
- `/api/download-audio` - Handles YouTube URL processing and file uploads
- `/api/run-transcription` - Manages transcription service calls
- `/api/run-llm` - Processes LLM requests for content generation
- `/api/show-notes` - CRUD operations for show notes storage
- `/api/dash-balance` - Wallet and payment management

### Adding New AI Services
1. Update service configs in `packages/shared/src/types.ts` (`T_CONFIG` or `L_CONFIG`)
2. Add implementation in respective package (`packages/transcription/` or `packages/llm/`)
3. Update environment variable mapping in `ENV_VARS_MAP`
4. Add UI selection in appropriate form step component

### Working with Zustand Store
The main application state is managed in `apps/web/src/stores/form-store.ts`:
- Centralized state for all form steps and processing data
- TypeScript interfaces ensure type safety
- DevTools integration for debugging
- Actions for each state modification

### Form Step Pattern
Form components in `apps/web/src/components/FormSteps/` follow a consistent pattern:
- Use Zustand store for state management
- Custom hooks for step navigation (`use-form-steps.ts`)
- shadcn/ui components for consistent styling
- Server Actions for API communication

### Modifying Processing Pipeline
- API routes in `src/app/api/` handle each pipeline stage
- Each stage is independently testable and swappable
- State management flows through Zustand stores with TypeScript

### Testing Strategy
- **Model Tests** (`pnpm test:models`): Validate AI service integrations and API connections
- **Prompt Tests** (`pnpm test:prompts`): Verify LLM output quality and prompt effectiveness  
- **Step Tests** (`pnpm test:steps`): Ensure pipeline integrity and data flow
- **Package Tests**: Each package has independent test suites
- Use existing test structure in `test/` directory for consistency

## Important Files & Patterns

### Configuration Files
- `packages/shared/src/types.ts` - Central configuration for all AI services
- `apps/web/src/stores/form-store.ts` - Application state management
- `pnpm-workspace.yaml` - Monorepo workspace configuration
- `apps/web/next.config.ts` - Next.js configuration with optimizations

### Local Development Setup
- Run `./setup-local-ai.sh` for zero-cost local AI processing
- WhisperX provides local transcription with speaker diarization
- Ollama enables local LLM processing without API costs
- FFmpeg and yt-dlp are required system dependencies

## Configuration Notes

- **Monorepo**: Uses pnpm workspaces with `--filter` commands for package targeting
- **Next.js Config**: Runs with App Router and Server Components
- **Cost Optimization**: Service selection UI shows cost per minute/token
- **Type Safety**: All API interactions are strictly typed through shared types
- **Error Handling**: Each service includes fallback provider options
- **Local AI**: WhisperX + Ollama provide zero-cost processing alternative