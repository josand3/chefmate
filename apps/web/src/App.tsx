import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji' }}>
      <header style={{ padding: 24 }}>
        <h1>ChefMate</h1>
        <p>Conversational cooking assistant</p>
      </header>
      <main style={{ padding: 24 }}>
        <button onClick={() => setCount((c) => c + 1)}>Count {count}</button>
      </main>
    </div>
  )
}

export default App
