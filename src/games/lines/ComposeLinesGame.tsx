import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_OUT } from '../../lib/motion'
import { sample, uid } from '../../lib/random'
import { useElementSize } from '../../lib/useElementSize'

type Mode = 'idle' | 'running' | 'won' | 'lost'

type Target = {
  x: number // 0..1
  y: number // 0..1
  rot: number // deg
  len: number // px (base, scaled a bit)
}

type LineState = {
  id: string
  target: Target
  captured: boolean
  // motion params
  ampX: number
  ampY: number
  ampR: number
  fx: number
  fy: number
  fr: number
  px: number
  py: number
  pr: number
  // current
  x: number
  y: number
  rot: number
}

const WIN_MESSAGES = [
  'Мастер композиции! Так держать!',
  'Вы прирожденный лидер. Даже линии слушаются вас.',
  'Гармония — ваше второе имя.',
] as const

const LOSE_MESSAGES = [
  'В дизайне, как и в жизни, главное — процесс. Попробуйте ещё?',
  'Даже у гениев бывает черновик. Сделайте ещё шаг!',
  'Новая попытка — новые горизонты. Вы справитесь!',
] as const

const TARGETS: Target[] = [
  { x: 0.26, y: 0.32, rot: -18, len: 150 },
  { x: 0.38, y: 0.62, rot: 32, len: 170 },
  { x: 0.54, y: 0.36, rot: 24, len: 180 },
  { x: 0.66, y: 0.62, rot: -34, len: 160 },
  { x: 0.5, y: 0.5, rot: 90, len: 210 },
]

function angleDiff(a: number, b: number) {
  let d = ((a - b) % 360 + 540) % 360 - 180
  if (d < -180) d += 360
  return Math.abs(d)
}

function createLines(w: number, h: number): LineState[] {
  return TARGETS.map((t) => {
    const tx = t.x * w
    const ty = t.y * h
    const px = Math.random() * Math.PI * 2
    const py = Math.random() * Math.PI * 2
    const pr = Math.random() * Math.PI * 2
    const ampX = 36 + Math.random() * 26
    const ampY = 26 + Math.random() * 24
    const ampR = 14 + Math.random() * 14
    const fx = 0.7 + Math.random() * 0.9
    const fy = 0.8 + Math.random() * 1.0
    const fr = 0.7 + Math.random() * 0.9
    return {
      id: uid('line'),
      target: t,
      captured: false,
      ampX,
      ampY,
      ampR,
      fx,
      fy,
      fr,
      px,
      py,
      pr,
      x: tx,
      y: ty,
      rot: t.rot,
    }
  })
}

export function ComposeLinesGame() {
  const arenaRef = useRef<HTMLDivElement | null>(null)
  const { width: w, height: h } = useElementSize(arenaRef)

  const [mode, setMode] = useState<Mode>('idle')
  const [lines, setLines] = useState<LineState[]>(() => createLines(640, 360))
  const [timeLeft, setTimeLeft] = useState(22)
  const [misses, setMisses] = useState(0)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const dims = useMemo(() => {
    return { aw: w || 640, ah: h || 360 }
  }, [w, h])

  const reset = () => {
    setMode('idle')
    setResult(null)
    setMisses(0)
    setTimeLeft(22)
    setLines(createLines(dims.aw, dims.ah))
  }

  const start = () => {
    setResult(null)
    setMisses(0)
    setTimeLeft(22)
    setLines(createLines(dims.aw, dims.ah))
    setMode('running')
  }

  useEffect(() => {
    if (mode !== 'running') return
    const endAt = performance.now() + 22_000
    let ended = false
    const int = window.setInterval(() => {
      const sec = Math.max(0, Math.ceil((endAt - performance.now()) / 1000))
      setTimeLeft(sec)
      if (!ended && sec <= 0) {
        ended = true
        setMode('lost')
        setResult({ tone: 'fail', msg: sample(LOSE_MESSAGES) })
      }
    }, 120)
    return () => window.clearInterval(int)
  }, [mode])

  useEffect(() => {
    if (mode !== 'running') return
    let raf = 0
    const t0 = performance.now()
    const tick = () => {
      const t = (performance.now() - t0) / 1000
      setLines((prev) =>
        prev.map((ln) => {
          if (ln.captured) return ln
          const tx = ln.target.x * dims.aw
          const ty = ln.target.y * dims.ah
          const x = tx + ln.ampX * Math.sin(t * ln.fx + ln.px)
          const y = ty + ln.ampY * Math.cos(t * ln.fy + ln.py)
          const rot = ln.target.rot + ln.ampR * Math.sin(t * ln.fr + ln.pr)
          return { ...ln, x, y, rot }
        }),
      )
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [dims.ah, dims.aw, mode])

  const onLineClick = (id: string) => {
    if (mode !== 'running') return
    let hit = false
    let win = false
    setLines((prev) => {
      const next = prev.map((ln) => {
        const isThis = ln.id === id
        if (!isThis || ln.captured) {
          return ln
        }
        const tx = ln.target.x * dims.aw
        const ty = ln.target.y * dims.ah
        const d = Math.hypot(ln.x - tx, ln.y - ty)
        const r = angleDiff(ln.rot, ln.target.rot)
        const ok = d <= 16 && r <= 10
        if (!ok) return ln
        hit = true
        return { ...ln, captured: true, x: tx, y: ty, rot: ln.target.rot }
      })
      const capturedCount = next.reduce((acc, ln) => acc + (ln.captured ? 1 : 0), 0)
      win = hit && capturedCount === next.length
      return next
    })
    if (!hit) setMisses((m) => m + 1)
    if (win) {
      setMode('won')
      setResult({ tone: 'success', msg: sample(WIN_MESSAGES) })
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="glass rounded-[18px] p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight text-white/90">
              Собери композицию
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Линии двигаются вокруг своих «идеальных» мест. Нажимайте на линию
              в момент, когда она совпадает с призрачной разметкой.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs tracking-[0.25em] text-white/40">TIME</div>
            <div className="font-display mt-1 text-xl font-semibold text-white/80">
              {timeLeft}s
            </div>
            <div className="mt-2 text-xs tracking-[0.25em] text-white/40">
              MISSES {misses}
            </div>
          </div>
        </div>

        <div
          ref={arenaRef}
          className="mt-7 relative h-[360px] overflow-hidden rounded-[18px] border border-white/12 bg-white/3"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 30px 90px rgba(0,0,0,0.65)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(900px 520px at 20% 0%, rgba(177,140,255,0.10), transparent 60%), radial-gradient(800px 460px at 95% 15%, rgba(66,229,255,0.10), transparent 58%)',
            }}
          />

          {/* targets */}
          {TARGETS.map((t) => (
            <div
              key={`${t.x}-${t.y}-${t.rot}`}
              className="pointer-events-none absolute"
              style={{
                left: `${t.x * 100}%`,
                top: `${t.y * 100}%`,
                width: `${t.len}px`,
                height: '2px',
                transform: `translate(-50%, -50%) rotate(${t.rot}deg)`,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                filter: 'blur(0.1px)',
              }}
            />
          ))}

          {/* moving lines */}
          {lines.map((ln) => {
            const glow = ln.captured
              ? '0 0 0 1px rgba(255,210,138,0.22), 0 0 28px rgba(255,210,138,0.18)'
              : '0 0 0 1px rgba(255,255,255,0.08), 0 0 22px rgba(66,229,255,0.10)'
            const lost = mode === 'lost' && !ln.captured
            return (
              <button
                key={ln.id}
                type="button"
                onClick={() => onLineClick(ln.id)}
                disabled={mode !== 'running'}
                className="absolute rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none"
                style={{
                  left: ln.x,
                  top: lost ? ln.y + 80 : ln.y,
                  width: ln.target.len,
                  height: 18,
                  transform: `translate(-50%, -50%) rotate(${ln.rot}deg)`,
                  transition:
                    'transform 420ms cubic-bezier(0.22,1,0.36,1), left 420ms cubic-bezier(0.22,1,0.36,1), top 420ms cubic-bezier(0.22,1,0.36,1), opacity 520ms cubic-bezier(0.22,1,0.36,1), filter 520ms cubic-bezier(0.22,1,0.36,1)',
                  opacity: lost ? 0 : 1,
                  filter: lost ? 'blur(0.6px)' : 'blur(0px)',
                }}
                aria-label={ln.captured ? 'Линия зафиксирована' : 'Поймать линию'}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.72), rgba(66,229,255,0.65), rgba(255,255,255,0.35), transparent)',
                    boxShadow: glow,
                    opacity: ln.captured ? 0.95 : 0.8,
                  }}
                />
              </button>
            )
          })}

          <AnimatePresence>
            {mode === 'lost' ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.base, ease: EASE_OUT }}
                style={{
                  background:
                    'radial-gradient(900px 520px at 50% 60%, rgba(177,140,255,0.12), transparent 65%)',
                }}
              />
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {mode === 'running' ? (
            <Button variant="glass" onClick={reset}>
              Сдаться красиво
            </Button>
          ) : (
            <Button onClick={start}>Старт</Button>
          )}
          <Button variant="glass" onClick={reset}>
            Сброс
          </Button>

          <div className="ml-auto text-xs tracking-[0.22em] text-white/40">
            CAPTURE {lines.filter((l) => l.captured).length}/{lines.length}
          </div>
        </div>
      </div>

      <div className="glass rounded-[18px] p-7">
        <div className="text-xs tracking-[0.25em] text-white/40">TIP</div>
        <div className="mt-3 font-display text-base font-semibold tracking-tight text-white/88">
          Тайминг важнее скорости
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Это не «тест на нервы». Смотрите на призрачную разметку и ловите
          совпадение по положению и углу.
        </p>
        <div className="mt-6 h-px w-full chrome-line opacity-35" />
        <div className="mt-5 text-sm leading-relaxed text-white/55">
          <span className="text-white/70">Условие победы:</span> все линии
          зафиксированы до окончания времени.
        </div>
      </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Композиция собрана' : 'Почти!'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

