import React from 'react'

const l = console.log

const Instructions: React.FC = () => {
  l('[Instructions] Rendering instructions component')
  
  return (
    <div className="markdown-content space-y-4 mb-8">
      <h1 className="h1 text-primary-400 mb-8">Generate Show Notes</h1>
      <p className="description">
        This app uses <a href="https://github.com/ajcwebdev/autoshow" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-400 underline">AutoShow</a> and Next.js to generate show notes based on video and audio content of any kind.
      </p>
      <h2 className="h2 mb-6">Instructions</h2>
      <p className="description">
        1. Choose the type of content you want to use
        (<a href="#examples" className="text-primary-500 hover:text-primary-400 underline">examples</a>)
      </p>
      <p className="description">2. Select the Process Type and paste the link to the type of content you&apos;ve chosen into Link</p>
      <p className="description">3. Select Transcription Service</p>
      <p className="description">4. Select Transcription Model</p>
      <p className="description">5. Select LLM Model</p>
      <p className="description">6. Select Prompts</p>
      
      <h3 id="examples" className="h3 mb-6">Examples</h3>
      
      <div className="overflow-x-auto mb-8">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-base-800">
              <th className="p-4 text-left border-b border-border" style={{ width: '5rem', whiteSpace: 'nowrap' }}>Type</th>
              <th className="p-4 text-left border-b border-border" style={{ width: '20rem' }}>Link</th>
              <th className="p-4 text-left border-b border-border">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-base-800">
              <td className="p-4" style={{ width: '5rem', whiteSpace: 'nowrap' }}>Video</td>
              <td className="p-4 break-words">https://www.youtube.com/watch?v=MORMZXEaONk</td>
              <td className="p-4">Single video content for show notes reference</td>
            </tr>
            <tr className="border-b border-border hover:bg-base-800">
              <td className="p-4" style={{ width: '5rem', whiteSpace: 'nowrap' }}>File</td>
              <td className="p-4 break-words">autoshow/content/examples/audio.mp3</td>
              <td className="p-4">Audio file attachment for the show notes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Instructions