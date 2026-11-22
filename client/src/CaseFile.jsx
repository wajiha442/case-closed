import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function useTyped(text, speed = 18) {
  const [out, setOut] = useState("")
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

export default function CaseFile({ data }) {
  const verdict = useTyped(data.verdict)
  const done = verdict.length === data.verdict.length

  return (
    <article className="file">
      <h2>{data.title}</h2>

      <h3>Suspects</h3>
      <ul className="suspects">
        {data.suspects.map((s, i) => (
          <li key={s.name}>
            <div className="row">
              <strong>{s.name}</strong>
              <span>{s.likelihood}%</span>
            </div>
            <div className="bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.likelihood}%` }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.25 }}
              />
            </div>
            <p>{s.reason}</p>
          </li>
        ))}
      </ul>

      <h3>Evidence</h3>
      <ul className="evidence">
        {data.evidence.map((e, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.35 }}
          >
            {e}
          </motion.li>
        ))}
      </ul>

      <h3>Verdict</h3>
      <p className="verdict">{verdict}</p>

      {done && (
        <>
          <h3>The fix</h3>
          <pre>{data.fix}</pre>
          <motion.div
            className="stamp"
            initial={{ scale: 3.2, opacity: 0, rotate: -24 }}
            animate={{ scale: 1, opacity: 0.88, rotate: -9 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            Case closed
          </motion.div>
        </>
      )}
    </article>
  )
}
