'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { logger } from '@/lib/logger'
import type { ShowNoteType } from '@autoshow/shared'

interface ShowNotesListProps {
  initialShowNotes: ShowNoteType[]
}

export function ShowNotesList({ initialShowNotes }: ShowNotesListProps) {
  const [showNotes, setShowNotes] = useState<ShowNoteType[]>(initialShowNotes)
  
  const refreshShowNotes = async () => {
    logger.log('[ShowNotesList] Refreshing show notes')
    try {
      const response = await fetch('/api/show-notes')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      logger.log(`[ShowNotesList] Successfully fetched ${data.showNotes.length} show notes`)
      setShowNotes(data.showNotes)
    } catch (error) {
      logger.error('[ShowNotesList] Error fetching show notes:', error)
    }
  }
  
  // Refresh on interval
  useEffect(() => {
    const interval = setInterval(refreshShowNotes, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <ul className="space-y-3">
        {showNotes.length > 0 ? (
          showNotes.map((note) => (
            <li key={note.id}>
              <Link href={`/show-notes/${note.id}`}>
                <Card className="cursor-pointer transition-colors hover:bg-accent">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base line-clamp-1">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {note.description || 'No description available'}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.publishDate).toLocaleDateString()}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))
        ) : (
          <li className="text-center text-muted-foreground py-8">
            No show notes available yet
          </li>
        )}
      </ul>
    </div>
  )
}