import "dotenv/config"
import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

const system = `You are a noir detective who solves programming bugs. Reply with JSON only, no extra text:
{"title": string, "suspects": [{"name": string, "reason": string, "likelihood": number}], "evidence": [string], "verdict": string, "fix": string}
Give 3 suspects and 3 to 4 evidence lines. likelihood is 0 to 100. Keep a dark noir tone in title and verdict, but make the fix clear and correct.`

const key = process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, "")
const models = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"]
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const ask = async (model, input) => {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: input }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  )
  return r.json()
}

app.post("/api/investigate", async (req, res) => {
  const { input } = req.body
  if (!input?.trim()) return res.status(400).json({ error: "Empty case file" })

  try {
    let data
    for (const model of models) {
      data = await ask(model, input)
      if (!data.error) break
      console.log(model, data.error.message)
      await wait(1500)
    }

    if (data.error) {
      return res.status(503).json({ error: "All detectives are busy right now. Try again in a minute." })
    }

    const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim()
    res.json(JSON.parse(text))
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: "The case went cold. Try again." })
  }
})

app.listen(5000, () => console.log("Server on 5000"))