import { VideoAmbient } from './components/VideoAmbient'
import './App.css'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Ambient light</h1>
      </header>
      <VideoAmbient />
    </main>
  )
}

export default App
