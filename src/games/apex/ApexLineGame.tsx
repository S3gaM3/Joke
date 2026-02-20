import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion'
import { clamp, sample } from '../../lib/random'
import { useElementSize } from '../../lib/useElementSize'

type Mode = 'idle' | 'running' | 'won' | 'lost'

const WIN_MESSAGES = [
  'Идеальная траектория. Чистая линия.',
  'Вы чувствуете ритм. Апекс взят красиво.',
  'Точность и контроль. Премиально.',
] as const

const LOSE_MESSAGES = [
  'Почти. Чуть меньше спешки — и линия будет идеальна.',
  'Ничего страшного. Возьмите апекс ещё раз.',
  'Черновик линии — тоже часть процесса. Повторим?',
] as const

type Checkpoint = { x: number; y: number; r: number }

const CHECKPOINTS: Checkpoint[] = [
  { x: 0.14, y: 0.72, r: 22 },
  { x: 0.28, y: 0.54, r: 22 },
  { x: 0.44, y: 0.42, r: 24 },
  { x: 0.60, y: 0.40, r: 24 },
  { x: 0.72, y: 0.50, r: 22 },
  { x: 0.84, y: 0.66, r: 22 },
]

export function ApexLineGame() {
  const arenaRef = useRef<HTMLDivElement | null>(null)
  const { width: w, height: h } = useElementSize(arenaRef)

  const [mode, setMode] = useState<Mode>('idle')
  const [timeLeft, setTimeLeft] = useState(30)
  const [idx, setIdx] = useState(0)
  const [drag, setDrag] = useState(false)
  const [deviation, setDeviation] = useState(0) // accumulates when far
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const modeRef = useRef<Mode>('idle')
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const dims = useMemo(() => ({ aw: w || 640, ah: h || 360 }), [w, h])

  const reset = () => {
    setMode('idle')
    setTimeLeft(30)
    setIdx(0)
    setDrag(false)
    setDeviation(0)
    setResult(null)
  }

  const finish = (tone: 'success' | 'fail') => {
    if (modeRef.current !== 'running') return
    setMode(tone === 'success' ? 'won' : 'lost')
    setDrag(false)
    setResult({
      tone,
      msg: sample(tone === 'success' ? WIN_MESSAGES : LOSE_MESSAGES),
    })
  }

  const start = () => {
    reset()
    setMode('running')
  }

  useEffect(() => {
    if (mode !== 'running') return
    const endAt = performance.now() + 30_000
    let ended = false
    const int = window.setInterval(() => {
      const sec = Math.max(0, Math.ceil((endAt - performance.now()) / 1000))
      setTimeLeft(sec)
      if (!ended && sec <= 0) {
        ended = true
        finish('fail')
      }
    }, 120)
    return () => window.clearInterval(int)
  }, [mode])

  const onMove = (clientX: number, clientY: number) => {
    if (modeRef.current !== 'running' || !drag) return
    const el = arenaRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = clamp(clientX - r.left, 0, r.width)
    const y = clamp(clientY - r.top, 0, r.height)

    const cp = CHECKPOINTS[idx]
    if (!cp) return
    const cx = cp.x * r.width
    const cy = cp.y * r.height
    const d = Math.hypot(x - cx, y - cy)
    if (d <= cp.r) {
      const next = idx + 1
      setIdx(next)
      if (next >= CHECKPOINTS.length) finish('success')
      return
    }

    // deviation penalty (soft)
    if (d > cp.r * 2.4) setDeviation((v) => v + 1)
    if (deviation > 140) finish('fail')
  }

  const score = useMemo(() => {
    const progress = (idx / CHECKPOINTS.length) * 100
    const purity = Math.max(0, 100 - deviation * 0.6)
    return Math.round(progress * 0.65 + purity * 0.35)
  }, [deviation, idx])

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="glass dash-panel hud-scan rounded-[18px] p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight text-white/90">
              Apex Line
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Зажмите и ведите курсор по контрольным точкам траектории — от
              старта к апексу и дальше. Это не «рисовалка», а ощущение линии.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs tracking-[0.25em] text-white/40">TIME</div>
            <div className="font-display mt-1 text-xl font-semibold text-white/85">
              {timeLeft}s
            </div>
            <div className="mt-2 text-xs tracking-[0.25em] text-white/40">
              {idx}/{CHECKPOINTS.length} · SCORE {score}
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
          onPointerDown={(e) => {
            if (mode !== 'running') return
            ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
            setDrag(true)
            onMove(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => onMove(e.clientX, e.clientY)}
          onPointerUp={() => setDrag(false)}
          role="application"
          aria-label="Поле Apex Line"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(900px 520px at 22% 0%, rgba(var(--accent2-rgb) / 0.10), transparent 60%), radial-gradient(800px 460px at 92% 15%, rgba(var(--accent-rgb) / 0.08), transparent 58%)',
            }}
          />

          {/* ideal line */}
          <svg
            className="pointer-events-none absolute inset-0"
            viewBox={`0 0 ${dims.aw} ${dims.ah}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={`M ${dims.aw * 0.08} ${dims.ah * 0.78}
                  C ${dims.aw * 0.26} ${dims.ah * 0.58},
                    ${dims.aw * 0.46} ${dims.ah * 0.32},
                    ${dims.aw * 0.66} ${dims.ah * 0.44}
                  S ${dims.aw * 0.86} ${dims.ah * 0.74},
                    ${dims.aw * 0.94} ${dims.ah * 0.64}`}
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6 10"
            />
          </svg>

          {CHECKPOINTS.map((c, i) => {
            const active = i === idx && mode === 'running'
            const done = i < idx
            return (
              <motion.div
                key={`${c.x}-${c.y}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  left: `${c.x * 100}%`,
                  top: `${c.y * 100}%`,
                  width: c.r * 2,
                  height: c.r * 2,
                  borderColor: done
                    ? 'rgba(var(--accent2-rgb) / 0.40)'
                    : active
                      ? 'rgba(var(--accent2-rgb) / 0.70)'
                      : 'rgba(255,255,255,0.12)',
                  boxShadow: done
                    ? '0 0 20px rgba(var(--accent2-rgb) / 0.12)'
                    : active
                      ? '0 0 28px rgba(var(--accent2-rgb) / 0.16)'
                      : 'none',
                  background: done ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}
                animate={
                  active
                    ? { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.75] }
                    : { scale: 1, opacity: done ? 0.9 : 0.55 }
                }
                transition={{
                  duration: 1.2,
                  ease: EASE_IN_OUT,
                  repeat: active ? Infinity : 0,
                }}
                aria-hidden
              />
            )
          })}

          <AnimatePresence>
            {drag && mode === 'running' ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-5 top-5 rounded-[14px] border border-white/12 bg-white/5 px-4 py-3"
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                transition={{ duration: DUR.base, ease: EASE_OUT }}
              >
                <div className="text-[11px] tracking-[0.25em] text-white/45">
                  HOLD & TRACE
                </div>
                <div className="font-display mt-1 text-sm tracking-tight text-white/75">
                  {idx}/{CHECKPOINTS.length}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {mode === 'running' ? (
            <Button variant="glass" onClick={reset}>
              Стоп
            </Button>
          ) : (
            <Button onClick={start}>Старт</Button>
          )}
          <Button variant="glass" onClick={reset}>
            Сброс
          </Button>
          <div className="ml-auto text-xs tracking-[0.22em] text-white/40">
            DEVIATION {deviation}
          </div>
        </div>
      </div>

      <div className="glass dash-panel rounded-[18px] p-7">
        <div className="text-xs tracking-[0.25em] text-white/40">RULE</div>
        <div className="mt-3 font-display text-base font-semibold tracking-tight text-white/88">
          Линия — это дисциплина
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Двигайтесь по точкам без рывков. Система мягко штрафует “сильный уход”.
        </p>
        <div className="mt-6 h-px w-full chrome-line opacity-35" />
        <div className="mt-5 text-sm leading-relaxed text-white/55">
          <span className="text-white/70">Победа:</span> пройти все точки за 30
          секунд.
        </div>
      </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Апекс взят' : 'Почти'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

