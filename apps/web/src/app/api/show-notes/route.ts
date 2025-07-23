import { NextRequest, NextResponse } from 'next/server'
import type { ShowNoteType } from '@autoshow/shared'

// Mock data for demonstration
const mockShowNotes: ShowNoteType[] = [
  {
    id: 1,
    title: 'Getting Started with AutoShow',
    publishDate: '2024-01-15',
    llmOutput: 'This is the LLM generated content for the first show note.',
    frontmatter: '---\ntitle: Getting Started with AutoShow\ndate: 2024-01-15\n---',
    transcript: 'This is the transcript of the first show.',
    prompt: 'Generate show notes for this episode'
  },
  {
    id: 2,
    title: 'Advanced AutoShow Features',
    publishDate: '2024-01-20',
    llmOutput: 'This is the LLM generated content for the second show note.',
    frontmatter: '---\ntitle: Advanced AutoShow Features\ndate: 2024-01-20\n---',
    transcript: 'This is the transcript of the second show.',
    prompt: 'Generate detailed show notes with key takeaways'
  }
]

export async function GET() {
  try {
    // In a real application, you would fetch this from your database
    // For now, we'll return mock data
    return NextResponse.json({ showNotes: mockShowNotes })
  } catch (error) {
    console.error('[API] Error fetching show notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch show notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // In a real application, you would save this to your database
    // For now, we'll just return a success response
    const newShowNote: ShowNoteType = {
      id: Date.now(),
      title: body.title || 'New Show Note',
      publishDate: new Date().toISOString().split('T')[0],
      llmOutput: body.llmOutput || '',
      frontmatter: body.frontmatter || '',
      transcript: body.transcript || '',
      prompt: body.prompt || ''
    }
    
    return NextResponse.json({ showNote: newShowNote }, { status: 201 })
  } catch (error) {
    console.error('[API] Error creating show note:', error)
    return NextResponse.json(
      { error: 'Failed to create show note' },
      { status: 500 }
    )
  }
}