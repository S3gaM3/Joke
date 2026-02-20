import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion'
import { hslToRgb, oklabDistance, rgbToHex, type Rgb } from '../../lib/color'
import { clamp, randInt, sample } from '../../lib/random'

type Shade = { rgb: Rgb; hex: string }

const WIN_MESSAGES = [
  'У вас безупречный вкус, леди!',
  'Глаз — алмаз! Вы видите красоту в деталях.',
  'Идеальное решение. Как и всё, что вы делаете.',
] as const

function makePalette(steps: number): Shade[] {
  return Array.from({ length: steps }, (_, i) => {
    const t = steps <= 1 ? 0 : i / (steps - 1)
    const h = 210 + 46 * t + 18 * Math.sin(i * 0.55)
    const s = 0.12 + 0.02 * Math.cos(i * 0.7)
    const l = 0.18 + 0.34 * t + 0.015 * Math.sin(i * 0.9)
    const rgb = hslToRgb(h, clamp(s, 0.06, 0.18), clamp(l, 0.12, 0.6))
    return { rgb, hex: rgbToHex(rgb) }
  })
}

export function FindShadeGame() {
  const steps = 16
  const stepDeg = 360 / steps
  const palette = useMemo(() => makePalette(steps), [])

  const [targetIndex, setTargetIndex] = useState(() => randInt(0, steps - 1))
  const [selectedIndex, setSelectedIndex] = useState(() => randInt(0, steps - 1))
  const [result, setResult] = useState<null | { tone: 'success'; msg: string }>(
    null,
  )
  const [hint, setHint] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)

  const dialRef = useRef<HTMLDivElement | null>(null)

  const target = palette[targetIndex]!
  const selected = palette[selectedIndex]!
  const distance = oklabDistance(target.rgb, selected.rgb)

  const reset = () => {
    setResult(null)
    setHint(null)
    setFlash(false)
    setTargetIndex(randInt(0, steps - 1))
    setSelectedIndex(randInt(0, steps - 1))
  }

  const check = () => {
    const correct = selectedIndex === targetIndex || distance <= 0.028
    if (correct) {
      setHint(null)
      setFlash(true)
      setResult({ tone: 'success', msg: sample(WIN_MESSAGES) })
      window.setTimeout(() => setFlash(false), 520)
      return
    }
    const warmth =
      selectedIndex < targetIndex ? 'Чуть светлее.' : 'Чуть темнее.'
    setHint(warmth)
  }

  const setFromPointer = (clientX: number, clientY: number) => {
    const el = dialRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const ang = Math.atan2(clientY - cy, clientX - cx) // -pi..pi, 0 at right
    const deg = (ang * 180) / Math.PI
    const degTop = (deg + 90 + 360) % 360 // 0 at top
    const idx = Math.round(degTop / stepDeg) % steps
    setSelectedIndex(idx)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="glass rounded-[18px] p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight text-white/90">
              Найди оттенок
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Сверху — эталон. Справа — «премиальное» колесо выбора. Поймай
              максимально близкий графитовый оттенок.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs tracking-[0.25em] text-white/40">
              PRECISION
            </div>
            <div className="font-display mt-1 text-sm tracking-tight text-white/75">
              {(Math.max(0, 1 - distance * 10) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-[18px] p-5">
            <div className="text-xs tracking-[0.25em] text-white/40">
              ЭТАЛОН
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div
                className="h-14 w-20 rounded-2xl border"
                style={{
                  background: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), ${target.hex}`,
                  borderColor: 'rgba(255,255,255,0.16)',
                  boxShadow:
                    '0 0 0 1px rgba(255,255,255,0.08), 0 18px 55px rgba(0,0,0,0.65)',
                }}
                aria-label={`Эталонный цвет ${target.hex}`}
              />
              <div>
                <div className="font-display text-base font-semibold tracking-tight text-white/88">
                  Graphite Spec
                </div>
                <div className="mt-1 text-xs tracking-[0.18em] text-white/45">
                  {target.hex.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[18px] p-5">
            <div className="text-xs tracking-[0.25em] text-white/40">
              ВЫБОР
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div
                className="h-14 w-20 rounded-2xl border"
                style={{
                  background: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), ${selected.hex}`,
                  borderColor: 'rgba(255,255,255,0.16)',
                }}
                aria-label={`Выбранный цвет ${selected.hex}`}
              />
              <div>
                <div className="font-display text-base font-semibold tracking-tight text-white/88">
                  Selected
                </div>
                <div className="mt-1 text-xs tracking-[0.18em] text-white/45">
                  {selected.hex.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button onClick={check} disabled={Boolean(result)}>
            Проверить
          </Button>
          <Button variant="glass" onClick={reset}>
            Новый эталон
          </Button>
          <div className="ml-auto text-sm text-white/55">
            {hint ? (
              <span className="font-display tracking-tight">{hint}</span>
            ) : (
              <span className="text-white/35">Подсказка появится здесь.</span>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-[18px] p-7">
        <div className="flex items-center justify-between">
          <div className="text-xs tracking-[0.25em] text-white/40">
            WHEEL DIAL
          </div>
          <div className="text-xs tracking-[0.25em] text-white/35">
            STEP {selectedIndex + 1}/{steps}
          </div>
        </div>

        <div className="mt-6 grid place-items-center">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[8px] border-b-[12px] border-x-transparent border-b-white/35"
            />

            <div
              ref={dialRef}
              className="relative grid size-[300px] place-items-center rounded-full border border-white/14 bg-white/4 shadow-[0_0_0_1px_rgba(255,255,255,0.06),_0_28px_85px_rgba(0,0,0,0.72)]"
              onPointerDown={(e) => {
                ;(e.currentTarget as HTMLDivElement).setPointerCapture(
                  e.pointerId,
                )
                setFromPointer(e.clientX, e.clientY)
              }}
              onPointerMove={(e) => {
                if (!(e.buttons & 1)) return
                setFromPointer(e.clientX, e.clientY)
              }}
              role="application"
              aria-label="Колесо выбора оттенка"
            >
              <motion.div
                className="absolute inset-4 rounded-full border border-white/10 bg-white/3"
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 22px 60px rgba(0,0,0,0.65)',
                }}
              />

              <motion.div
                className="absolute inset-7 rounded-full"
                animate={{ rotate: -selectedIndex * stepDeg }}
                transition={{ duration: DUR.base, ease: EASE_OUT }}
              >
                {palette.map((c, i) => {
                  const a = (i * 2 * Math.PI) / steps
                  const x = 50 + Math.cos(a) * 44
                  const y = 50 + Math.sin(a) * 44
                  const active = i === selectedIndex
                  return (
                    <div
                      key={c.hex}
                      className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        background: `linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)), ${c.hex}`,
                        borderColor: active
                          ? 'rgba(66,229,255,0.55)'
                          : 'rgba(255,255,255,0.16)',
                        boxShadow: active
                          ? '0 0 0 1px rgba(66,229,255,0.25), 0 0 24px rgba(66,229,255,0.25)'
                          : 'none',
                        transition:
                          'border-color 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms cubic-bezier(0.22,1,0.36,1)',
                      }}
                      aria-hidden
                    />
                  )
                })}
              </motion.div>

              <motion.div
                className="absolute grid size-[150px] place-items-center rounded-full border border-white/12 bg-white/6"
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.08), 0 14px 40px rgba(0,0,0,0.65)',
                }}
                animate={{ rotate: selectedIndex * 0.6 }}
                transition={{ duration: DUR.slow, ease: EASE_IN_OUT }}
              >
                <div className="text-center">
                  <div className="font-display text-xs font-semibold tracking-[0.32em] text-white/55">
                    SELECT
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold tracking-tight text-white/88">
                    {selectedIndex + 1}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs leading-relaxed text-white/45">
          Потяните колесо (drag) и отпустите на нужном шаге.
        </div>
      </div>

      <AnimatePresence>
        {flash ? (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[55]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            style={{
              background:
                'radial-gradient(900px 520px at 50% 40%, rgba(255,210,138,0.24), transparent 65%)',
            }}
          />
        ) : null}
      </AnimatePresence>

      <ResultPlaque
        tone="success"
        title="Точное попадание"
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

