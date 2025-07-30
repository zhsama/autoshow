// src/services/whisperx.ts

import { execPromise, readFile, existsSync, l, err } from "@autoshow/shared/server"
import { T_CONFIG } from '@autoshow/shared/server'
import { formatTimestamp } from './transcription.js'

const pre = "[transcription.whisperx]"

export interface WhisperXSegment {
  start: number
  end: number
  text: string
  speaker?: string
  confidence?: number
}

export interface WhisperXWord {
  word: string
  start: number
  end: number
  confidence: number
  speaker?: string
}

export interface WhisperXResult {
  segments: WhisperXSegment[]
  words?: WhisperXWord[]
  language?: string
  duration?: number
}

export function formatWhisperXTranscript(result: WhisperXResult): string {
  l(`${pre}:formatWhisperXTranscript Formatting transcript from WhisperX`)
  
  const segments = result.segments || []
  l(`${pre}:formatWhisperXTranscript Found ${segments.length} segments to format`)
  
  let txtContent = ''
  let currentSpeaker = ''
  
  segments.forEach((segment: WhisperXSegment, index: number) => {
    l(`${pre}:formatWhisperXTranscript Processing segment ${index+1}/${segments.length}`)
    
    const timestamp = formatTimestamp(segment.start)
    
    // Add speaker diarization if available
    if (segment.speaker && segment.speaker !== currentSpeaker) {
      currentSpeaker = segment.speaker
      txtContent += `\n[Speaker ${currentSpeaker}]\n`
    }
    
    txtContent += `[${timestamp}] ${segment.text}\n`
  })
  
  txtContent += '\n'
  
  l(`${pre}:formatWhisperXTranscript Formatting complete, content length: ${txtContent.length}`)
  return txtContent
}

export async function callWhisperX(
  audioSource: string, 
  whisperxModel: string | null,
  enableDiarization: boolean = true
): Promise<{
  transcript: string
  modelId: string
  costPerMinuteCents: number
}> {
  const methodLogPrefix = `${pre}:callWhisperX`
  l(`${methodLogPrefix} Starting WhisperX transcription with model: ${whisperxModel}`)
  
  if (!whisperxModel) {
    err(`${methodLogPrefix} WhisperX model must be specified`)
    throw new Error('WhisperX model must be specified')
  }
  
  const modelInfo = T_CONFIG.whisperx.models.find(m => m.modelId.toLowerCase() === whisperxModel.toLowerCase())
  if (!modelInfo) {
    err(`${methodLogPrefix} Model information for model ${whisperxModel} is not defined`)
    throw new Error(`Model information for model ${whisperxModel} is not defined.`)
  }
  
  const { modelId, costPerMinuteCents } = modelInfo
  l(`${methodLogPrefix} Using WhisperX model: ${modelId} with cost: ¢${costPerMinuteCents} per minute (local processing)`)
  
  // Check if WhisperX is installed and available
  try {
    const { stdout: version } = await execPromise('whisperx --version')
    l(`${methodLogPrefix} WhisperX version: ${version.trim()}`)
  } catch (error) {
    err(`${methodLogPrefix} WhisperX is not installed or not available in PATH`)
    throw new Error('WhisperX is not installed. Please install it with: pip install whisperx')
  }
  
  let audioPath = audioSource
  
  // If source is URL, download it first
  if (audioSource.startsWith('http')) {
    l(`${methodLogPrefix} Downloading audio from URL: ${audioSource}`)
    const tempPath = `/tmp/whisperx_temp_${Date.now()}.wav`
    
    try {
      const response = await fetch(audioSource)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio from URL: ${response.status} ${response.statusText}`)
      }
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await execPromise(`mkdir -p /tmp`)
      await execPromise(`echo "${buffer.toString('base64')}" | base64 -d > "${tempPath}"`)
      audioPath = tempPath
      l(`${methodLogPrefix} Successfully downloaded audio to: ${tempPath}`)
    } catch (error) {
      err(`${methodLogPrefix} Failed to download audio from URL:`, error)
      throw error
    }
  } else {
    // For local files, ensure it's a WAV file
    if (!audioPath.endsWith('.wav')) {
      audioPath = `${audioPath}.wav`
    }
    
    if (!existsSync(audioPath)) {
      err(`${methodLogPrefix} Audio file not found: ${audioPath}`)
      throw new Error(`Audio file not found: ${audioPath}`)
    }
  }
  
  l(`${methodLogPrefix} Processing audio file: ${audioPath}`)
  
  // Build WhisperX command
  const outputPath = `/tmp/whisperx_output_${Date.now()}.json`
  const whisperxArgs = [
    audioPath,
    '--model', modelId,
    '--output_format', 'json',
    '--output_dir', '/tmp',
    '--language', 'en', // Can be made configurable
    '--compute_type', 'float16', // Optimize for GPU if available
    '--batch_size', '16',
  ]
  
  // Add diarization if enabled
  if (enableDiarization) {
    whisperxArgs.push('--diarize')
    whisperxArgs.push('--min_speakers', '1')
    whisperxArgs.push('--max_speakers', '10')
    l(`${methodLogPrefix} Speaker diarization enabled`)
  }
  
  // Add word-level timestamps
  whisperxArgs.push('--align')
  
  l(`${methodLogPrefix} Executing WhisperX with args: whisperx ${whisperxArgs.join(' ')}`)
  
  try {
    // Run WhisperX
    const { stdout, stderr } = await execPromise(`whisperx ${whisperxArgs.join(' ')}`, {
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
    })
    
    if (stderr && !stderr.includes('UserWarning')) {
      l(`${methodLogPrefix} WhisperX stderr (non-critical): ${stderr}`)
    }
    
    l(`${methodLogPrefix} WhisperX processing completed`)
    
    // Find the output JSON file
    const { stdout: outputFiles } = await execPromise(`ls -1t /tmp/*.json | head -1`)
    const resultFile = outputFiles.trim()
    
    if (!resultFile || !existsSync(resultFile)) {
      throw new Error('WhisperX output file not found')
    }
    
    l(`${methodLogPrefix} Reading WhisperX output from: ${resultFile}`)
    
    // Read and parse the result
    const resultData = await readFile(resultFile, 'utf8')
    const whisperxResult: WhisperXResult = JSON.parse(resultData)
    
    l(`${methodLogPrefix} Successfully parsed WhisperX output with ${whisperxResult.segments.length} segments`)
    
    // Format the transcript
    const txtContent = formatWhisperXTranscript(whisperxResult)
    
    // Cleanup temporary files
    try {
      await execPromise(`rm -f "${resultFile}"`)
      if (audioSource.startsWith('http') && audioPath.startsWith('/tmp/')) {
        await execPromise(`rm -f "${audioPath}"`)
      }
    } catch (cleanupError) {
      l(`${methodLogPrefix} Warning: Failed to cleanup temporary files: ${cleanupError}`)
    }
    
    l(`${methodLogPrefix} Successfully formatted transcript, length: ${txtContent.length}`)
    
    return {
      transcript: txtContent,
      modelId,
      costPerMinuteCents
    }
    
  } catch (error) {
    err(`${methodLogPrefix} WhisperX processing failed:`, error)
    
    // Cleanup on error
    try {
      if (audioSource.startsWith('http') && audioPath.startsWith('/tmp/')) {
        await execPromise(`rm -f "${audioPath}"`)
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    throw new Error(`WhisperX processing failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Alternative implementation using WhisperX Python API directly
export async function callWhisperXPython(
  audioSource: string,
  whisperxModel: string | null,
  enableDiarization: boolean = true
): Promise<{
  transcript: string
  modelId: string
  costPerMinuteCents: number
}> {
  const methodLogPrefix = `${pre}:callWhisperXPython`
  l(`${methodLogPrefix} Starting WhisperX Python API transcription with model: ${whisperxModel}`)
  
  if (!whisperxModel) {
    err(`${methodLogPrefix} WhisperX model must be specified`)
    throw new Error('WhisperX model must be specified')
  }
  
  const modelInfo = T_CONFIG.whisperx.models.find(m => m.modelId.toLowerCase() === whisperxModel.toLowerCase())
  if (!modelInfo) {
    err(`${methodLogPrefix} Model information for model ${whisperxModel} is not defined`)
    throw new Error(`Model information for model ${whisperxModel} is not defined.`)
  }
  
  const { modelId, costPerMinuteCents } = modelInfo
  
  // Python script to run WhisperX
  const pythonScript = `
import whisperx
import json
import sys

audio_path = sys.argv[1]
model_name = sys.argv[2]
enable_diarization = sys.argv[3].lower() == 'true'

# Load model
device = "cuda" if torch.cuda.is_available() else "cpu"
compute_type = "float16" if device == "cuda" else "int8"

model = whisperx.load_model(model_name, device, compute_type=compute_type)

# Transcribe
result = model.transcribe(audio_path, batch_size=16)

# Align whisper output
model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
result = whisperx.align(result["segments"], model_a, metadata, audio_path, device)

# Diarization
if enable_diarization:
    diarize_model = whisperx.DiarizationPipeline(use_auth_token=None, device=device)
    diarize_segments = diarize_model(audio_path)
    result = whisperx.assign_word_speakers(diarize_segments, result)

# Output result as JSON
print(json.dumps(result))
`

  const tempScriptPath = `/tmp/whisperx_script_${Date.now()}.py`
  await execPromise(`echo '${pythonScript}' > "${tempScriptPath}"`)
  
  try {
    const { stdout } = await execPromise(
      `python3 "${tempScriptPath}" "${audioSource}" "${modelId}" "${enableDiarization}"`,
      { maxBuffer: 10 * 1024 * 1024 }
    )
    
    const result: WhisperXResult = JSON.parse(stdout)
    const txtContent = formatWhisperXTranscript(result)
    
    // Cleanup
    await execPromise(`rm -f "${tempScriptPath}"`)
    
    return {
      transcript: txtContent,
      modelId,
      costPerMinuteCents
    }
  } catch (error) {
    // Cleanup on error
    try {
      await execPromise(`rm -f "${tempScriptPath}"`)
    } catch (cleanupError) {
      // Ignore
    }
    
    throw error
  }
}