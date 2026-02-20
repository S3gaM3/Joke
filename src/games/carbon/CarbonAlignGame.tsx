import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { GameRulesPopover } from '../../components/GameRulesPopover'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_OUT } from '../../lib/motion'
import { clamp, randInt, sample } from '../../lib/random'

const WIN_MESSAGES = [
  'Идеальная подгонка. Карбон лег как надо.',
  'Стыковка безупречна. Премиальная точность.',
  'Чистая настройка. Очень тонко.',
] as const

const FAIL_MESSAGES = [
  'Почти. Смещайте аккуратно по миллиметру.',
  'Нормально: идеал — это нюанс.',
  'Ещё чуть-чуть. Вы близко.',
] as const

export function CarbonAlignGame() {
  const [target] = useState(() => ({ x: randInt(-18, 18), y: randInt(-18, 18) }))
  const [pos, setPos] = useState(() => ({ x: randInt(-28, 28), y: randInt(-28, 28) }))
  const [drag, setDrag] = useState(false)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const startRef = useRef<{ x: number; y: number } | null>(null)

  const err = useMemo(() => Math.hypot(pos.x - target.x, pos.y - target.y), [pos, target])
  const score = useMemo(() => Math.round(Math.max(0, 100 - err * 3.2)), [err])

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (result) return
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    setDrag(true)
    startRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag || result) return
    const s = startRef.current
    if (!s) return
    const nx = clamp(e.clientX - s.x, -44, 44)
    const ny = clamp(e.clientY - s.y, -44, 44)
    setPos({ x: nx, y: ny })
  }

  const onUp = () => setDrag(false)

  const reset = () => {
    setPos({ x: randInt(-28, 28), y: randInt(-28, 28) })
    setResult(null)
    setDrag(false)
  }

  const check = () => {
    const ok = err <= 6
    setResult({ tone: ok ? 'success' : 'fail', msg: sample(ok ? WIN_MESSAGES : FAIL_MESSAGES) })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-4 lg:p-6">
      <div className="absolute right-4 top-4 z-10 lg:right-6 lg:top-6">
        <GameRulesPopover title="Carbon Align">
          Подгонка «дорогого материала»: двигайте верхний слой так, чтобы рисунок совпал.
          Победа — почти незаметная, но идеальная. Цель: Δ ≤ 6. Двигайте медленно по 1–2px.
        </GameRulesPopover>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs tracking-wider text-white/50">SCORE</div>
            <div className="font-display text-lg font-semibold text-white">{score}</div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-white/50">Δ</div>
            <div className="font-display text-lg font-semibold text-white">{err.toFixed(1)}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={check} disabled={Boolean(result)}>Проверить</Button>
          <Button variant="glass" onClick={reset}>Сброс</Button>
        </div>
      </div>

      <div className="glass dash-panel hud-scan flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] p-7">
        <div className="flex min-h-0 flex-1 flex-col gap-5 sm:flex-row sm:items-stretch">
          <div className="relative flex-1 overflow-hidden rounded-[18px] border border-white/12 bg-white/3 p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-65"
              style={{
                background:
                  'radial-gradient(900px 520px at 22% 0%, rgba(var(--accent2-rgb) / 0.10), transparent 60%), radial-gradient(800px 460px at 92% 15%, rgba(var(--accent-rgb) / 0.08), transparent 58%)',
              }}
            />
            <div className="relative grid place-items-center">
              <div className="relative h-[260px] w-[min(520px,100%)] overflow-hidden rounded-[18px] border border-white/10 bg-black/30">
                {/* base carbon */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 10px), repeating-linear-gradient(45deg, rgba(255,255,255,0.00) 0px, rgba(255,255,255,0.00) 8px, rgba(255,255,255,0.035) 8px, rgba(255,255,255,0.035) 10px)',
                    backgroundSize: '62px 62px',
                    transform: `translate3d(${target.x}px, ${target.y}px, 0)`,
                    opacity: 0.55,
                  }}
                  aria-hidden
                />

                {/* target highlight (subtle) */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(520px 220px at 50% 50%, rgba(255,255,255,0.06), transparent 60%)',
                    opacity: 0.55,
                  }}
                  aria-hidden
                />

                {/* movable layer */}
                <motion.div
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  animate={{ x: pos.x, y: pos.y }}
                  transition={{ duration: drag ? 0 : DUR.fast, ease: EASE_OUT }}
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 10px), repeating-linear-gradient(45deg, rgba(255,255,255,0.00) 0px, rgba(255,255,255,0.00) 8px, rgba(255,255,255,0.05) 8px, rgba(255,255,255,0.05) 10px)',
                    backgroundSize: '62px 62px',
                    opacity: 0.8,
                    mixBlendMode: 'screen',
                  }}
                  role="application"
                  aria-label="Перетаскиваемый слой карбона"
                />

                {/* crosshair */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[1px] w-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-full w-[1px] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent, rgba(255,255,255,0.14), transparent)',
                  }}
                />
              </div>
            </div>

            <div className="mt-5 text-xs tracking-[0.22em] text-white/40">
              DRAG TO ALIGN · TARGET Δ ≤ 6
            </div>
          </div>
        </div>

        <AnimatePresence>
          {result?.tone === 'success' ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.base, ease: EASE_OUT }}
              style={{
                background:
                  'radial-gradient(900px 520px at 50% 45%, rgba(var(--accent2-rgb) / 0.12), transparent 65%)',
              }}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Стыковка идеальна' : 'Нюанс'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

