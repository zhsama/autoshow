'use client'

import { useState, useEffect } from 'react'
import type { ShowNoteType } from '@autoshow/shared'

const l = console.log

export function ShowNote({ id }: { id: string }) {
  const [showNote, setShowNote] = useState<ShowNoteType | null>(null)
  
  l('[ShowNote] Component initializing')
  
  useEffect(() => {
    l(`[ShowNote] Fetching show note with ID: ${id}`)
    fetch(`/api/show-notes/${id}`)
      .then((response) => {
        l(`[ShowNote] Received response for show note ${id}`)
        return response.json()
      })
      .then((data) => {
        l(`[ShowNote] Successfully loaded show note: ${data.showNote?.title}`)
        setShowNote(data.showNote)
      })
      .catch((error) => {
        console.error(`[ShowNote] Error fetching show note ${id}:`, error)
      })
  }, [id])
  
  const formatContent = (text: string) => {
    return text.split('\n').map((line: string, index: number) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))
  }
  
  l(`[ShowNote] Rendering show note component, loaded: ${!!showNote}`)
  
  return (
    <div className="bg-card rounded-lg p-6 max-w-4xl mx-auto">
      {showNote ? (
        <div className="markdown-content space-y-6">
          <h2 className="h2 text-primary-400">{showNote.title}</h2>
          <p className="text-muted-foreground">Date: {showNote.publishDate}</p>
          <section>
            <h3 className="h3 mb-3">LLM Output</h3>
            <div className="bg-base-800 p-4 rounded-md whitespace-pre-wrap">
              {showNote.llmOutput && formatContent(showNote.llmOutput || '')}
            </div>
          </section>
          <section>
            <h3 className="h3 mb-3">Front Matter</h3>
            <div className="bg-base-800 p-4 rounded-md whitespace-pre-wrap">
              {showNote.frontmatter && formatContent(showNote.frontmatter || '')}
            </div>
          </section>
          <section>
            <h3 className="h3 mb-3">Transcript</h3>
            <div className="bg-base-800 p-4 rounded-md whitespace-pre-wrap">
              {showNote.transcript ? formatContent(showNote.transcript || '') : 'No transcript available.'}
            </div>
          </section>
          <section>
            <h3 className="h3 mb-3">Prompt</h3>
            <div className="bg-base-800 p-4 rounded-md whitespace-pre-wrap">
              {showNote.prompt && formatContent(showNote.prompt || '')}
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Loading...</div>
      )}
    </div>
  )
}