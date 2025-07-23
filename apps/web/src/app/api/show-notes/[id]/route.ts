import { NextRequest, NextResponse } from 'next/server'
import type { ShowNoteType } from '@autoshow/shared'

// Mock data (same as in the parent route)
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

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const showNoteId = parseInt(id)
    
    // Find the show note by ID
    const showNote = mockShowNotes.find(note => note.id === showNoteId)
    
    if (!showNote) {
      return NextResponse.json(
        { error: 'Show note not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ showNote })
  } catch (error) {
    console.error(`[API] Error fetching show note:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch show note' },
      { status: 500 }
    )
  }
}