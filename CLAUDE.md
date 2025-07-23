# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoShow is an automated audio/video content processing tool that generates customizable show notes. It follows a multi-stage pipeline architecture: audio input → transcription → LLM processing → formatted output.

**Core Tech Stack:**
- **Frontend**: Astro 5.7.9 (SSR mode) + SolidJS 1.9.5 + TailwindCSS 4.1.6
- **Backend**: Fastify 5.3.2 with Node.js middleware
- **AI Services**: Deepgram, AssemblyAI, Groq (transcription) + OpenAI, Anthropic, Google (LLM)
- **Storage**: AWS S3 + Supabase

## Common Development Commands

```bash
# Development
npm run dev          # Start Astro dev server with hot reload
npm run server       # Start Fastify backend server
npm run setup        # Initialize project (check .env and dependencies)

# Building & Production
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Run Astro type checking

# Testing
npm run test:base    # Run base test suite
npm run test:models  # Test AI model integrations
npm run test:prompts # Test prompt configurations
npm run test:steps   # Test workflow steps
```

## Architecture & Code Structure

### Pipeline Architecture
The application follows a **processing pipeline** pattern:
1. **Input Layer**: File upload or YouTube URL processing
2. **Transcription Layer**: Multi-provider transcription services
3. **Processing Layer**: LLM-based content generation
4. **Output Layer**: Markdown-formatted show notes

### Key Directories
- `src/components/`: SolidJS reactive components (App.tsx is main orchestrator)
- `src/pages/api/`: API endpoints for transcription, LLM processing, and show notes
- `src/services/`: Business logic for transcription, LLM, and S3 operations
- `src/types.ts`: Central type definitions for services and data models

### Service Configuration Pattern
The app uses a **multi-provider pattern** for AI services defined in `types.ts`:
- `T_CONFIG`: Transcription service configurations with cost/speed metrics
- `L_CONFIG`: LLM service configurations with token cost calculations
- `ENV_VARS_MAP`: Environment variable mappings for API keys

### Component Architecture
- **Reactive State**: SolidJS signals manage processing state across components
- **Form Groups**: `components/groups/` contains service selection components
- **Server-Side Rendering**: Astro handles page routing with SolidJS islands

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
1. Update service configs in `types.ts` (`T_CONFIG` or `L_CONFIG`)
2. Add implementation in respective service file (`src/services/`)
3. Update environment variable mapping in `ENV_VARS_MAP`
4. Add UI selection in appropriate group component

### Modifying Processing Pipeline
- API routes in `src/pages/api/` handle each pipeline stage
- Each stage is independently testable and swappable
- State management flows through SolidJS signals from `App.tsx`

### Testing Strategy
- Model tests validate AI service integrations
- Prompt tests verify LLM output quality
- Step tests ensure pipeline integrity
- Use existing test structure in respective test files

## Configuration Notes

- **Astro Config**: Runs in server mode with Node.js middleware adapter
- **Cost Optimization**: Service selection UI shows cost per minute/token
- **Type Safety**: All API interactions are strictly typed through `types.ts`
- **Error Handling**: Each service includes fallback provider options