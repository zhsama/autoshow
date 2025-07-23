'use client'

import { useState, useEffect } from 'react'
import type { ShowNoteType } from '@autoshow/shared'

const l = console.log

export function ShowNotes(props: { refreshCount: number }) {
  const [showNotes, setShowNotes] = useState<ShowNoteType[]>([])
  
  l('[ShowNotes] Component initializing for sidebar display')
  
  const fetchShowNotes = async (): Promise<void> => {
    l('[ShowNotes] Fetching all show notes')
    try {
      const response = await fetch('/api/show-notes')
      if (!response.ok) {
        l(`[ShowNotes] HTTP error when fetching notes: status ${response.status}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      l(`[ShowNotes] Successfully fetched ${data.showNotes.length} show notes`)
      setShowNotes(data.showNotes)
    } catch (error) {
      console.error('[ShowNotes] Error fetching show notes:', error)
    }
  }
  
  useEffect(() => {
    if (props.refreshCount > 0) {
      l(`[ShowNotes] Refresh triggered due to refreshCount change: ${props.refreshCount}`)
      fetchShowNotes()
    }
  }, [props.refreshCount])
  
  useEffect(() => {
    l('[ShowNotes] Component mounted, fetching initial show notes')
    fetchShowNotes()
  }, [])
  
  l(`[ShowNotes] Rendering sidebar with ${showNotes.length} show notes`)
  
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-6 border-b border-border flex-shrink-0">
        <h1 className="h1 text-lg">Show Notes</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <ul className="space-y-3">
          {showNotes.length > 0 ? (
            showNotes.map((note) => (
              <li key={note.id} className="border-b border-border pb-3 last:border-b-0">
                <a 
                  href={`/show-notes/${note.id}`}
                  className="text-primary-400 hover:text-primary-300 transition-colors text-sm block"
                >
                  {note.title}
                </a>
                <span className="text-muted-foreground text-xs block mt-1">{note.publishDate}</span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">Loading...</li>
          )}
        </ul>
      </div>
    </div>
  )
}