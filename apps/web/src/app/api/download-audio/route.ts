import { NextRequest, NextResponse } from 'next/server'
import { fileTypeFromBuffer } from 'file-type'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Service, execPromise, readFile, access, rename, execFilePromise, env, mkdirSync, existsSync, unlink, resolve, basename, l, err } from '@autoshow/shared/server'
import { computeTranscriptionCosts } from '@autoshow/transcription'
import { createHash } from 'crypto'
import fs from 'fs/promises'
import path from 'path'

// Function to find yt-dlp executable
async function findYtDlp(): Promise<string> {
  const possiblePaths = [
    '/Users/zhsama/.local/bin/yt-dlp',
    '/usr/local/bin/yt-dlp',
    '/opt/homebrew/bin/yt-dlp',
    'yt-dlp' // fallback to PATH
  ]
  
  for (const ytDlpPath of possiblePaths) {
    try {
      await execFilePromise(ytDlpPath, ['--version'])
      return ytDlpPath
    } catch (error) {
      continue
    }
  }
  
  throw new Error('yt-dlp not found. Please install yt-dlp: https://github.com/yt-dlp/yt-dlp#installation')
}

export async function POST(request: NextRequest) {
  const pre = '[api/download-audio]'
  l(`${pre} Starting audio download and processing`)
  
  try {
    const formData = await request.formData()
    const type = formData.get('type') as string
    const url = formData.get('url') as string
    const file = formData.get('file') as File | null
    const walletAddress = formData.get('walletAddress') as string
    
    if (!type || !['video', 'file'].includes(type)) {
      return NextResponse.json({ error: 'Valid type is required' }, { status: 400 })
    }
    
    if (type === 'video' && !url) {
      return NextResponse.json({ error: 'URL is required for video' }, { status: 400 })
    }
    
    if (type === 'file' && !file) {
      return NextResponse.json({ error: 'File is required for file type' }, { status: 400 })
    }
    
    // Create temporary directory for processing
    const tempDir = path.join(process.cwd(), 'temp')
    await fs.mkdir(tempDir, { recursive: true })
    
    function sanitizeTitle(title: string): string {
      return title
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
        .slice(0, 200)
    }
    
    function buildFrontMatter(metadata: {
      showLink: string
      channel: string
      channelURL: string
      title: string
      description: string
      publishDate: string
      coverImage: string
    }): string[] {
      return [
        '---',
        `showLink: "${metadata.showLink}"`,
        `channel: "${metadata.channel}"`,
        `channelURL: "${metadata.channelURL}"`,
        `title: "${metadata.title}"`,
        `description: "${metadata.description}"`,
        `publishDate: "${metadata.publishDate}"`,
        `coverImage: "${metadata.coverImage}"`,
        '---\n',
      ]
    }
    
    let filename = ''
    let metadata = {
      showLink: '',
      channel: '',
      channelURL: '',
      title: '',
      description: '',
      publishDate: '',
      coverImage: '',
      walletAddress: '',
      mnemonic: ''
    }
    
    let tempFilePath = ''
    
    if (type === 'video') {
      l(`${pre} Processing video URL: ${url}`)
      const ytDlpPath = await findYtDlp()
      const { stdout } = await execFilePromise(ytDlpPath, [
        '--restrict-filenames',
        '--cookies-from-browser', 'chrome', // 尝试从 Chrome 浏览器获取 cookies
        '--print', '%(webpage_url)s',
        '--print', '%(channel)s',
        '--print', '%(uploader_url)s',
        '--print', '%(title)s',
        '--print', '%(upload_date>%Y-%m-%d)s',
        '--print', '%(thumbnail)s',
        url
      ])
      
      const [
        showLink = '',
        videoChannel = '',
        uploader_url = '',
        videoTitle = '',
        formattedDate = '',
        thumbnail = ''
      ] = stdout.trim().split('\n')
      
      const timestamp = new Date().getTime()
      const uniqueId = `${timestamp}-${Math.floor(Math.random() * 1000)}`
      filename = `${formattedDate}-${sanitizeTitle(videoTitle)}-${uniqueId}`
      
      metadata = {
        showLink,
        channel: videoChannel,
        channelURL: uploader_url,
        title: videoTitle,
        description: '',
        publishDate: formattedDate,
        coverImage: thumbnail,
        walletAddress: walletAddress || '',
        mnemonic: ''
      }
    } else {
      if (!file) {
        return NextResponse.json({ error: 'File is required for file upload type' }, { status: 400 })
      }
      
      l(`${pre} Processing uploaded file: ${file.name}`)
      
      // Save uploaded file to temp directory
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileHash = createHash('md5').update(buffer).digest('hex')
      const fileExt = path.extname(file.name)
      tempFilePath = path.join(tempDir, `upload_${fileHash}${fileExt}`)
      
      await fs.writeFile(tempFilePath, buffer)
      l(`${pre} Saved uploaded file to: ${tempFilePath}`)
      
      const filenameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      const timestamp = new Date().getTime()
      const uniqueId = `${timestamp}-${Math.floor(Math.random() * 1000)}`
      filename = `${sanitizeTitle(filenameWithoutExt)}-${uniqueId}`
      
      metadata = {
        showLink: file.name,
        channel: '',
        channelURL: '',
        title: file.name,
        description: '',
        publishDate: new Date().toISOString().split('T')[0],
        coverImage: '',
        walletAddress: walletAddress || '',
        mnemonic: ''
      }
    }
    
    const outputPath = path.join(tempDir, `${filename}.wav`)
    l(`${pre} Output path: ${outputPath}`)
    
    const frontMatter = buildFrontMatter({
      showLink: metadata.showLink || '',
      channel: metadata.channel || '',
      channelURL: metadata.channelURL || '',
      title: metadata.title,
      description: metadata.description || '',
      publishDate: metadata.publishDate || '',
      coverImage: metadata.coverImage || ''
    }).join('\n')
    
    // Execute download/conversion with retry and cookie fallback
    async function executeWithRetry(command: string, args: string[]) {
      const maxRetries = 7
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 1) {
            l(`${pre} Retry attempt ${attempt}/${maxRetries}`)
          }
          await execFilePromise(command, args)
          return
        } catch (error) {
          if (attempt === maxRetries) {
            throw error
          }
          
          // If we get a bot detection error, try different cookie strategies
          const errorMessage = error instanceof Error ? error.message : String(error)
          if (errorMessage.includes('Sign in to confirm you\'re not a bot') && attempt <= 3) {
            // Try different browsers for cookies
            const browsers = ['chrome', 'firefox', 'safari', 'edge']
            const currentBrowser = browsers[(attempt - 1) % browsers.length]
            
            // Update args to use different browser cookies
            const newArgs = args.map(arg => 
              arg === 'chrome' || arg === 'firefox' || arg === 'safari' || arg === 'edge' 
                ? currentBrowser 
                : arg
            )
            
            // If no cookie args exist, add them
            if (!args.includes('--cookies-from-browser')) {
              const insertIndex = args.findIndex(arg => arg.startsWith('--')) + 2
              newArgs.splice(insertIndex, 0, '--cookies-from-browser', currentBrowser)
            }
            
            l(`${pre} Trying cookies from ${currentBrowser} browser`)
            args = newArgs
          }
          
          const delayMs = 1000 * 2 ** (attempt - 1)
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
    }
    
    if (type === 'video') {
      l(`${pre} Downloading video from URL`)
      const ytDlpPath = await findYtDlp()
      await executeWithRetry(ytDlpPath, [
        '--no-warnings',
        '--restrict-filenames',
        '--cookies-from-browser', 'chrome', // 尝试从 Chrome 浏览器获取 cookies
        '--extract-audio',
        '--audio-format', 'wav',
        '--postprocessor-args', 'ffmpeg:-ar 16000 -ac 1',
        '--no-playlist',
        '-o', outputPath,
        url
      ])
      l(`${pre} Video download completed`)
    } else {
      l(`${pre} Converting uploaded file to WAV`)
      const supportedFormats = new Set([
        'wav', 'mp3', 'm4a', 'aac', 'ogg', 'flac', 'mp4', 'mkv', 'avi', 'mov', 'webm'
      ])
      
      const buffer = await fs.readFile(tempFilePath)
      const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
      const fileType = await fileTypeFromBuffer(uint8Array)
      
      if (!fileType || !supportedFormats.has(fileType.ext)) {
        const errorMsg = fileType ? `Unsupported file type: ${fileType.ext}` : 'Unable to determine file type'
        throw new Error(errorMsg)
      }
      
      await execPromise(`ffmpeg -i "${tempFilePath}" -ar 16000 -ac 1 -c:a pcm_s16le "${outputPath}"`, { maxBuffer: 10000 * 1024 })
      l(`${pre} File conversion completed`)
      
      // Clean up original uploaded file
      await fs.unlink(tempFilePath)
    }
    
    if (!existsSync(outputPath)) {
      throw new Error(`File was not created at: ${outputPath}`)
    }
    
    // Get audio duration
    let audioDurationInSeconds = 0
    try {
      const cmd = `ffprobe -v error -show_entries format=duration -of csv=p=0 "${outputPath}"`
      const { stdout } = await execPromise(cmd)
      audioDurationInSeconds = parseFloat(stdout.trim())
      l(`${pre} Audio duration: ${audioDurationInSeconds} seconds`)
    } catch (error) {
      console.warn(`${pre} Could not get audio duration: ${error}`)
      audioDurationInSeconds = 300 // Default estimate
    }
    
    // Compute transcription costs BEFORE uploading to S3
    l(`${pre} Computing transcription costs using duration: ${audioDurationInSeconds} seconds`)
    const transcriptionCosts = await computeTranscriptionCosts(outputPath)
    
    // Upload to S3
    const region = env['AWS_REGION'] || 'us-east-2'
    const bucket = env['S3_BUCKET_NAME'] || 'autoshow-test'
    const key = basename(outputPath)
    
    const fileBuffer = await readFile(outputPath)
    const client = new S3Client({ region })
    
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: 'audio/wav'
    })
    
    await client.send(putCommand)
    l(`${pre} File uploaded to S3`)
    
    // Clean up local WAV file
    try {
      await unlink(outputPath)
      l(`${pre} Local WAV file deleted: ${outputPath}`)
    } catch (error) {
      console.warn(`${pre} Failed to delete local WAV file: ${error}`)
    }
    
    // Generate pre-signed URL
    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key })
    const s3Url = await getSignedUrl(client, getCommand, { expiresIn: 86400 })
    l(`${pre} Generated pre-signed URL with 24-hour expiration`)
    
    // Create show note in S3
    l(`${pre} Creating show note in S3`)
    const { id } = await s3Service.createShowNote({
      title: metadata.title,
      publishDate: metadata.publishDate,
      frontmatter: frontMatter,
      walletAddress: walletAddress || '',
      showLink: metadata.showLink || '',
      channel: metadata.channel || '',
      channelURL: metadata.channelURL || '',
      description: metadata.description || '',
      coverImage: metadata.coverImage || '',
    })
    
    return NextResponse.json({
      id: parseInt(id),
      frontMatter,
      finalPath: outputPath,
      metadata,
      s3Url,
      transcriptionCost: transcriptionCosts,
      audioDuration: audioDurationInSeconds
    })
    
  } catch (error) {
    err(`${pre} Error:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    
    // Provide specific guidance for YouTube bot detection
    if (errorMessage.includes('Sign in to confirm you\'re not a bot')) {
      return NextResponse.json(
        {
          error: 'YouTube 反机器人保护已激活',
          details: '由于 YouTube 的反机器人保护，无法下载此视频。建议：1) 尝试使用其他 YouTube 视频 URL，2) 或者下载视频文件后直接上传处理',
          suggestion: '请尝试上传本地视频文件，或使用其他视频平台的链接',
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 429 } // Too Many Requests
      )
    }
    
    return NextResponse.json(
      {
        error: `处理音频时发生错误: ${errorMessage}`,
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}