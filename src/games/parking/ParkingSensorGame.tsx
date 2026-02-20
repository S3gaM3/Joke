import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_OUT } from '../../lib/motion'
import { clamp, randInt, sample } from '../../lib/random'

type Mode = 'idle' | 'running' | 'done'

const WIN_MESSAGES = [
  'Парковка ювелирная. До сантиметра.',
  'Идеальная дистанция. Хладнокровно.',
  'Чистый контроль. Так и надо.',
] as const

const FAIL_MESSAGES = [
  'Почти. В следующий раз остановитесь мягче.',
  'Слишком резко. Но всё в порядке — попробуйте снова.',
  'Нормально: система любит спокойные движения.',
] as const

export function ParkingSensorGame() {
  const rounds = 8
  const [mode, setMode] = useState<Mode>('idle')
  const [round, setRound] = useState(0)
  const [cm, setCm] = useState(120)
  const [sumError, setSumError] = useState(0)
  const [lastError, setLastError] = useState<number | null>(null)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const cmRef = useRef(120)
  const rafRef = useRef<number | null>(null)
  const modeRef = useRef<Mode>('idle')

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const reset = () => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setMode('idle')
    setRound(0)
    setCm(120)
    cmRef.current = 120
    setSumError(0)
    setLastError(null)
    setResult(null)
  }

  const startRound = () => {
    setResult(null)
    setLastError(null)
    setMode('running')
    const start = randInt(95, 140)
    setCm(start)
    cmRef.current = start
    const speed = 20 + round * 1.8 // cm/s
    let t0: number | null = null
    const tick = (ts: number) => {
      if (t0 == null) t0 = ts
      const t = (ts - t0) / 1000
      const next = Math.max(0, start - speed * t)
      cmRef.current = next
      setCm(next)
      if (next <= 0.6) {
        // bumped
        stop(true)
        return
      }
      rafRef.current = window.requestAnimationFrame(tick)
    }
    rafRef.current = window.requestAnimationFrame(tick)
  }

  const targetMin = 15
  const targetMax = 25

  const stop = (bumped = false) => {
    if (modeRef.current !== 'running') return
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setMode('done')

    const cur = cmRef.current
    const clamped = clamp(cur, 0, 140)
    const err = bumped
      ? 80
      : clamped < targetMin
        ? targetMin - clamped
        : clamped > targetMax
          ? clamped - targetMax
          : 0
    setLastError(Math.round(err))
    setSumError((s) => s + err)

    const nextRound = round + 1
    setRound(nextRound)

    if (nextRound >= rounds) {
      const avg = (sumError + err) / rounds
      const ok = avg <= 10
      setResult({
        tone: ok ? 'success' : 'fail',
        msg: sample(ok ? WIN_MESSAGES : FAIL_MESSAGES),
      })
      return
    }

    window.setTimeout(() => {
      if (modeRef.current === 'idle') return
      startRound()
    }, 720)
  }

  const start = () => {
    reset()
    setRound(0)
    setSumError(0)
    setMode('running')
    window.setTimeout(() => startRound(), 60)
  }

  const avgError = useMemo(() => {
    if (round <= 0) return null
    return Math.round(sumError / round)
  }, [round, sumError])

  const zonePct = useMemo(() => {
    return {
      min: ((140 - targetMax) / 140) * 100,
      max: ((140 - targetMin) / 140) * 100,
    }
  }, [])

  const progress = useMemo(() => {
    return ((140 - clamp(cm, 0, 140)) / 140) * 100
  }, [cm])

  const beep = useMemo(() => {
    if (mode !== 'running') return '—'
    if (cm > 60) return 'slow'
    if (cm > 35) return 'medium'
    if (cm > 20) return 'fast'
    return 'critical'
  }, [cm, mode])

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="glass dash-panel hud-scan rounded-[18px] p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight text-white/90">
              Parking Sensor
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Стоп‑тайминг как в премиум‑парктронике: нажмите{' '}
              <span className="text-white/80">BRAKE</span> в зелёной зоне
              15–25cm.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs tracking-[0.25em] text-white/40">ROUND</div>
            <div className="font-display mt-1 text-xl font-semibold text-white/85">
              {Math.min(round + (mode === 'running' ? 1 : 0), rounds)}/{rounds}
            </div>
            <div className="mt-2 text-xs tracking-[0.25em] text-white/40">
              AVG {avgError == null ? '—' : `${avgError}cm`}
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-[18px] border border-white/12 bg-white/3 p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs tracking-[0.25em] text-white/40">
              DISTANCE
            </div>
            <div className="text-xs tracking-[0.25em] text-white/35">
              BEEP {beep.toUpperCase()}
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <div className="font-display text-5xl font-bold tracking-[-0.02em] text-white/92">
                {Math.max(0, Math.round(cm))}
              </div>
              <div className="mt-2 text-xs tracking-[0.25em] text-white/45">
                CM
              </div>
            </div>
            {lastError != null ? (
              <div className="text-right">
                <div className="text-xs tracking-[0.25em] text-white/40">
                  ERROR
                </div>
                <div className="font-display mt-1 text-xl font-semibold text-white/80">
                  {lastError}cm
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 relative h-[12px] overflow-hidden rounded-full border border-white/12 bg-white/5">
            <div
              aria-hidden
              className="absolute inset-y-0"
              style={{
                left: `${zonePct.min}%`,
                width: `${zonePct.max - zonePct.min}%`,
                background:
                  'linear-gradient(90deg, rgba(var(--accent2-rgb) / 0.28), rgba(var(--accent2-rgb) / 0.14))',
              }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: DUR.fast, ease: EASE_OUT }}
              style={{
                background:
                  'linear-gradient(90deg, rgba(var(--accent2-rgb) / 0.85), rgba(var(--accent-rgb) / 0.55))',
              }}
              aria-hidden
            />
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const p = (i + 1) / 7
              const on = progress / 100 >= p
              return (
                <div
                  key={`seg_${i}`}
                  className="h-[14px] rounded-[8px] border"
                  style={{
                    borderColor: 'rgba(255,255,255,0.10)',
                    background: on
                      ? i >= 5
                        ? 'rgba(var(--accent-rgb) / 0.30)'
                        : 'rgba(var(--accent2-rgb) / 0.22)'
                      : 'rgba(255,255,255,0.05)',
                    boxShadow: on
                      ? '0 0 18px rgba(var(--accent2-rgb) / 0.10)'
                      : 'none',
                    transition:
                      'background 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                  aria-hidden
                />
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {mode === 'idle' ? (
              <Button onClick={start}>Старт</Button>
            ) : (
              <Button onClick={() => stop(false)} disabled={mode !== 'running'}>
                BRAKE
              </Button>
            )}
            <Button variant="glass" onClick={reset}>
              Сброс
            </Button>
            <div className="ml-auto text-xs tracking-[0.22em] text-white/40">
              TARGET {targetMin}–{targetMax}cm
            </div>
          </div>
        </div>
      </div>

      <div className="glass dash-panel rounded-[18px] p-7">
        <div className="text-xs tracking-[0.25em] text-white/40">NOTE</div>
        <div className="mt-3 font-display text-base font-semibold tracking-tight text-white/88">
          Мягко — значит точно
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Это игра про ощущение дистанции: без паники, без «дёрганья».
        </p>
        <div className="mt-6 h-px w-full chrome-line opacity-35" />
        <div className="mt-5 text-sm leading-relaxed text-white/55">
          <span className="text-white/70">Победа:</span> средняя ошибка ≤ 10cm.
        </div>
      </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Дистанция идеальна' : 'Почти'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

