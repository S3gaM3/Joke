import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { GameRulesPopover } from '../../components/GameRulesPopover'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { EASE_IN_OUT } from '../../lib/motion'
import { clamp, sample } from '../../lib/random'

type Mode = 'idle' | 'running' | 'won' | 'lost'

const WIN_MESSAGES = [
  'Угол держится идеально. Контроль на уровне.',
  'Дрифт как по приборке: ровно, спокойно, точно.',
  'Траектория стабильна. Очень премиально.',
] as const

const LOSE_MESSAGES = [
  'Ничего страшного. Важнее плавность — попробуйте снова.',
  'Чуть больше мягкости — и вы попадёте в окно.',
  'Почти. Держите угол спокойнее.',
] as const

export function DriftAngleGame() {
  const [mode, setMode] = useState<Mode>('idle')
  const [timeLeft, setTimeLeft] = useState(45)
  const [angle, setAngle] = useState(18)
  const [target, setTarget] = useState(22)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const modeRef = useRef<Mode>('idle')
  const targetRef = useRef(22)
  const angleRef = useRef(18)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])
  useEffect(() => {
    targetRef.current = target
  }, [target])
  useEffect(() => {
    angleRef.current = angle
  }, [angle])

  const reset = () => {
    setMode('idle')
    setTimeLeft(45)
    setAngle(18)
    setTarget(22)
    setScore(0)
    setStreak(0)
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
    const endAt = performance.now() + 45_000
    let ended = false
    const int = window.setInterval(() => {
      const sec = Math.max(0, Math.ceil((endAt - performance.now()) / 1000))
      setTimeLeft(sec)
      if (!ended && sec <= 0) {
        ended = true
        finish(score >= 280 ? 'success' : 'fail')
      }
    }, 120)
    return () => window.clearInterval(int)
  }, [mode, score])

  useEffect(() => {
    if (mode !== 'running') return
    let raf = 0
    const t0 = performance.now()
    const tick = () => {
      const t = (performance.now() - t0) / 1000
      // target slowly moves (road conditions)
      const drift = Math.sin(t * 0.65) * 7 + Math.sin(t * 0.22) * 6
      const nextTarget = clamp(22 + drift, 6, 42)
      setTarget(nextTarget)

      // scoring window
      const diff = Math.abs(angleRef.current - nextTarget)
      const inWin = diff <= 3
      if (inWin) {
        setScore((s) => s + 2)
        setStreak((st) => Math.min(999, st + 1))
      } else if (diff <= 7) {
        setScore((s) => s + 1)
        setStreak((st) => Math.max(0, st - 1))
      } else {
        setStreak(0)
      }

      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [mode])

  const diff = Math.abs(angle - target)
  const tone =
    diff <= 3 ? 'rgba(var(--accent2-rgb) / 0.70)' : diff <= 7 ? 'rgba(255,255,255,0.35)' : 'rgba(var(--accent-rgb) / 0.55)'

  const pointer = useMemo(() => {
    // -45..45 deg mapped to -110..110
    const deg = -110 + (clamp(angle, 0, 45) / 45) * 220
    return deg
  }, [angle])

  const targetNeedle = useMemo(() => {
    const deg = -110 + (clamp(target, 0, 45) / 45) * 220
    return deg
  }, [target])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-4 lg:p-6">
      <div className="absolute right-4 top-4 z-10 lg:right-6 lg:top-6">
        <GameRulesPopover title="Drift Angle">
          Держите угол в «окне» (±3°). Окно ±3° — идеал. Победа: score ≥ 280 за 45 секунд.
          Система начисляет очки каждую секунду. Управление — ползунок.
        </GameRulesPopover>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs tracking-wider text-white/50">TIME</div>
            <div className="font-display text-lg font-semibold text-white">{timeLeft}s</div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-white/50">SCORE</div>
            <div className="font-display text-lg font-semibold text-white">{score}</div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-white/50">STREAK</div>
            <div className="font-display text-lg font-semibold text-white">{streak}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {mode === 'running' ? (
            <Button variant="glass" onClick={reset}>Стоп</Button>
          ) : (
            <Button onClick={start}>Старт</Button>
          )}
          <Button variant="glass" onClick={reset}>Сброс</Button>
        </div>
      </div>

      <div className="glass dash-panel hud-scan flex min-h-0 flex-1 flex-col gap-5 overflow-hidden rounded-[18px] p-7 sm:flex-row sm:items-center">
          <div className="relative overflow-hidden rounded-[18px] border border-white/12 bg-white/3 p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(900px 520px at 22% 0%, rgba(var(--accent2-rgb) / 0.10), transparent 60%), radial-gradient(800px 460px at 92% 15%, rgba(var(--accent-rgb) / 0.08), transparent 58%)',
              }}
            />

            <div className="relative grid place-items-center">
              <svg viewBox="0 0 280 190" className="h-[190px] w-full">
                <path
                  d="M 45 160 A 95 95 0 0 1 235 160"
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 45 160 A 95 95 0 0 1 235 160"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="22"
                  strokeLinecap="round"
                />

                {/* target window */}
                <g transform="translate(140 160)">
                  <g transform={`rotate(${targetNeedle})`}>
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-80"
                      stroke="rgba(var(--accent2-rgb) / 0.55)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                </g>

                {/* current needle */}
                <g transform="translate(140 160)">
                  <g transform={`rotate(${pointer})`}>
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-84"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.18))' }}
                    />
                  </g>
                  <circle r="6" fill="rgba(255,255,255,0.75)" />
                </g>

                <text
                  x="140"
                  y="90"
                  textAnchor="middle"
                  fontSize="12"
                  fill="rgba(255,255,255,0.45)"
                  style={{ letterSpacing: '0.32em' }}
                >
                  ANGLE
                </text>
                <text
                  x="140"
                  y="120"
                  textAnchor="middle"
                  fontSize="28"
                  fill="rgba(255,255,255,0.88)"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
                >
                  {Math.round(angle)}°
                </text>
              </svg>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs tracking-[0.22em] text-white/40">
              <span>TARGET {Math.round(target)}°</span>
              <span style={{ color: tone }}>Δ {diff.toFixed(1)}°</span>
            </div>
            <div className="mt-3 h-[10px] overflow-hidden rounded-full border border-white/12 bg-white/5">
              <motion.div
                aria-hidden
                className="h-full"
                animate={{ x: diff <= 3 ? [0, 8, 0] : 0, opacity: diff <= 3 ? 0.9 : 0.55 }}
                transition={{ duration: 1.1, ease: EASE_IN_OUT, repeat: diff <= 3 ? Infinity : 0 }}
                style={{
                  width: '36%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(var(--accent2-rgb) / 0.85), rgba(var(--accent-rgb) / 0.40), transparent)',
                }}
              />
            </div>
          </div>

        <div className="mt-5 shrink-0 rounded-[18px] border border-white/12 bg-white/4 px-6 py-5">
          <div className="flex items-end justify-between gap-4">
            <div className="text-xs tracking-[0.25em] text-white/45">CONTROL</div>
            <div className="font-display text-xs tracking-[0.22em] text-white/55">
              {Math.round(angle)}°
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={45}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            disabled={mode !== 'running'}
            className="mt-3 h-9 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none disabled:opacity-60"
          />
        </div>
      </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Угол удержан' : 'Ещё чуть-чуть'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

