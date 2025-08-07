// src/services/groq.ts

import { err, l, readFile, T_CONFIG } from '@autoshow/shared/server'
import { formatTimestamp } from './transcription.js'

const pre = '[transcription.groq]'

export interface GroqTranscriptionResponse {
  text: string
  segments?: Array<{
    id: number
    seek: number
    start: number
    end: number
    text: string
    tokens: number[]
    temperature: number
    avg_logprob: number
    compression_ratio: number
    no_speech_prob: number
  }>
  language?: string
  duration?: number
}

export function formatGroqTranscript(
  result: GroqTranscriptionResponse
): string {
  l(`${pre}:formatGroqTranscript Formatting transcript from Groq`)

  // If segments are available, use them for timestamp formatting
  if (result.segments && result.segments.length > 0) {
    l(
      `${pre}:formatGroqTranscript Found ${result.segments.length} segments to format`
    )

    let txtContent = ''

    result.segments.forEach((segment, index) => {
      l(
        `${pre}:formatGroqTranscript Processing segment ${index + 1}/${result.segments!.length}`
      )
      const timestamp = formatTimestamp(segment.start)
      txtContent += `[${timestamp}] ${segment.text.trim()}\n`
    })

    txtContent += '\n'
    l(
      `${pre}:formatGroqTranscript Formatting complete with timestamps, content length: ${txtContent.length}`
    )
    return txtContent
  }

  // Fallback to plain text if no segments
  l(`${pre}:formatGroqTranscript No segments found, returning plain text`)
  return `${result.text}\n`
}

export async function callGroq(
  audioSource: string,
  groqModel: string | null,
  groqApiKey: string
): Promise<{
  transcript: string
  modelId: string
  costPerMinuteCents: number
}> {
  const methodLogPrefix = `${pre}:callGroq`
  l(`${methodLogPrefix} Starting Groq transcription with model: ${groqModel}`)

  if (!groqApiKey) {
    err(`${methodLogPrefix} GROQ_API_KEY environment variable is not set`)
    throw new Error('GROQ_API_KEY environment variable is not set.')
  }

  if (!groqModel) {
    err(`${methodLogPrefix} Groq model must be specified`)
    throw new Error('Groq model must be specified')
  }

  const modelInfo = T_CONFIG.groq.models.find(
    m => m.modelId.toLowerCase() === groqModel.toLowerCase()
  )
  if (!modelInfo) {
    err(
      `${methodLogPrefix} Model information for model ${groqModel} is not defined`
    )
    throw new Error(`Model information for model ${groqModel} is not defined.`)
  }

  const { modelId, costPerMinuteCents } = modelInfo
  l(
    `${methodLogPrefix} Using Groq model: ${modelId} with cost: ¢${costPerMinuteCents} per minute`
  )

  let audioBuffer: Buffer

  if (audioSource.startsWith('http')) {
    l(`${methodLogPrefix} Downloading audio from URL: ${audioSource}`)
    const response = await fetch(audioSource)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch audio from URL: ${response.status} ${response.statusText}`
      )
    }
    audioBuffer = Buffer.from(await response.arrayBuffer())
    l(
      `${methodLogPrefix} Successfully downloaded audio, size: ${audioBuffer.length} bytes`
    )
  } else {
    const wavPath = audioSource.endsWith('.wav')
      ? audioSource
      : `${audioSource}.wav`
    l(`${methodLogPrefix} Reading audio file at ${wavPath}`)
    try {
      audioBuffer = await readFile(wavPath)
      l(
        `${methodLogPrefix} Successfully read audio file, size: ${audioBuffer.length} bytes`
      )
    } catch (error) {
      err(`${methodLogPrefix} Failed to load audio file:`, error)
      throw new Error(
        `Failed to load audio file at ${wavPath}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  // Check file size limit (25MB for Groq)
  const maxSizeBytes = 25 * 1024 * 1024
  if (audioBuffer.length > maxSizeBytes) {
    err(
      `${methodLogPrefix} Audio file size ${audioBuffer.length} exceeds Groq limit of ${maxSizeBytes} bytes`
    )
    throw new Error(
      `Audio file size exceeds Groq's 25MB limit. Please use a smaller file or split it.`
    )
  }

  l(
    `${methodLogPrefix} Sending ${audioBuffer.length} bytes to Groq API with model ${modelId}`
  )

  // Create form data for multipart upload
  const formData = new FormData()
  const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' })
  formData.append('file', audioBlob, 'audio.wav')
  formData.append('model', modelId)
  formData.append('response_format', 'verbose_json') // Get segments with timestamps
  formData.append('language', 'en') // Can be made configurable

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: formData,
      }
    )

    const statusCode = response.status
    l(`${methodLogPrefix} Received response with status: ${statusCode}`)

    if (!response.ok) {
      let errorMsg = `Groq API request failed with status ${statusCode}`
      try {
        const errorBody = await response.text()
        errorMsg += `: ${errorBody}`
      } catch (e) {
        err(`${methodLogPrefix} Failed to read error response body:`, e)
      }

      err(`${methodLogPrefix} ${errorMsg}`)
      throw new Error(errorMsg)
    }

    let responseText: string
    try {
      responseText = await response.text()
      l(
        `${methodLogPrefix} Received response text of length: ${responseText.length}`
      )
    } catch (e) {
      err(`${methodLogPrefix} Failed to read Groq response:`, e)
      throw new Error(
        `Failed to read Groq response: ${e instanceof Error ? e.message : String(e)}`
      )
    }

    let result: GroqTranscriptionResponse
    try {
      result = JSON.parse(responseText)
      l(`${methodLogPrefix} Successfully parsed JSON response`)
    } catch (e) {
      err(`${methodLogPrefix} Invalid JSON in Groq response:`, e)
      throw new Error(
        `Invalid JSON in Groq response: ${e instanceof Error ? e.message : String(e)}. Response text: ${responseText.substring(0, 100)}...`
      )
    }

    l(`${methodLogPrefix} Formatting Groq transcript`)
    const txtContent = formatGroqTranscript(result)
    l(
      `${methodLogPrefix} Successfully formatted transcript, length: ${txtContent.length}`
    )

    return {
      transcript: txtContent,
      modelId,
      costPerMinuteCents,
    }
  } catch (error) {
    err(`${methodLogPrefix} Groq API request failed:`, error)
    throw error
  }
}
