import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import mime from 'mime-types'

const storageDir = path.resolve(process.cwd(), 'data')

interface RouteParams {
  params: Promise<{
    slug: string[]
  }>
}

/**
 * 文件服务API路由
 * 为本地存储提供文件访问功能
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const key = slug.join('/')

    // 安全路径处理，防止路径遍历攻击
    const safeKey = path.normalize(key).replace(/^(\.\.\/)+/, '')
    const filePath = path.join(storageDir, safeKey)

    if (!filePath.startsWith(storageDir)) {
      return new NextResponse('Invalid path', { status: 400 })
    }

    try {
      const fileBuffer = await fs.readFile(filePath)
      const contentType = mime.lookup(filePath) || 'application/octet-stream'

      // 获取文件大小用于Content-Length头
      const stats = await fs.stat(filePath)

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': stats.size.toString(),
          'Cache-Control': 'public, max-age=86400', // 缓存24小时
        },
      })
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return new NextResponse('File not found', { status: 404 })
      }

      console.error('[API] Error serving file:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }
  } catch (error) {
    console.error('[API] Error processing file request:', error)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
