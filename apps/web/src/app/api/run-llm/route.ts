import { NextRequest, NextResponse } from 'next/server'
import { callOllama } from '@autoshow/llm'
import { storageService } from '@autoshow/shared/server'
import { L_CONFIG } from '@autoshow/shared/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      showNoteId,
      llmService,
      llmModel,
      prompt,
      transcript,
      temperature = 0.7,
      maxTokens = 4000,
    } = body

    if (!llmService || !llmModel) {
      return NextResponse.json(
        { error: 'LLM service and model must be specified' },
        { status: 400 }
      )
    }

    if (!prompt || !transcript) {
      return NextResponse.json(
        { error: 'Prompt and transcript are required' },
        { status: 400 }
      )
    }

    let llmResult
    let llmCost = 0

    try {
      // Call the appropriate LLM service
      switch (llmService) {
        case 'ollama':
          // Ollama runs locally
          llmResult = await callOllama(
            prompt,
            transcript,
            llmModel,
            temperature,
            maxTokens
          )
          // Local models have no cost
          llmCost = 0
          break

        case 'chatgpt':
          // TODO: Implement OpenAI ChatGPT integration
          throw new Error('ChatGPT integration not yet implemented')

        case 'claude':
          // TODO: Implement Anthropic Claude integration
          throw new Error('Claude integration not yet implemented')

        case 'gemini':
          // TODO: Implement Google Gemini integration
          throw new Error('Gemini integration not yet implemented')

        case 'groq':
          // TODO: Implement Groq LLM integration
          throw new Error('Groq LLM integration not yet implemented')

        default:
          throw new Error(`Unsupported LLM service: ${llmService}`)
      }

      // Calculate token costs if applicable
      if (llmResult.usage && llmService !== 'ollama') {
        const modelConfig = L_CONFIG[
          llmService as keyof typeof L_CONFIG
        ]?.models.find(m => m.modelId === llmModel)

        if (
          modelConfig &&
          'inputCostC' in modelConfig &&
          'outputCostC' in modelConfig
        ) {
          const inputCost =
            ((llmResult.usage.input || 0) * modelConfig.inputCostC) / 100000
          const outputCost =
            ((llmResult.usage.output || 0) * modelConfig.outputCostC) / 100000
          llmCost = inputCost + outputCost
        }
      }

      // Update show note with LLM output if showNoteId is provided
      if (showNoteId) {
        await storageService.updateShowNote(showNoteId, {
          llmOutput: llmResult.content,
          llmService,
          llmModel,
          llmCost,
        })
      }

      return NextResponse.json({
        llmOutput: llmResult.content,
        llmService,
        llmModel,
        llmCost,
        usage: llmResult.usage,
        showNoteId,
      })
    } catch (error) {
      console.error(`[API] LLM processing failed for ${llmService}:`, error)
      throw error
    }
  } catch (error) {
    console.error('[API] Error running LLM:', error)
    return NextResponse.json(
      {
        error: 'Failed to run LLM processing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
