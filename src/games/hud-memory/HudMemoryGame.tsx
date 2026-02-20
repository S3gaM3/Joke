import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { GameRulesPopover } from '../../components/GameRulesPopover'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { EASE_IN_OUT } from '../../lib/motion'
import { randInt, sample } from '../../lib/random'

type Mode = 'idle' | 'show' | 'input' | 'won' | 'lost'

const WIN_MESSAGES = [
  'Память как у приборки: быстро и точно.',
  'Последовательность собрана идеально.',
  'Чистая концентрация. Премиально.',
] as const

const FAIL_MESSAGES = [
  'Ничего страшного. Это просто калибровка.',
  'Черновик — тоже часть процесса. Ещё раз?',
  'Почти. Чуть спокойнее и будет идеально.',
] as const

function makeSequence(len: number, max: number) {
  const seq: number[] = []
  for (let i = 0; i < len; i += 1) {
    let n = randInt(0, max - 1)
    if (seq[i - 1] === n) n = (n + 1) % max
    seq.push(n)
  }
  return seq
}

export function HudMemoryGame() {
  const cells = 8
  const [mode, setMode] = useState<Mode>('idle')
  const [round, setRound] = useState(0)
  const [seq, setSeq] = useState<number[]>([])
  const [pos, setPos] = useState(0)
  const [lit, setLit] = useState<number | null>(null)
  const [errors, setErrors] = useState(0)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const roundLens = useMemo(() => [4, 5, 6], [])

  const timeoutRef = useRef<number | null>(null)
  const clear = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }
  useEffect(() => () => clear(), [])

  const reset = () => {
    clear()
    setMode('idle')
    setRound(0)
    setSeq([])
    setPos(0)
    setLit(null)
    setErrors(0)
    setResult(null)
  }

  const startRound = (r: number) => {
    clear()
    const len = roundLens[r] ?? 6
    const next = makeSequence(len, cells)
    setSeq(next)
    setPos(0)
    setLit(null)
    setMode('show')

    let i = 0
    const step = () => {
      const v = next[i]
      if (v == null) {
        setLit(null)
        setMode('input')
        return
      }
      setLit(v)
      timeoutRef.current = window.setTimeout(() => {
        setLit(null)
        timeoutRef.current = window.setTimeout(() => {
          i += 1
          step()
        }, 180)
      }, 420)
    }

    timeoutRef.current = window.setTimeout(step, 420)
  }

  const start = () => {
    reset()
    setRound(0)
    startRound(0)
  }

  const finish = (tone: 'success' | 'fail') => {
    clear()
    setMode(tone === 'success' ? 'won' : 'lost')
    setResult({
      tone,
      msg: sample(tone === 'success' ? WIN_MESSAGES : FAIL_MESSAGES),
    })
  }

  const onPress = (idx: number) => {
    if (mode !== 'input') return
    const expected = seq[pos]
    if (expected === idx) {
      const nextPos = pos + 1
      setPos(nextPos)
      setLit(idx)
      window.setTimeout(() => setLit(null), 220)

      if (nextPos >= seq.length) {
        const nextRound = round + 1
        setRound(nextRound)
        if (nextRound >= roundLens.length) {
          finish('success')
        } else {
          window.setTimeout(() => startRound(nextRound), 650)
        }
      }
    } else {
      setErrors((e) => e + 1)
      setLit(idx)
      window.setTimeout(() => setLit(null), 260)
      if (errors + 1 >= 3) finish('fail')
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-4 lg:p-6">
      <div className="absolute right-4 top-4 z-10 lg:right-6 lg:top-6">
        <GameRulesPopover title="HUD Memory">
          Система показывает последовательность световых сегментов. Повторите её.
          3 раунда, до 3 ошибок. Смотрите ритм, а не отдельные вспышки.
        </GameRulesPopover>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs tracking-wider text-white/50">ROUND</div>
            <div className="font-display text-lg font-semibold text-white">
              {Math.min(round + 1, roundLens.length)}/{roundLens.length}
            </div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-white/50">ERR</div>
            <div className="font-display text-lg font-semibold text-white">{errors}/3</div>
          </div>
        </div>
        <div className="flex gap-2">
          {mode === 'idle' ? <Button onClick={start}>Старт</Button> : null}
          <Button variant="glass" onClick={reset}>Сброс</Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-white/12 bg-white/3 p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs tracking-[0.25em] text-white/40">SEQUENCE</div>
            <div className="text-xs tracking-[0.25em] text-white/35">
              {mode === 'show'
                ? 'WATCH'
                : mode === 'input'
                  ? `INPUT ${pos}/${seq.length}`
                  : mode.toUpperCase()}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {Array.from({ length: cells }).map((_, i) => {
              const active = lit === i
              return (
                <button
                  key={`cell_${i}`}
                  type="button"
                  onClick={() => onPress(i)}
                  disabled={mode !== 'input'}
                  className="dash-panel-sm relative h-14 rounded-[14px] border border-white/12 bg-white/4 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:border-white/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none"
                  style={{
                    boxShadow: active
                      ? '0 0 0 1px rgba(255,255,255,0.10), 0 0 28px rgba(var(--accent2-rgb) / 0.16)'
                      : '0 0 0 1px rgba(255,255,255,0.06), 0 18px 55px rgba(0,0,0,0.45)',
                    background: active
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))'
                      : 'rgba(255,255,255,0.04)',
                  }}
                  aria-label={`Сегмент ${i + 1}`}
                >
                  <motion.div
                    aria-hidden
                    className="absolute inset-x-3 bottom-3 h-[3px] rounded-full"
                    animate={{ opacity: active ? [0.4, 1, 0.55] : 0.25 }}
                    transition={{
                      duration: 1.2,
                      ease: EASE_IN_OUT,
                      repeat: active ? Infinity : 0,
                    }}
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(var(--accent2-rgb) / 0.85), rgba(var(--accent-rgb) / 0.65))',
                    }}
                  />
                </button>
              )
            })}
          </div>

          <div className="mt-auto pt-4 text-xs tracking-[0.22em] text-white/40">
            {mode === 'show' ? 'WATCH ONLY' : 'TOUCH INPUT'}
          </div>
        </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Калибровка пройдена' : 'Черновик'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

