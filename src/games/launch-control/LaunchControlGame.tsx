import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion'
import { clamp, randInt, sample } from '../../lib/random'

type Phase = 'idle' | 'armed' | 'go' | 'done'

const WIN_MESSAGES = [
  'Launch control активирован. Чистая реакция.',
  'Идеальный старт. Без суеты — только контроль.',
  'Спокойно, точно, быстро. Премиальный темп.',
] as const

const FAIL_MESSAGES = [
  'Рано. Но красиво. Давайте ещё раз — без нервов.',
  'Почти. Секунда дисциплины — и всё станет идеально.',
  'Ничего страшного: в спорте важнее стабильность.',
] as const

export function LaunchControlGame() {
  const attempts = 6
  const [phase, setPhase] = useState<Phase>('idle')
  const [left, setLeft] = useState(attempts)
  const [best, setBest] = useState<number | null>(null)
  const [last, setLast] = useState<number | null>(null)
  const [early, setEarly] = useState(false)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const startAtRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const clear = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => () => clear(), [])

  const arm = () => {
    setResult(null)
    setLast(null)
    setEarly(false)
    setPhase('armed')
    clear()
    const delay = randInt(850, 2100)
    timeoutRef.current = window.setTimeout(() => {
      startAtRef.current = performance.now()
      setPhase('go')
      timeoutRef.current = window.setTimeout(() => {
        // missed window
        if (phase === 'done') return
        setLast(null)
        setEarly(false)
        setPhase('done')
        setResult({ tone: 'fail', msg: sample(FAIL_MESSAGES) })
      }, 950)
    }, delay)
  }

  const reset = () => {
    clear()
    startAtRef.current = null
    setPhase('idle')
    setLeft(attempts)
    setBest(null)
    setLast(null)
    setEarly(false)
    setResult(null)
  }

  const onTap = () => {
    if (phase === 'idle') return
    if (phase === 'armed') {
      setEarly(true)
      setPhase('done')
      setResult({ tone: 'fail', msg: sample(FAIL_MESSAGES) })
      setLeft((n) => Math.max(0, n - 1))
      clear()
      return
    }
    if (phase !== 'go') return
    clear()
    const t0 = startAtRef.current
    const rt = t0 ? performance.now() - t0 : 9999
    const rounded = Math.round(rt)
    setLast(rounded)
    setBest((b) => (b == null ? rounded : Math.min(b, rounded)))
    setPhase('done')
    setLeft((n) => Math.max(0, n - 1))
    setResult({ tone: 'success', msg: sample(WIN_MESSAGES) })
  }

  const readyToArm = phase === 'idle' || phase === 'done'
  const finished = left <= 0 && phase === 'done'

  const scoreLabel = useMemo(() => {
    if (best == null) return '—'
    return `${best}ms`
  }, [best])

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="glass dash-panel hud-scan rounded-[18px] p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight text-white/90">
              Launch Control
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Нажмите, когда увидите <span className="text-white/80">GO</span>.
              Если нажать раньше — это «фальстарт». Идеальный старт выглядит
              спокойно.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs tracking-[0.25em] text-white/40">BEST</div>
            <div className="font-display mt-1 text-xl font-semibold text-white/85">
              {scoreLabel}
            </div>
            <div className="mt-2 text-xs tracking-[0.25em] text-white/40">
              LEFT {left}/{attempts}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onTap}
          className="mt-7 relative grid h-[280px] w-full place-items-center overflow-hidden rounded-[18px] border border-white/12 bg-white/3 text-left transition-all duration-500 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 30px 90px rgba(0,0,0,0.65)',
          }}
          aria-label="Тап-панель Launch Control"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-75"
            style={{
              background:
                'radial-gradient(900px 520px at 22% 0%, rgba(var(--accent2-rgb) / 0.10), transparent 60%), radial-gradient(800px 460px at 92% 15%, rgba(var(--accent-rgb) / 0.08), transparent 58%)',
            }}
          />

          <div className="relative text-center">
            <div className="text-xs tracking-[0.32em] text-white/45">
              {phase === 'idle'
                ? 'PRESS START'
                : phase === 'armed'
                  ? 'HOLD'
                  : phase === 'go'
                    ? 'NOW'
                    : 'READY'}
            </div>

            <AnimatePresence mode="wait">
              {phase === 'go' ? (
                <motion.div
                  key="go"
                  initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
                  transition={{ duration: DUR.fast, ease: EASE_OUT }}
                  className="font-display mt-3 text-6xl font-bold tracking-[-0.02em]"
                  style={{
                    color: 'rgba(255,255,255,0.92)',
                    textShadow:
                      '0 0 24px rgba(var(--accent2-rgb) / 0.18), 0 0 24px rgba(var(--accent-rgb) / 0.12)',
                  }}
                >
                  GO
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
                  transition={{ duration: DUR.base, ease: EASE_OUT }}
                  className="font-display mt-3 text-4xl font-semibold tracking-tight text-white/80"
                >
                  {phase === 'armed' ? 'ARMED' : phase === 'done' ? 'DONE' : 'READY'}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-sm text-white/55">
              {early
                ? 'Фальстарт.'
                : last != null
                  ? `Реакция: ${last}ms`
                  : phase === 'armed'
                    ? 'Ждите сигнала.'
                    : ' '}
            </div>
          </div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-6 right-6 h-[3px] overflow-hidden rounded-full border border-white/10 bg-white/5"
            initial={false}
            animate={{ opacity: phase === 'armed' || phase === 'go' ? 1 : 0.55 }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          >
            <motion.div
              className="h-full"
              initial={false}
              animate={{
                x:
                  phase === 'go'
                    ? '0%'
                    : phase === 'armed'
                      ? ['-40%', '40%', '-30%']
                      : '0%',
                opacity: phase === 'go' ? 0.95 : 0.55,
              }}
              transition={{
                duration: phase === 'go' ? 0.9 : 1.6,
                ease: EASE_IN_OUT,
                repeat: phase === 'armed' ? Infinity : 0,
              }}
              style={{
                width: '46%',
                background:
                  'linear-gradient(90deg, transparent, rgba(var(--accent2-rgb) / 0.85), rgba(var(--accent-rgb) / 0.65), transparent)',
              }}
            />
          </motion.div>
        </button>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {readyToArm && !finished ? (
            <Button onClick={arm}>Старт</Button>
          ) : (
            <Button variant="glass" onClick={arm} disabled>
              Старт
            </Button>
          )}
          <Button variant="glass" onClick={reset}>
            Сброс
          </Button>

          <div className="ml-auto text-xs tracking-[0.22em] text-white/40">
            WINDOW {clamp(950 - (best ?? 0) * 0, 320, 950)}ms
          </div>
        </div>
      </div>

      <div className="glass dash-panel rounded-[18px] p-7">
        <div className="text-xs tracking-[0.25em] text-white/40">TIP</div>
        <div className="mt-3 font-display text-base font-semibold tracking-tight text-white/88">
          Стабильность важнее одного «супер‑клика»
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Не ловите пик эмоций. Просто ждите GO и нажимайте уверенно. Это
          ощущается дороже.
        </p>
        <div className="mt-6 h-px w-full chrome-line opacity-35" />
        <div className="mt-5 text-sm leading-relaxed text-white/55">
          <span className="text-white/70">Режим:</span> 6 попыток. Лучшее время
          фиксируется как “Best”.
        </div>
      </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={
          result?.tone === 'success'
            ? 'Старт принят'
            : result?.tone === 'fail'
              ? 'Контроль'
              : ''
        }
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

