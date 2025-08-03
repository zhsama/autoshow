import { ShowNote } from '../../../../components/ShowNote'

interface ShowNotePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ShowNotePage({ params }: ShowNotePageProps) {
  const { id } = await params
  
  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <ShowNote id={id} />
    </div>
  )
}