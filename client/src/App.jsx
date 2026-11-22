import { useState } from "react"
import CaseFile from "./CaseFile"

export default function App() {
  const [input, setInput] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const investigate = async () => {
    setLoading(true)
    setError("")
    setData(null)
    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setData(json)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <main>
      <header>
        <h1>Case Closed</h1>
        <p>Paste the error or the broken code. The detective will find who did it.</p>
      </header>

      <section className="intake">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="TypeError: Cannot read properties of undefined (reading 'map')"
          rows={6}
        />
        <button onClick={investigate} disabled={loading || !input.trim()}>
          {loading ? "Investigating..." : "Open the case"}
        </button>
        {error && <p className="error">{error}</p>}
      </section>

      {data && <CaseFile key={data.title} data={data} />}
    </main>
  )
}
