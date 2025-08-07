// packages/shared/src/storage/local.storage.service.ts

import { promises as fs } from 'fs'
import path from 'path'
import { StorageService } from './storage.interface.js'
import type { ShowNoteType } from '../types.js'
import { env, l, err } from '../utils.js'

const pre = '[local.storage]'

/**
 * 本地文件系统存储服务实现
 * 在项目根目录下创建data/目录来存储所有数据
 */
export class LocalStorageService implements StorageService {
  private readonly storageDir: string
  private readonly baseUrl: string

  constructor() {
    this.storageDir = path.resolve(process.cwd(), 'data')
    this.baseUrl = env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'

    // 确保存储目录存在
    this.ensureDirectoryExists().catch(error => {
      err(`${pre} Failed to create storage directory:`, error)
    })

    l(`${pre} Initialized local storage at: ${this.storageDir}`)
  }

  private async ensureDirectoryExists(): Promise<void> {
    await fs.mkdir(this.storageDir, { recursive: true })
    await fs.mkdir(path.join(this.storageDir, 'audio'), { recursive: true })
    await fs.mkdir(path.join(this.storageDir, 'show-notes'), {
      recursive: true,
    })
  }

  /**
   * 安全路径处理，防止路径遍历攻击
   */
  private getSecurePath(key: string): string {
    const safeKey = path.normalize(key).replace(/^(\.\.\/)+/, '')
    const filePath = path.join(this.storageDir, safeKey)

    if (!filePath.startsWith(this.storageDir)) {
      throw new Error(`Invalid key: path traversal detected for key "${key}"`)
    }

    return filePath
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString()
  }

  // 文件管理方法
  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<string> {
    l(`${pre} Uploading file with key: ${key}`)

    const filePath = this.getSecurePath(key)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, body)

    l(`${pre} File uploaded successfully: ${filePath}`)
    return this.getPublicUrl(key)
  }

  async getFile(key: string): Promise<Buffer> {
    const filePath = this.getSecurePath(key)

    try {
      return await fs.readFile(filePath)
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${key}`)
      }
      throw error
    }
  }

  async getPublicUrl(key: string): Promise<string> {
    // 本地存储的公开URL指向文件服务API
    const safeKey = path.normalize(key).replace(/^(\.\.\/)+/, '')
    return `${this.baseUrl}/api/files/${safeKey}`
  }

  // Show Notes管理方法
  async createShowNote(
    metadata: Partial<ShowNoteType>
  ): Promise<{ id: string; showNote: ShowNoteType }> {
    const id = this.generateId()
    l(`${pre} Creating show note with ID: ${id}`)

    const showNote: ShowNoteType = {
      id: parseInt(id),
      showLink: metadata.showLink,
      channel: metadata.channel,
      channelURL: metadata.channelURL,
      title: metadata.title || 'Untitled Show Note',
      description: metadata.description,
      publishDate:
        metadata.publishDate || new Date().toISOString().split('T')[0],
      coverImage: metadata.coverImage,
      frontmatter: metadata.frontmatter,
      prompt: metadata.prompt,
      transcript: metadata.transcript,
      llmOutput: metadata.llmOutput,
      walletAddress: metadata.walletAddress,
      mnemonic: metadata.mnemonic,
      llmService: metadata.llmService,
      llmModel: metadata.llmModel,
      llmCost: metadata.llmCost,
      transcriptionService: metadata.transcriptionService,
      transcriptionModel: metadata.transcriptionModel,
      transcriptionCost: metadata.transcriptionCost,
      finalCost: metadata.finalCost,
    }

    const showNoteDir = path.join(this.storageDir, 'show-notes', id)
    await fs.mkdir(showNoteDir, { recursive: true })

    const metadataPath = path.join(showNoteDir, 'metadata.json')
    await fs.writeFile(metadataPath, JSON.stringify(showNote, null, 2))

    l(`${pre} Show note metadata created: ${metadataPath}`)
    return { id, showNote }
  }

  async updateShowNote(
    id: string,
    updates: Partial<ShowNoteType>
  ): Promise<ShowNoteType> {
    l(`${pre} Updating show note: ${id}`)

    const existingShowNote = await this.getShowNote(id)
    if (!existingShowNote) {
      throw new Error(`Show note ${id} not found`)
    }

    const updatedShowNote = {
      ...existingShowNote,
      ...updates,
    }

    const showNoteDir = path.join(this.storageDir, 'show-notes', id)
    const metadataPath = path.join(showNoteDir, 'metadata.json')
    await fs.writeFile(metadataPath, JSON.stringify(updatedShowNote, null, 2))

    l(`${pre} Show note updated: ${metadataPath}`)
    return updatedShowNote
  }

  async getShowNote(id: string): Promise<ShowNoteType | null> {
    l(`${pre} Fetching show note: ${id}`)

    try {
      const showNoteDir = path.join(this.storageDir, 'show-notes', id)
      const metadataPath = path.join(showNoteDir, 'metadata.json')

      const metadataContent = await fs.readFile(metadataPath, 'utf-8')
      const metadata = JSON.parse(metadataContent)

      // 读取转录文本
      let transcription = ''
      try {
        const transcriptionPath = path.join(showNoteDir, 'transcription.txt')
        transcription = await fs.readFile(transcriptionPath, 'utf-8')
      } catch (error) {
        l(`${pre} No transcription found for show note: ${id}`)
      }

      // 读取LLM输出
      let llmOutput = ''
      try {
        const llmOutputPath = path.join(showNoteDir, 'llm-output.txt')
        llmOutput = await fs.readFile(llmOutputPath, 'utf-8')
      } catch (error) {
        l(`${pre} No LLM output found for show note: ${id}`)
      }

      const showNote: ShowNoteType = {
        ...metadata,
        transcript: transcription,
        llmOutput: llmOutput,
      }

      l(`${pre} Show note fetched successfully: ${id}`)
      return showNote
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null
      }
      err(`${pre} Error fetching show note ${id}:`, error)
      return null
    }
  }

  async getAllShowNotes(): Promise<ShowNoteType[]> {
    l(`${pre} Fetching all show notes`)

    try {
      const showNotesDir = path.join(this.storageDir, 'show-notes')

      // 确保目录存在
      try {
        await fs.access(showNotesDir)
      } catch {
        l(`${pre} Show notes directory does not exist yet`)
        return []
      }

      const entries = await fs.readdir(showNotesDir, { withFileTypes: true })
      const showNotes: ShowNoteType[] = []

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const id = entry.name
          const showNote = await this.getShowNote(id)
          if (showNote) {
            showNotes.push(showNote)
          }
        }
      }

      // 按发布日期排序
      showNotes.sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime()
        const dateB = new Date(b.publishDate).getTime()
        return dateA - dateB
      })

      l(`${pre} Found ${showNotes.length} show notes`)
      return showNotes
    } catch (error) {
      err(`${pre} Error fetching all show notes:`, error)
      return []
    }
  }

  async saveTranscription(id: string, transcription: string): Promise<void> {
    l(`${pre} Saving transcription for show note: ${id}`)

    const showNoteDir = path.join(this.storageDir, 'show-notes', id)
    await fs.mkdir(showNoteDir, { recursive: true })

    const transcriptionPath = path.join(showNoteDir, 'transcription.txt')
    await fs.writeFile(transcriptionPath, transcription, 'utf-8')

    l(`${pre} Transcription saved: ${transcriptionPath}`)
  }

  async saveLLMOutput(id: string, llmOutput: string): Promise<void> {
    l(`${pre} Saving LLM output for show note: ${id}`)

    const showNoteDir = path.join(this.storageDir, 'show-notes', id)
    await fs.mkdir(showNoteDir, { recursive: true })

    const llmOutputPath = path.join(showNoteDir, 'llm-output.txt')
    await fs.writeFile(llmOutputPath, llmOutput, 'utf-8')

    l(`${pre} LLM output saved: ${llmOutputPath}`)
  }

  async getAudioSignedUrl(filename: string): Promise<string> {
    l(`${pre} Getting signed URL for audio file: ${filename}`)

    // 本地存储中，"签名URL"就是指向文件服务API的URL
    const audioKey = `audio/${filename}`
    return this.getPublicUrl(audioKey)
  }
}
