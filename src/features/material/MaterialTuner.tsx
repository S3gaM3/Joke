import { useEffect, useMemo, useState } from 'react'
import { Range } from '../../components/Range'

type Accent = 'cyan' | 'violet' | 'amber'

const ACCENTS: Record<Accent, { a: string; b: string; name: string }> = {
  cyan: { a: '66 229 255', b: '177 140 255', name: 'Cyan / Violet' },
  violet: { a: '177 140 255', b: '66 229 255', name: 'Violet / Cyan' },
  amber: { a: '255 210 138', b: '66 229 255', name: 'Amber / Cyan' },
}

export function MaterialTuner() {
  const [accent, setAccent] = useState<Accent>('cyan')
  const [glassBlur, setGlassBlur] = useState(14)
  const [glassStrongBlur, setGlassStrongBlur] = useState(18)
  const [gridSize, setGridSize] = useState(64)

  const preset = useMemo(() => ACCENTS[accent], [accent])

  useEffect(() => {
    const el = document.documentElement
    el.style.setProperty('--accent-rgb', preset.a)
    el.style.setProperty('--accent2-rgb', preset.b)
    el.style.setProperty('--glass-blur', `${glassBlur}px`)
    el.style.setProperty('--glass-strong-blur', `${glassStrongBlur}px`)
    el.style.setProperty('--grid-size', `${gridSize}px`)
  }, [glassBlur, glassStrongBlur, gridSize, preset.a, preset.b])

  return (
    <div className="glass rounded-[18px] p-7">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="font-display text-lg font-semibold tracking-tight text-white/90">
            Material Tuning
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
            Это не «настройки», а маленький ритуал: подберите акцент, плотность
            сетки и глубину стекла. Всё меняется мягко и тяжело.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs tracking-[0.25em] text-white/40">ACCENT</div>
          <div className="font-display mt-1 text-sm tracking-tight text-white/75">
            {preset.name}
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="glass rounded-[18px] p-6">
          <div className="text-xs tracking-[0.25em] text-white/40">COLOR</div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(['cyan', 'violet', 'amber'] as const).map((k) => {
              const p = ACCENTS[k]
              const active = k === accent
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setAccent(k)}
                  className="rounded-[16px] border px-4 py-4 text-left transition-all duration-500 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                  style={{
                    borderColor: active
                      ? 'rgba(var(--accent-rgb) / 0.55)'
                      : 'rgba(255,255,255,0.14)',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
                    boxShadow: active
                      ? '0 0 0 1px rgba(255,255,255,0.10), 0 0 26px rgba(var(--accent-rgb) / 0.18)'
                      : '0 0 0 1px rgba(255,255,255,0.06), 0 18px 55px rgba(0,0,0,0.55)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-display text-sm font-semibold tracking-tight text-white/82">
                      {k.toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        aria-hidden
                        className="inline-block size-3 rounded-full"
                        style={{ background: `rgb(${p.a})`, opacity: 0.9 }}
                      />
                      <span
                        aria-hidden
                        className="inline-block size-3 rounded-full"
                        style={{ background: `rgb(${p.b})`, opacity: 0.75 }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs tracking-[0.22em] text-white/40">
                    PREMIUM GLOW
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="glass rounded-[18px] p-6">
          <div className="text-xs tracking-[0.25em] text-white/40">DEPTH</div>
          <div className="mt-5 grid gap-4">
            <Range
              label="GLASS BLUR"
              min={10}
              max={22}
              step={1}
              value={glassBlur}
              onChange={(e) => setGlassBlur(Number(e.target.value))}
              valueLabel={`${glassBlur}px`}
            />
            <Range
              label="GLASS STRONG BLUR"
              min={12}
              max={28}
              step={1}
              value={glassStrongBlur}
              onChange={(e) => setGlassStrongBlur(Number(e.target.value))}
              valueLabel={`${glassStrongBlur}px`}
            />
            <Range
              label="GRID SIZE"
              min={48}
              max={92}
              step={2}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              valueLabel={`${gridSize}px`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

