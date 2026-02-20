import { motion } from 'framer-motion'
import { DUR, EASE_IN_OUT, EASE_OUT } from '../lib/motion'

type InstrumentClusterProps = {
  title?: string
  subtitle?: string
}

export function InstrumentCluster({
  title = 'SYSTEM READY',
  subtitle = 'Performance UI · Dark cockpit',
}: InstrumentClusterProps) {
  return (
    <div className="glass-strong dash-panel hud-scan relative overflow-hidden p-8 sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(980px 520px at 22% 0%, rgba(var(--accent2-rgb) / 0.14), transparent 60%), radial-gradient(860px 480px at 92% 10%, rgba(var(--accent-rgb) / 0.12), transparent 58%)',
        }}
      />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-display text-xs font-semibold tracking-[0.42em] text-white/55">
              {title}
            </div>
            <div className="mt-2 text-sm text-white/55">{subtitle}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-[10px] w-[10px] rounded-full bg-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.14)]" />
            <div className="text-xs tracking-[0.28em] text-white/40">
              COCKPIT
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass dash-panel-sm overflow-hidden p-7">
            <div className="flex items-center justify-between">
              <div className="text-xs tracking-[0.25em] text-white/40">SPEED</div>
              <div className="text-xs tracking-[0.25em] text-white/35">km/h</div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-6">
              <div>
                <div className="font-display text-5xl font-bold tracking-[-0.02em] text-white/92 sm:text-6xl">
                  240
                </div>
                <div className="mt-2 text-xs tracking-[0.25em] text-white/45">
                  DIGITAL CLUSTER
                </div>
              </div>

              <div className="w-[220px] max-w-full">
                <div className="flex items-center justify-between text-[11px] tracking-[0.25em] text-white/35">
                  <span>0</span>
                  <span>4</span>
                  <span>8</span>
                </div>
                <div className="mt-2 h-[10px] overflow-hidden rounded-full border border-white/12 bg-white/5">
                  <motion.div
                    className="h-full w-[72%] rounded-full"
                    initial={{ width: '20%' }}
                    animate={{ width: '72%' }}
                    transition={{ duration: DUR.slow, ease: EASE_OUT }}
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(var(--accent2-rgb) / 0.85), rgba(var(--accent3-rgb) / 0.85), rgba(var(--accent-rgb) / 0.85))',
                      boxShadow:
                        '0 0 18px rgba(var(--accent2-rgb) / 0.18), 0 0 18px rgba(var(--accent-rgb) / 0.12)',
                    }}
                    aria-hidden
                  />
                </div>
                <div className="mt-2 text-[11px] tracking-[0.22em] text-white/40">
                  RPM · SHIFT WINDOW
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="glass dash-panel-sm p-7">
              <div className="flex items-center justify-between">
                <div className="text-xs tracking-[0.25em] text-white/40">
                  DRIVE MODE
                </div>
                <div className="text-xs tracking-[0.25em] text-white/35">
                  SELECT
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { t: 'COMFORT', a: 0.22 },
                  { t: 'SPORT', a: 0.32 },
                  { t: 'SPORT+', a: 0.42 },
                ].map((m, i) => (
                  <motion.div
                    key={m.t}
                    className="glass dash-panel-sm px-4 py-3"
                    initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: DUR.base,
                      ease: EASE_OUT,
                      delay: i * 0.06,
                    }}
                    style={{
                      boxShadow:
                        i === 1
                          ? '0 0 0 1px rgba(255,255,255,0.10), 0 0 26px rgba(var(--accent2-rgb) / 0.14)'
                          : undefined,
                    }}
                  >
                    <div className="text-[11px] tracking-[0.25em] text-white/55">
                      {m.t}
                    </div>
                    <motion.div
                      className="mt-3 h-[3px] w-full rounded-full"
                      animate={{
                        opacity: [0.45, 0.95, 0.55],
                      }}
                      transition={{
                        duration: 1.4,
                        ease: EASE_IN_OUT,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(var(--accent2-rgb) / 0.75), rgba(var(--accent-rgb) / 0.75))',
                        opacity: m.a,
                      }}
                      aria-hidden
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass dash-panel-sm p-7">
              <div className="flex items-center justify-between">
                <div className="text-xs tracking-[0.25em] text-white/40">
                  STATUS
                </div>
                <div className="text-xs tracking-[0.25em] text-white/35">
                  AVA
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  { k: 'A', t: 'Alexandra', tone: 'var(--glow-danger)' },
                  { k: 'V', t: 'Vlada', tone: 'var(--glow-accent)' },
                  { k: 'A', t: 'Anna', tone: 'var(--glow-danger)' },
                ].map((s) => (
                  <div
                    key={s.t}
                    className="flex items-center justify-between rounded-[14px] border border-white/10 bg-white/4 px-4 py-3"
                    style={{ boxShadow: s.tone }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-[14px] border border-white/12 bg-black/20">
                        <span className="font-display text-xs tracking-[0.35em] text-white/75">
                          {s.k}
                        </span>
                      </div>
                      <div>
                        <div className="font-display text-sm font-semibold tracking-tight text-white/85">
                          {s.t}
                        </div>
                        <div className="text-[11px] tracking-[0.22em] text-white/40">
                          BRAND ONLINE
                        </div>
                      </div>
                    </div>
                    <div className="h-[10px] w-[10px] rounded-full bg-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_20px_rgba(var(--accent2-rgb)/0.16)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 h-[2px] w-full rounded-full opacity-80 m-stripe" />
      </div>
    </div>
  )
}

