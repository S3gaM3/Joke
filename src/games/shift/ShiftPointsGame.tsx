import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { GameRulesPopover } from '../../components/GameRulesPopover'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_OUT } from '../../lib/motion'
import { clamp, sample } from '../../lib/random'

type Mode = 'idle' | 'running' | 'won' | 'lost'

const WIN_MESSAGES = [
  'Переключения идеальные. Чистый ритм.',
  'Shift‑тайминг безупречен. Как по приборке.',
  'Точно в окно. Спокойная мощь.',
] as const

const LOSE_MESSAGES = [
  'Ничего страшного. Важнее ровный темп — попробуйте ещё.',
  'Почти. Чуть больше дисциплины по окну переключения.',
  'Не спешите: ловите зелёную зону.',
] as const

export function ShiftPointsGame() {
  const goal = 10
  const [mode, setMode] = useState<Mode>('idle')
  const [gear, setGear] = useState(1)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [timeLeft, setTimeLeft] = useState(35)
  const [rpm, setRpm] = useState(2200)
  const [flash, setFlash] = useState(false)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const rpmRef = useRef(2200)
  const modeRef = useRef<Mode>('idle')
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const reset = () => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setMode('idle')
    setGear(1)
    setHits(0)
    setMisses(0)
    setTimeLeft(35)
    setRpm(2200)
    rpmRef.current = 2200
    setFlash(false)
    setResult(null)
  }

  const finish = (tone: 'success' | 'fail') => {
    if (modeRef.current !== 'running') return
    setMode(tone === 'success' ? 'won' : 'lost')
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
    const endAt = performance.now() + 35_000
    let ended = false
    const int = window.setInterval(() => {
      const sec = Math.max(0, Math.ceil((endAt - performance.now()) / 1000))
      setTimeLeft(sec)
      if (!ended && sec <= 0) {
        ended = true
        finish(hits >= goal ? 'success' : 'fail')
      }
    }, 120)
    return () => window.clearInterval(int)
  }, [hits, mode])

  useEffect(() => {
    if (mode !== 'running') return
    const t0 = performance.now()
    const tick = () => {
      const t = (performance.now() - t0) / 1000
      const speed = 0.8 + hits * 0.08
      const wave = (Math.sin(t * (2.4 + speed)) + 1) / 2 // 0..1
      const base = 1800 + gear * 200
      const peak = 7600 - gear * 120
      const next = base + (peak - base) * wave
      rpmRef.current = next
      setRpm(next)
      rafRef.current = window.requestAnimationFrame(tick)
    }
    rafRef.current = window.requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [gear, hits, mode])

  const windowMin = 6200
  const windowMax = 6900

  const onShift = () => {
    if (mode !== 'running') return
    const cur = rpmRef.current
    const ok = cur >= windowMin && cur <= windowMax
    if (ok) {
      setHits((h) => {
        const nh = h + 1
        if (nh >= goal) finish('success')
        return nh
      })
      setGear((g) => Math.min(8, g + 1))
      setFlash(true)
      window.setTimeout(() => setFlash(false), 420)
    } else {
      setMisses((m) => m + 1)
    }
  }

  const needleDeg = useMemo(() => {
    // map 0..8000 => -120..120 deg
    return -120 + (clamp(rpm, 0, 8000) / 8000) * 240
  }, [rpm])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-4 lg:p-6">
      <div className="absolute right-4 top-4 z-10 lg:right-6 lg:top-6">
        <GameRulesPopover title="Shift Points">
          Нажимайте SHIFT строго в зелёном окне (6200–6900 RPM). Мимо окна — промах.
          Победа: {goal} успешных SHIFT до конца таймера.
        </GameRulesPopover>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs tracking-wider text-white/50">TIME</div>
            <div className="font-display text-lg font-semibold text-white">
              {timeLeft}s
            </div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-white/50">{hits}/{goal} · MISSES</div>
            <div className="font-display text-lg font-semibold text-white">{misses}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {mode === 'running' ? (
            <Button onClick={onShift}>SHIFT</Button>
          ) : (
            <Button onClick={start}>Старт</Button>
          )}
          <Button variant="glass" onClick={reset}>Сброс</Button>
        </div>
      </div>

      <div className="glass dash-panel hud-scan flex min-h-0 flex-1 flex-col gap-5 rounded-[18px] p-7 sm:flex-row sm:items-center">
          <div className="relative flex min-h-0 flex-1 grid place-items-center overflow-hidden rounded-[18px] border border-white/12 bg-white/3 p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(900px 520px at 22% 0%, rgba(var(--accent2-rgb) / 0.10), transparent 60%), radial-gradient(800px 460px at 92% 15%, rgba(var(--accent-rgb) / 0.08), transparent 58%)',
              }}
            />

            <svg viewBox="0 0 260 180" className="relative h-[180px] w-full">
              <defs>
                <linearGradient id="ring" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="rgba(255,255,255,0.14)" />
                  <stop offset="0.5" stopColor="rgba(var(--accent2-rgb) / 0.22)" />
                  <stop offset="1" stopColor="rgba(255,255,255,0.10)" />
                </linearGradient>
              </defs>
              <path
                d="M 40 150 A 90 90 0 0 1 220 150"
                fill="none"
                stroke="url(#ring)"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* green shift window */}
              <path
                d="M 72 150 A 90 90 0 0 1 188 150"
                fill="none"
                stroke="rgba(var(--accent2-rgb) / 0.28)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 140 150 A 90 90 0 0 1 220 150"
                fill="none"
                stroke="rgba(var(--accent-rgb) / 0.24)"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* needle */}
              <g transform={`translate(130 150) rotate(${needleDeg})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-78"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle r="6" fill="rgba(255,255,255,0.75)" />
              </g>

              <text
                x="130"
                y="92"
                textAnchor="middle"
                fontSize="12"
                fill="rgba(255,255,255,0.45)"
                style={{ letterSpacing: '0.32em' }}
              >
                RPM
              </text>
              <text
                x="130"
                y="120"
                textAnchor="middle"
                fontSize="22"
                fill="rgba(255,255,255,0.88)"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
              >
                {Math.round(rpm)}
              </text>
              <text
                x="130"
                y="164"
                textAnchor="middle"
                fontSize="12"
                fill="rgba(255,255,255,0.42)"
                style={{ letterSpacing: '0.22em' }}
              >
                GEAR {gear}
              </text>
            </svg>

            <AnimatePresence>
              {flash ? (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DUR.base, ease: EASE_OUT }}
                  style={{
                    background:
                      'radial-gradient(900px 520px at 50% 55%, rgba(var(--accent2-rgb) / 0.16), transparent 65%)',
                  }}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Ритм пойман' : 'Ещё чуть-чуть'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

