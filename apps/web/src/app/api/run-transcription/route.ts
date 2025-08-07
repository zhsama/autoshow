import { NextRequest, NextResponse } from 'next/server'
import {
  callDeepgram,
  callAssembly,
  callGroq,
  callWhisperX,
  retryTranscriptionCall,
  logTranscriptionCost,
} from '@autoshow/transcription'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      transcriptionService,
      transcriptionModel,
      audioPath,
      s3Url,
      options = {},
    } = body

    const audioSource = s3Url || audioPath
    if (!audioSource) {
      return NextResponse.json(
        { error: 'Either audioPath or s3Url must be provided' },
        { status: 400 }
      )
    }

    let transcriptionResult

    try {
      // Call the appropriate transcription service
      switch (transcriptionService) {
        case 'deepgram':
          if (!process.env.DEEPGRAM_API_KEY) {
            throw new Error('DEEPGRAM_API_KEY is not configured')
          }
          transcriptionResult = await retryTranscriptionCall(() =>
            callDeepgram(
              audioSource,
              transcriptionModel,
              process.env.DEEPGRAM_API_KEY as string
            )
          )
          break

        case 'assembly':
          if (!process.env.ASSEMBLY_API_KEY) {
            throw new Error('ASSEMBLY_API_KEY is not configured')
          }
          transcriptionResult = await retryTranscriptionCall(() =>
            callAssembly(
              audioSource,
              transcriptionModel,
              process.env.ASSEMBLY_API_KEY as string
            )
          )
          break

        case 'groq':
          if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is not configured')
          }
          transcriptionResult = await retryTranscriptionCall(() =>
            callGroq(
              audioSource,
              transcriptionModel,
              process.env.GROQ_API_KEY as string
            )
          )
          break

        case 'whisperx':
          // WhisperX runs locally, no API key needed
          const enableDiarization = options.enableDiarization !== false
          transcriptionResult = await retryTranscriptionCall(() =>
            callWhisperX(audioSource, transcriptionModel, enableDiarization)
          )
          break

        default:
          throw new Error(
            `Unsupported transcription service: ${transcriptionService}`
          )
      }

      // Calculate the transcription cost
      const transcriptionCost = await logTranscriptionCost({
        modelId: transcriptionResult.modelId,
        costPerMinuteCents: transcriptionResult.costPerMinuteCents,
        filePath: audioSource,
      })

      const wordCount = transcriptionResult.transcript
        .split(/\s+/)
        .filter((word: string) => word.length > 0).length

      return NextResponse.json({
        transcript: transcriptionResult.transcript,
        transcriptionModelUsed: transcriptionResult.modelId,
        transcriptionCostUsed: transcriptionCost / 100, // Convert cents to dollars
        wordCount,
        service: transcriptionService,
      })
    } catch (error) {
      console.error(
        `[API] Transcription failed for ${transcriptionService}:`,
        error
      )
      throw error
    }
  } catch (error) {
    console.error('[API] Error running transcription:', error)
    return NextResponse.json(
      {
        error: 'Failed to run transcription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
