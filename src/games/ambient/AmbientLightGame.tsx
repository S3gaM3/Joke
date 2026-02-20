import { motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { GameRulesPopover } from '../../components/GameRulesPopover'
import { ResultPlaque } from '../../features/surprise/ResultPlaque'
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion'
import { hslToRgb, oklabDistance, rgbToHex } from '../../lib/color'
import { randInt, sample } from '../../lib/random'

const WIN_MESSAGES = [
  'Подсветка настроена идеально. Дорого.',
  'Тон пойман. Очень тонко.',
  'Безупречная калибровка. Именно так.',
] as const

const FAIL_MESSAGES = [
  'Чуть мимо. Попробуйте ещё — это про нюанс.',
  'Почти. Поверните оттенок немного и добавьте глубину.',
  'Нормально: идеал всегда на пару кликов дальше.',
] as const

function shade(h: number, l: number) {
  const rgb = hslToRgb(h, 0.18, l)
  return { rgb, hex: rgbToHex(rgb) }
}

export function AmbientLightGame() {
  const [target] = useState(() => {
    const h = randInt(195, 235) // cool blue-ish
    const l = randInt(18, 34) / 100
    return shade(h, l)
  })
  const [hue, setHue] = useState(() => randInt(180, 250))
  const [lum, setLum] = useState(() => randInt(16, 40) / 100)
  const [result, setResult] = useState<null | { tone: 'success' | 'fail'; msg: string }>(
    null,
  )

  const dialRef = useRef<HTMLDivElement | null>(null)

  const selected = useMemo(() => shade(hue, lum), [hue, lum])
  const dist = useMemo(
    () => oklabDistance(target.rgb, selected.rgb),
    [selected.rgb, target.rgb],
  )

  const reset = () => {
    setHue(randInt(180, 250))
    setLum(randInt(16, 40) / 100)
    setResult(null)
  }

  const check = () => {
    const ok = dist <= 0.03
    setResult({ tone: ok ? 'success' : 'fail', msg: sample(ok ? WIN_MESSAGES : FAIL_MESSAGES) })
  }

  const setFromPointer = (clientX: number, clientY: number) => {
    const el = dialRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const ang = Math.atan2(clientY - cy, clientX - cx)
    const deg = ((ang * 180) / Math.PI + 90 + 360) % 360
    const mapped = 180 + (deg / 360) * 70
    setHue(Math.round(mapped))
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-4 lg:p-6">
      <div className="absolute right-4 top-4 z-10 lg:right-6 lg:top-6">
        <GameRulesPopover title="Ambient Light">
          Настройте полосу подсветки: оттенок (колесо) + яркость (ползунок). Попадите как можно ближе к эталону.
          Победа: Δ ≤ 0.030. Подсветка — это характер.
        </GameRulesPopover>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs tracking-wider text-white/50">MATCH</div>
            <div className="font-display text-lg font-semibold text-white">
              {(Math.max(0, 1 - dist * 10) * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-white/50">Δ</div>
            <div className="font-display text-lg font-semibold text-white">{dist.toFixed(3)}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={check} disabled={Boolean(result)}>Проверить</Button>
          <Button variant="glass" onClick={reset}>Сброс</Button>
        </div>
      </div>

      <div className="glass dash-panel hud-scan flex min-h-0 flex-1 flex-col overflow-auto rounded-[18px] p-7">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <div className="glass dash-panel-sm rounded-[18px] p-5">
            <div className="text-xs tracking-[0.25em] text-white/40">TARGET</div>
            <div className="mt-3 flex items-center gap-4">
              <div
                className="h-14 w-28 rounded-2xl border border-white/14"
                style={{
                  background: `linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), ${target.hex}`,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 18px 55px rgba(0,0,0,0.55)',
                }}
                aria-label={`Эталон ${target.hex}`}
              />
              <div>
                <div className="font-display text-base font-semibold tracking-tight text-white/88">
                  Spec
                </div>
                <div className="mt-1 text-xs tracking-[0.18em] text-white/45">
                  {target.hex.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="glass dash-panel-sm rounded-[18px] p-5">
            <div className="text-xs tracking-[0.25em] text-white/40">SELECTED</div>
            <div className="mt-3 flex items-center gap-4">
              <div
                className="h-14 w-28 rounded-2xl border border-white/14"
                style={{
                  background: `linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), ${selected.hex}`,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 18px 55px rgba(0,0,0,0.55)',
                }}
                aria-label={`Выбор ${selected.hex}`}
              />
              <div>
                <div className="font-display text-base font-semibold tracking-tight text-white/88">
                  Live
                </div>
                <div className="mt-1 text-xs tracking-[0.18em] text-white/45">
                  {selected.hex.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 glass dash-panel-sm rounded-[18px] p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs tracking-[0.25em] text-white/40">DIAL</div>
            <div className="text-xs tracking-[0.25em] text-white/35">
              HUE {hue}° · L {Math.round(lum * 100)}%
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="grid place-items-center">
              <div
                ref={dialRef}
                className="relative grid size-[220px] place-items-center rounded-full border border-white/14 bg-white/4"
                onPointerDown={(e) => {
                  ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
                  setFromPointer(e.clientX, e.clientY)
                }}
                onPointerMove={(e) => {
                  if (!(e.buttons & 1)) return
                  setFromPointer(e.clientX, e.clientY)
                }}
                aria-label="Колесо оттенка"
                role="application"
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 24px 70px rgba(0,0,0,0.70), 0 28px 85px rgba(0,0,0,0.72)',
                }}
              >
                <motion.div
                  aria-hidden
                  className="absolute inset-4 rounded-full"
                  animate={{ rotate: (hue - 180) * 3.2 }}
                  transition={{ duration: DUR.base, ease: EASE_OUT }}
                  style={{
                    background:
                      'conic-gradient(from 180deg, rgba(var(--accent2-rgb)/0.85), rgba(255,255,255,0.65), rgba(var(--accent-rgb)/0.65), rgba(var(--accent2-rgb)/0.85))',
                    filter: 'saturate(0.9)',
                    opacity: 0.55,
                  }}
                />
                <div className="absolute inset-10 rounded-full border border-white/10 bg-black/30" />
                <motion.div
                  className="grid size-[120px] place-items-center rounded-full border border-white/12 bg-white/6"
                  animate={{ rotate: hue * 0.3 }}
                  transition={{ duration: DUR.slow, ease: EASE_IN_OUT }}
                >
                  <div className="text-center">
                    <div className="text-xs tracking-[0.32em] text-white/45">
                      HUE
                    </div>
                    <div className="font-display mt-2 text-2xl font-bold tracking-tight text-white/88">
                      {hue}°
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="block">
                <div className="flex items-end justify-between gap-4">
                  <div className="text-xs tracking-[0.25em] text-white/45">
                    BRIGHTNESS
                  </div>
                  <div className="font-display text-xs tracking-[0.22em] text-white/55">
                    {Math.round(lum * 100)}%
                  </div>
                </div>
                <input
                  type="range"
                  min={0.12}
                  max={0.5}
                  step={0.01}
                  value={lum}
                  onChange={(e) => setLum(Number(e.target.value))}
                  className="mt-3 h-9 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none"
                />
              </label>

              <div className="rounded-[18px] border border-white/12 bg-white/4 px-5 py-4">
                <div className="text-xs tracking-[0.25em] text-white/45">
                  AMBIENT STRIP
                </div>
                <div
                  className="mt-3 h-[10px] w-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${selected.hex}, transparent)`,
                    boxShadow: `0 0 28px rgba(var(--accent2-rgb) / 0.12)`,
                  }}
                  aria-hidden
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <ResultPlaque
        tone={result?.tone ?? 'fail'}
        title={result?.tone === 'success' ? 'Тон настроен' : 'Ещё немного'}
        message={result?.msg ?? ''}
        visible={Boolean(result)}
        onClose={() => setResult(null)}
      />
    </div>
  )
}

