// packages/shared/src/storage/index.ts

import type { StorageService } from './storage.interface.js'
import { env, err, l } from '../utils.js'
import { LocalStorageService } from './local.storage.service.js'
import { S3StorageService } from './s3.storage.service.js'

const pre = '[storage.factory]'

/**
 * 检查S3凭证是否可用
 */
function hasS3Credentials(): boolean {
  const accessKeyId = env.AWS_ACCESS_KEY_ID
  const secretAccessKey = env.AWS_SECRET_ACCESS_KEY
  return !!(accessKeyId && secretAccessKey)
}

/**
 * 测试S3连接是否可用
 */
async function testS3Connection(): Promise<boolean> {
  if (!hasS3Credentials()) {
    return false
  }

  try {
    // 创建临时S3服务实例进行连接测试
    const s3Service = new S3StorageService()
    // 简单的连接测试 - 尝试列出对象
    await s3Service.getAllShowNotes()
    return true
  } catch (error) {
    err(`${pre} S3 connection test failed:`, error)
    return false
  }
}

/**
 * 智能存储服务工厂
 * 根据配置和可用性自动选择最佳存储实现
 */
async function createStorageService(): Promise<StorageService> {
  const storageType = env.STORAGE_TYPE || 'auto'

  l(`${pre} Initializing storage service with type: ${storageType}`)

  switch (storageType) {
    case 's3':
      // 强制使用S3
      if (!hasS3Credentials()) {
        throw new Error(
          'S3 storage type specified but AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.'
        )
      }
      l(`${pre} Using S3 storage (forced)`)
      return new S3StorageService()

    case 'local':
      // 强制使用本地存储
      l(`${pre} Using local storage (forced)`)
      return new LocalStorageService()

    case 'auto':
    default:
      // 智能选择
      if (hasS3Credentials()) {
        l(`${pre} AWS credentials found, testing S3 connection...`)
        const s3Available = await testS3Connection()

        if (s3Available) {
          l(`${pre} Using S3 storage (auto-detected)`)
          return new S3StorageService()
        } else {
          l(`${pre} S3 connection failed, falling back to local storage`)
          return new LocalStorageService()
        }
      } else {
        l(`${pre} No AWS credentials found, using local storage`)
        return new LocalStorageService()
      }
  }
}

/**
 * 同步版本的存储服务工厂（用于不支持async的环境）
 */
function createStorageServiceSync(): StorageService {
  const storageType = env.STORAGE_TYPE || 'auto'

  switch (storageType) {
    case 's3':
      if (!hasS3Credentials()) {
        throw new Error(
          'S3 storage type specified but AWS credentials not found.'
        )
      }
      return new S3StorageService()

    case 'local':
      return new LocalStorageService()

    case 'auto':
    default:
      if (hasS3Credentials()) {
        try {
          l(`${pre} AWS credentials found, attempting S3 storage`)
          return new S3StorageService()
        } catch (error) {
          l(`${pre} S3 initialization failed, falling back to local storage`)
          return new LocalStorageService()
        }
      } else {
        l(`${pre} No AWS credentials found, using local storage`)
        return new LocalStorageService()
      }
  }
}

// 导出单例存储服务实例
export const storageService = createStorageServiceSync()

// 也导出工厂函数供需要的地方使用
export { createStorageService, createStorageServiceSync }

export { LocalStorageService } from './local.storage.service.js'
export { S3StorageService } from './s3.storage.service.js'
// 导出所有类型和接口
export type { StorageService } from './storage.interface.js'
