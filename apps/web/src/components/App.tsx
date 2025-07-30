'use client'

import { useState } from 'react'
import Form from './Form'
import { ShowNotesList } from './ShowNotesList'
import { logger } from '@/lib/logger'

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  
  const handleNewShowNote = () => {
    logger.log('[App] New show note created, refreshing list')
    setRefreshKey(prev => prev + 1)
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-[1400px] mx-auto px-4 h-auto md:h-screen">
      <div className="flex-1 min-w-0 overflow-y-auto py-6">
        <Form onNewShowNote={handleNewShowNote} />
      </div>
      <div className="w-full md:w-96 flex-shrink-0 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0">
        <div className="h-full flex flex-col bg-card rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border flex-shrink-0">
            <h1 className="text-lg font-semibold">Show Notes</h1>
          </div>
          <ShowNotesList key={refreshKey} initialShowNotes={[]} />
        </div>
      </div>
    </div>
  )
}