import App from '../components/App'
import Instructions from '../components/Instructions'

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="p-6 max-w-6xl mx-auto">
        <Instructions />
        <App />
      </section>
    </div>
  )
}