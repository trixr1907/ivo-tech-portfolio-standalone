import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/* Counts from 0 up to `value` once the element enters the viewport.
   The final value is the initial render text so retrying test assertions
   and no-JS snapshots always see the real number. */
export function CountUp({ value, duration = 1100 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    let raf = 0
    let start = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const step = (now: number) => {
          if (!start) start = now
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(value * eased))
          if (progress < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration, reduceMotion])

  return <span ref={ref}>{display}</span>
}
