'use client'

import { useState } from 'react'
import Form from './Form'
import { ShowNotes } from './ShowNotes'

const l = console.log

export default function App() {
  const [refreshCount, setRefreshCount] = useState(0)
  l('[App] Initialized with refreshCount state')
  
  const handleNewShowNote = () => {
    l('[App] New show note created, refreshing ShowNotes component')
    setRefreshCount(prev => prev + 1)
  }
  
  l('[App] Rendering App component with responsive layout')
  
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-[1400px] mx-auto px-4 h-auto md:h-screen">
      <div className="flex-1 min-w-0 overflow-y-auto py-6">
        <Form onNewShowNote={handleNewShowNote} />
      </div>
      <div className="w-full md:w-96 flex-shrink-0 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0">
        <ShowNotes refreshCount={refreshCount} />
      </div>
    </div>
  )
}