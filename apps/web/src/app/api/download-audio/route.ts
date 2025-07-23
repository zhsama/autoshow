import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { processType } = body
    
    // In a real application, you would download and process the audio
    // For now, we'll return mock data
    const mockResponse = {
      finalPath: `/tmp/downloaded_audio_${Date.now()}.mp3`,
      s3Url: `https://s3.amazonaws.com/autoshow/audio_${Date.now()}.mp3`,
      metadata: {
        title: 'Downloaded Audio',
        duration: '00:15:30',
        format: 'mp3'
      },
      frontMatter: '---\ntitle: Downloaded Audio\ntype: ' + processType + '\n---',
      showNoteId: Date.now()
    }
    
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('[API] Error downloading audio:', error)
    return NextResponse.json(
      { error: 'Failed to download audio' },
      { status: 500 }
    )
  }
}