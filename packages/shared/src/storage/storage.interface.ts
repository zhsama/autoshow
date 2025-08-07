// packages/shared/src/storage/storage.interface.ts

import type { ShowNoteType } from '../types.js'

/**
 * 存储服务抽象接口
 * 支持多种存储后端（S3、本地文件系统等）
 */
export interface StorageService {
  // 文件管理
  /**
   * 上传文件到存储
   * @param key 文件唯一标识符 (e.g., 'audio/filename.wav')
   * @param body 文件内容
   * @param contentType MIME类型
   * @returns 文件的公开访问URL
   */
  uploadFile: (
    key: string,
    body: Buffer,
    contentType: string
  ) => Promise<string>

  /**
   * 从存储获取文件
   * @param key 文件唯一标识符
   * @returns 文件内容
   */
  getFile: (key: string) => Promise<Buffer>

  /**
   * 生成文件的公开访问URL
   * @param key 文件唯一标识符
   * @returns 公开访问URL
   */
  getPublicUrl: (key: string) => Promise<string>

  // Show Notes管理
  /**
   * 创建新的Show Note
   * @param metadata Show Note元数据
   * @returns 创建的Show Note及其ID
   */
  createShowNote: (
    metadata: Partial<ShowNoteType>
  ) => Promise<{ id: string; showNote: ShowNoteType }>

  /**
   * 更新Show Note
   * @param id Show Note ID
   * @param updates 更新的字段
   * @returns 更新后的Show Note
   */
  updateShowNote: (
    id: string,
    updates: Partial<ShowNoteType>
  ) => Promise<ShowNoteType>

  /**
   * 获取单个Show Note
   * @param id Show Note ID
   * @returns Show Note或null
   */
  getShowNote: (id: string) => Promise<ShowNoteType | null>

  /**
   * 获取所有Show Notes
   * @returns Show Notes列表
   */
  getAllShowNotes: () => Promise<ShowNoteType[]>

  /**
   * 保存转录文本
   * @param id Show Note ID
   * @param transcription 转录内容
   */
  saveTranscription: (id: string, transcription: string) => Promise<void>

  /**
   * 保存LLM输出
   * @param id Show Note ID
   * @param llmOutput LLM生成的内容
   */
  saveLLMOutput: (id: string, llmOutput: string) => Promise<void>

  /**
   * 获取音频文件的签名URL（兼容现有API）
   * @param filename 文件名
   * @returns 文件访问URL
   */
  getAudioSignedUrl: (filename: string) => Promise<string>
}
