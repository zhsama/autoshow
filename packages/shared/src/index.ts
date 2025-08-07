// packages/shared/src/index.ts
export * from './types.js'
export * from './utils.js'
export * from './storage/index.js'
export * from './prompts.js'
export * from './site.config.js'

// 向后兼容：继续导出s3Service作为storageService的别名
export { storageService as s3Service } from './storage/index.js'
