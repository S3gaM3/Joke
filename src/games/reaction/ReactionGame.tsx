import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { GameRulesPopover } from '../../components/GameRulesPopover'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion'
import { clamp, randInt, sample, uid } from '../../lib/random'
import { useElementSize } from '../../lib/useElementSize'

type Mode = 'idle' | 'running' | 'won' | 'lost'
type IconKind = 'star' | 'diamond' | 'bulb'

type Target = {
  id: string
  x: number
  y: number
  kind: IconKind
  ttlMs: number
}

type Particle = {
  id: string
  x: number
  y: number
  dx: number
  dy: number
  rot: number
  k: IconKind
}

const WIN_MESSAGES = [
  'Скорость мысли! Вы невероятно быстры.',
  'Вы успеваете за всеми трендами и задачами. Респект!',
  'Ваша энергия заряжает! Победа закономерна.',
] as const

const LOSE_MESSAGES = [
  'Ничего страшного, главное — вовремя остановиться и выпить кофе.',
  'Даже болиды Формулы-1 заезжают на пит-стоп. Отдохните и возвращайтесь!',
  'Сегодня не ваш день? Завтра вы снова соберете все звезды.',
] as const

function Icon({ kind }: { kind: IconKind }) {
  if (kind === 'diamond') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 2 L21 9 L12 22 L3 9 Z"
          fill="none"
          stroke="rgba(255,255,255,0.82)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M3 9 L12 9 L21 9"
          stroke="rgba(var(--accent2-rgb) / 0.78)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    )
  }
  if (kind === 'bulb') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M9 21h6"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 18h4"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 10a4 4 0 1 1 8 0c0 2.5-2 3.2-2 5H10c0-1.8-2-2.5-2-5Z"
          fill="none"
          stroke="rgba(255,210,138,0.82)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2.8 14.8 9l6.7.6-5 4.3 1.6 6.5L12 16.9 5.9 20.4 7.5 13.9 2.5 9.6 9.2 9 12 2.8Z"
        fill="none"
        stroke="rgba(255,255,255,0.82)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 2.8 14.8 9"
        stroke="rgba(var(--accent2-rgb) / 0.78)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ReactionGame() {
  const arenaRef = useRef<HTMLDivElement | null>(null)
  const { width: w, height: h } = useElementSize(arenaRef)

  const [mode, setMode] = useState<Mode>('idle')
  const modeRef = useRef<Mode>('idle')
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [misses, setMisses] = useState(0)
  const [target, setTarget] = useState<Target | null>(null)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )
  const [burst, setBurst] = useState<Particle[]>([])
  const [farewell, setFarewell] = useState<Particle[]>([])

  const goal = 18

  const dims = useMemo(() => {
    return { aw: w || 640, ah: h || 360 }
  }, [w, h])

  const timeoutRef = useRef<number | null>(null)
  const finishedRef = useRef(false)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  const clearTimers = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const spawn = (nextScore: number) => {
    clearTimers()
    const size = 54
    const x = randInt(size, Math.max(size, Math.floor(dims.aw - size)))
    const y = randInt(size, Math.max(size, Math.floor(dims.ah - size)))
    const ttl = clamp(900 - nextScore * 28, 320, 900)
    const kinds: IconKind[] = ['star', 'diamond', 'bulb']
    const kind = kinds[randInt(0, kinds.length - 1)]!
    const t: Target = { id: uid('t'), x, y, kind, ttlMs: ttl }
    setTarget(t)
    timeoutRef.current = window.setTimeout(() => {
      setMisses((m) => m + 1)
      setTarget(null)
      if (modeRef.current === 'running') spawn(nextScore)
    }, ttl)
  }

  const finish = useCallback((tone: 'success' | 'fail') => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setTarget(null)
    setMode(tone === 'success' ? 'won' : 'lost')
    setResult({
      tone,
      msg: sample(tone === 'success' ? WIN_MESSAGES : LOSE_MESSAGES),
    })

    if (tone === 'success') {
      const cx = Math.round(dims.aw * 0.5)
      const cy = Math.round(dims.ah * 0.5)
      const kinds: IconKind[] = ['star', 'diamond', 'bulb']
      const b: Particle[] = Array.from({ length: 16 }, (_, i) => ({
        id: uid(`b${i}`),
        x: cx + randInt(-40, 40),
        y: cy + randInt(-30, 30),
        dx: randInt(-220, 220),
        dy: randInt(-180, 180),
        rot: randInt(-40, 40),
        k: kinds[randInt(0, 2)]!,
      }))
      setBurst(b)
      setFarewell([])
      window.setTimeout(() => setBurst([]), 1300)
    } else {
      setBurst([])
      const cx = Math.round(dims.aw * 0.5)
      const cy = Math.round(dims.ah * 0.45)
      const kinds: IconKind[] = ['star', 'diamond', 'bulb']
      const f: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: uid(`f${i}`),
        x: cx + randInt(-80, 80),
        y: cy + randInt(-40, 40),
        dx: randInt(-180, 180),
        dy: randInt(160, 260),
        rot: randInt(-55, 55),
        k: kinds[randInt(0, 2)]!,
      }))
      setFarewell(f)
      window.setTimeout(() => setFarewell([]), 1200)
    }
  }, [dims.ah, dims.aw])

  const start = () => {
    setResult(null)
    setMode('running')
    setTimeLeft(30)
    setScore(0)
    setMisses(0)
    setBurst([])
    setFarewell([])
    finishedRef.current = false
    spawn(0)
  }

  const reset = () => {
    clearTimers()
    setTarget(null)
    setMode('idle')
    setResult(null)
    setTimeLeft(30)
    setScore(0)
    setMisses(0)
    setBurst([])
    setFarewell([])
    finishedRef.current = false
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  useEffect(() => {
    if (mode !== 'running') return
    const endAt = performance.now() + 30_000
    let ended = false
    const int = window.setInterval(() => {
      const sec = Math.max(0, Math.ceil((endAt - performance.now()) / 1000))
      setTimeLeft(sec)
      if (!ended && sec <= 0) {
        ended = true
        finish(scoreRef.current >= goal ? 'success' : 'fail')
      }
    }, 120)
    return () => window.clearInterval(int)
  }, [finish, goal, mode])

  const onHit = () => {
    if (mode !== 'running') return
    clearTimers()
    setTarget(null)
    setScore((s) => {
      const ns = s + 1
      scoreRef.current = ns
      if (ns >= goal) {
        finish('success')
        return ns
      }
      window.setTimeout(() => {
        if (modeRef.current === 'running') spawn(ns)
      }, 120)
      return ns
    })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-4 lg:p-6">
      <div className="absolute right-4 top-4 z-10 lg:right-6 lg:top-6">
        <GameRulesPopover title="Реакция">
          Иконки появляются и исчезают всё быстрее. Успейте нажать. {goal} попаданий за 30 секунд.
          Чем выше счёт, тем короче «окно» появления. Кликайте уверенно, без «дёрганья» мыши.
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
            <div className="font-display text-lg font-semibold text-white">{score}/{goal}</div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-white/50">MISSES</div>
            <div className="font-display text-lg font-semibold text-white">{misses}</div>
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

      <div
        ref={arenaRef}
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-white/12 bg-white/3"
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
                'radial-gradient(900px 520px at 20% 0%, rgba(var(--accent2-rgb) / 0.10), transparent 60%), radial-gradient(800px 460px at 95% 15%, rgba(var(--accent-rgb) / 0.07), transparent 58%)',
            }}
          />

          <AnimatePresence>
            {target && mode === 'running' ? (
              <motion.button
                key={target.id}
                type="button"
                onClick={onHit}
                className="absolute grid size-[62px] place-items-center rounded-2xl border border-white/16 bg-white/6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),_0_22px_60px_rgba(0,0,0,0.68)] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-[rgba(var(--accent2-rgb)/0.45)] hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                style={{
                  left: target.x,
                  top: target.y,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
                transition={{ duration: DUR.fast, ease: EASE_OUT }}
                aria-label="Нажать иконку"
              >
                <Icon kind={target.kind} />
              </motion.button>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {burst.map((b) => (
              <motion.div
                key={b.id}
                className="pointer-events-none absolute"
                style={{
                  left: b.x,
                  top: b.y,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.7, 1, 0.9],
                  x: b.dx,
                  y: b.dy,
                  rotate: b.rot,
                  filter: ['blur(6px)', 'blur(0px)', 'blur(8px)'],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.15, ease: EASE_IN_OUT }}
              >
                <div
                  className="grid size-[34px] place-items-center rounded-2xl border border-white/10 bg-white/4"
                  style={{
                    boxShadow:
                      '0 0 0 1px rgba(255,255,255,0.06), 0 0 26px rgba(var(--accent2-rgb) / 0.18)',
                  }}
                >
                  <Icon kind={b.k} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {farewell.map((b) => (
              <motion.div
                key={b.id}
                className="pointer-events-none absolute"
                style={{
                  left: b.x,
                  top: b.y,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0.7, filter: 'blur(10px)' }}
                animate={{
                  opacity: [0, 0.85, 0],
                  scale: [0.8, 1, 0.85],
                  x: b.dx,
                  y: b.dy,
                  rotate: b.rot,
                  filter: ['blur(8px)', 'blur(0px)', 'blur(12px)'],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE_IN_OUT }}
              >
                <div
                  className="grid size-[30px] place-items-center rounded-2xl border border-white/10 bg-white/3"
                  style={{
                    boxShadow:
                      '0 0 0 1px rgba(255,255,255,0.05), 0 0 22px rgba(var(--accent-rgb) / 0.14)',
                  }}
                >
                  <Icon kind={b.k} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

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
                    'radial-gradient(900px 520px at 50% 60%, rgba(0,0,0,0.25), rgba(0,0,0,0.55))',
                }}
              />
            ) : null}
          </AnimatePresence>
      </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={
          result?.tone === 'success'
            ? `Победа · ${score} очков`
            : result?.tone === 'fail'
              ? `Итог · ${score} очков`
              : ''
        }
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

