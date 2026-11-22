# Case Closed

Debugging, told as a noir detective story. Paste an error message or a piece of broken code, and the detective opens a case file: suspects ranked by likelihood, evidence pinned to the board, a verdict, and a fix.

Error messages are hard to read, especially when you are starting out. Case Closed turns them into a structured case file, so you can see what went wrong, why, and how to fix it.

![Case Closed screenshot] 
![alt text](image.png)

## Features

- Paste any error or buggy code and get a full case file
- 3 suspects (possible causes) with likelihood bars
- Evidence notes pinned on a red string
- Verdict written in a typewriter animation
- Clear, correct fix at the end
- "CASE CLOSED" stamp animation
- Automatic fallback to another model if one is busy

## Tech stack

| Part | Tech |
| --- | --- |
| Frontend | React, Vite, Framer Motion |
| Backend | Node.js, Express |
| AI | Google Gemini API (structured JSON output) |

## How it works

1. The React app sends the pasted error to `POST /api/investigate`.
2. The Express server sends it to Gemini with a system prompt that forces a strict JSON shape: `title`, `suspects`, `evidence`, `verdict`, `fix`.
3. If a model is busy or unavailable, the server tries the next model in the list.
4. The JSON is returned to the client, and `CaseFile` renders it with animations.

## Project structure

```
case-closed/
  package.json
  server/
    server.js
    .env
  client/
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      CaseFile.jsx
      index.css
```

## Run locally

You need Node.js 18 or newer and a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/wajiha442/case-closed.git
cd case-closed
npm run setup
```

Create `server/.env`:

```
GEMINI_API_KEY=your_key_here
```

Start both servers:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Try it

Paste this into the box:

```
TypeError: Cannot read properties of undefined (reading 'map')
```

## Author

Wajiha
[GitHub](https://github.com/wajiha442) · [LinkedIn](https://www.linkedin.com/in/wajiha-haleem-0850a234a)
