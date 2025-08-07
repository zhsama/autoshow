// packages/llm/src/ollama.ts

import type { LLMResult, LLMUsage } from '@autoshow/shared/server'
import { err, l, L_CONFIG } from '@autoshow/shared/server'

const pre = '[llm.ollama]'

export interface OllamaResponse {
  model: string
  created_at: string
  response?: string
  message?: {
    role: string
    content: string
  }
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callOllama(
  prompt: string,
  transcript: string,
  modelId: string | null,
  temperature: number = 0.7,
  maxTokens: number = 4000,
  ollamaBaseUrl: string = 'http://localhost:11434'
): Promise<LLMResult> {
  const methodLogPrefix = `${pre}:callOllama`
  l(`${methodLogPrefix} Starting Ollama LLM call with model: ${modelId}`)

  if (!modelId) {
    err(`${methodLogPrefix} Ollama model must be specified`)
    throw new Error('Ollama model must be specified')
  }

  const modelInfo = L_CONFIG.ollama.models.find(m => m.modelId === modelId)
  if (!modelInfo) {
    err(
      `${methodLogPrefix} Model information for model ${modelId} is not defined`
    )
    throw new Error(`Model information for model ${modelId} is not defined.`)
  }

  // Check if Ollama is running
  try {
    const healthResponse = await fetch(`${ollamaBaseUrl}/api/tags`)
    if (!healthResponse.ok) {
      throw new Error(`Ollama server not responding at ${ollamaBaseUrl}`)
    }

    // Check if the model is available
    const { models } = await healthResponse.json()
    const modelAvailable = models?.some((m: any) => m.name === modelId)

    if (!modelAvailable) {
      l(
        `${methodLogPrefix} Model ${modelId} not found locally, attempting to pull...`
      )

      // Try to pull the model
      const pullResponse = await fetch(`${ollamaBaseUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelId }),
      })

      if (!pullResponse.ok) {
        throw new Error(`Failed to pull model ${modelId}`)
      }

      // Stream the pull progress
      const reader = pullResponse.body?.getReader()
      if (reader) {
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.trim().split('\n')
          for (const line of lines) {
            try {
              const progress = JSON.parse(line)
              if (progress.status) {
                l(`${methodLogPrefix} Pull progress: ${progress.status}`)
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      l(`${methodLogPrefix} Successfully pulled model ${modelId}`)
    }
  } catch (error) {
    err(
      `${methodLogPrefix} Ollama is not running or not accessible at ${ollamaBaseUrl}`
    )
    throw new Error(
      `Ollama is not running. Please start Ollama with: ollama serve`
    )
  }

  // Prepare the messages for chat completion
  const messages: OllamaChatMessage[] = [
    {
      role: 'system',
      content:
        "You are a helpful assistant that creates show notes from transcripts. Follow the user's instructions carefully.",
    },
    {
      role: 'user',
      content: `${prompt}\n\nTranscript:\n${transcript}`,
    },
  ]

  l(`${methodLogPrefix} Sending request to Ollama with model ${modelId}`)

  const startTime = Date.now()

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      err(`${methodLogPrefix} Ollama API request failed: ${errorText}`)
      throw new Error(`Ollama API request failed: ${errorText}`)
    }

    const result: OllamaResponse = await response.json()

    if (!result.message?.content) {
      err(`${methodLogPrefix} No content in Ollama response`)
      throw new Error('No content in Ollama response')
    }

    const endTime = Date.now()
    const totalDuration = endTime - startTime

    l(`${methodLogPrefix} Ollama call completed in ${totalDuration}ms`)

    // Calculate token usage from response metrics
    const usage: LLMUsage = {
      stopReason: result.done ? 'stop' : 'unknown',
      input: result.prompt_eval_count || 0,
      output: result.eval_count || 0,
      total: (result.prompt_eval_count || 0) + (result.eval_count || 0),
    }

    l(
      `${methodLogPrefix} Token usage - Input: ${usage.input}, Output: ${usage.output}, Total: ${usage.total}`
    )

    return {
      content: result.message.content,
      usage,
    }
  } catch (error) {
    err(`${methodLogPrefix} Ollama request failed:`, error)
    throw error
  }
}

// Alternative streaming implementation for real-time responses
export async function callOllamaStream(
  prompt: string,
  transcript: string,
  modelId: string | null,
  onChunk: (chunk: string) => void,
  temperature: number = 0.7,
  maxTokens: number = 4000,
  ollamaBaseUrl: string = 'http://localhost:11434'
): Promise<LLMResult> {
  const methodLogPrefix = `${pre}:callOllamaStream`
  l(`${methodLogPrefix} Starting Ollama streaming call with model: ${modelId}`)

  if (!modelId) {
    err(`${methodLogPrefix} Ollama model must be specified`)
    throw new Error('Ollama model must be specified')
  }

  const messages: OllamaChatMessage[] = [
    {
      role: 'system',
      content:
        "You are a helpful assistant that creates show notes from transcripts. Follow the user's instructions carefully.",
    },
    {
      role: 'user',
      content: `${prompt}\n\nTranscript:\n${transcript}`,
    },
  ]

  const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelId,
      messages,
      stream: true,
      options: {
        temperature,
        num_predict: maxTokens,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ollama API request failed: ${errorText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body reader available')
  }

  const decoder = new TextDecoder()
  let fullContent = ''
  let totalTokens = 0
  let inputTokens = 0
  let outputTokens = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.trim().split('\n')

    for (const line of lines) {
      try {
        const data = JSON.parse(line)

        if (data.message?.content) {
          fullContent += data.message.content
          onChunk(data.message.content)
        }

        // Capture token metrics from the final response
        if (data.done) {
          inputTokens = data.prompt_eval_count || 0
          outputTokens = data.eval_count || 0
          totalTokens = inputTokens + outputTokens
        }
      } catch (e) {
        // Ignore parse errors for incomplete chunks
      }
    }
  }

  l(
    `${methodLogPrefix} Streaming completed. Total content length: ${fullContent.length}`
  )

  return {
    content: fullContent,
    usage: {
      stopReason: 'stop',
      input: inputTokens,
      output: outputTokens,
      total: totalTokens,
    },
  }
}

// List available Ollama models
export async function listOllamaModels(
  ollamaBaseUrl: string = 'http://localhost:11434'
): Promise<string[]> {
  const methodLogPrefix = `${pre}:listOllamaModels`
  l(`${methodLogPrefix} Fetching available Ollama models`)

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/tags`)
    if (!response.ok) {
      throw new Error('Failed to fetch Ollama models')
    }

    const { models } = await response.json()
    const modelNames = models?.map((m: any) => m.name) || []

    l(`${methodLogPrefix} Found ${modelNames.length} available models`)
    return modelNames
  } catch (error) {
    err(`${methodLogPrefix} Failed to list models:`, error)
    return []
  }
}
