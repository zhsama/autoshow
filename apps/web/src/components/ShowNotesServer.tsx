import { ShowNotesList } from './ShowNotesList'
import type { ShowNoteType } from '@autoshow/shared'

async function getShowNotes(): Promise<ShowNoteType[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/show-notes`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch show notes')
    }
    
    const data = await response.json()
    return data.showNotes || []
  } catch (error) {
    console.error('Error fetching show notes:', error)
    return []
  }
}

export async function ShowNotes() {
  const showNotes = await getShowNotes()
  
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-6 border-b border-border flex-shrink-0">
        <h1 className="text-lg font-semibold">Show Notes</h1>
      </div>
      <ShowNotesList initialShowNotes={showNotes} />
    </div>
  )
}