import { useEffect, useMemo, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

export function Background() {
  const reduced = usePrefersReducedMotion()
  const [p, setP] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      setP({ x: nx, y: ny })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  const style = useMemo(() => {
    const dx = reduced ? 0 : p.x * 10
    const dy = reduced ? 0 : p.y * 10
    return {
      transform: `translate3d(${dx}px, ${dy}px, 0)`,
    } as const
  }, [p.x, p.y, reduced])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg-0),var(--bg-2))]" />

      <div className="absolute inset-0 opacity-80" style={style}>
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-sheen" />
        <div className="absolute inset-0 bg-lines" />
      </div>

      <div className="absolute inset-0 bg-vignette" />
    </div>
  )
}

