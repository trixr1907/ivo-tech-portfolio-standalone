import { useEffect, useRef, useState } from 'react'

/* Custom cursor: accent dot + lerped ring, grows on interactive targets and
   shows a label from data-cursor-label. Fine pointers only; reduced motion
   users and touch devices keep their native cursor. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (touch || reduce) return
    setEnabled(true)
    document.body.classList.add('cursor-enabled')

    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let raf = 0
    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
    }
    const tick = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(tick)
    }
    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.('a, button, [data-cursor]') as HTMLElement | null
      if (!target) {
        setActive(false)
        setLabel('')
        return
      }
      setActive(true)
      setLabel(target.getAttribute('data-cursor-label') ?? '')
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
      document.body.classList.remove('cursor-enabled')
    }
  }, [])

  if (!enabled) return null
  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={ringRef} className={`cursor-ring${active ? ' is-active' : ''}${label ? ' has-label' : ''}`}>
        {label && <span className="cursor-label">{label}</span>}
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
