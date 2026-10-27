import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const GLYPHS = '#@%&*+=/<>[]{}01'
const FRAME_MS = 26
const FRAMES = 14

/**
 * Terminal-style decode scramble on hover.
 * Hover-only by design: keyboard focus and assistive tech always see the
 * real text, so the accessible name never turns into glyphs.
 */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(text)
  const timerRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setDisplay(text)
  }, [text])

  const run = useCallback(() => {
    if (reduceMotion || timerRef.current !== null) return
    let frame = 0
    timerRef.current = window.setInterval(() => {
      frame += 1
      if (frame >= FRAMES) {
        stop()
        return
      }
      const revealed = Math.floor((frame / FRAMES) * text.length)
      setDisplay(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < revealed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
    }, FRAME_MS)
  }, [reduceMotion, stop, text])

  useEffect(() => stop, [stop])

  return (
    <span className={className} onMouseEnter={run} onMouseLeave={stop}>
      {display}
    </span>
  )
}
