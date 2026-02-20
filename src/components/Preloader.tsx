import { AnimatePresence, motion } from 'framer-motion'
import { DUR, EASE_IN_OUT, EASE_OUT } from '../lib/motion'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

type PreloaderProps = {
  visible: boolean
}

export function Preloader({ visible }: PreloaderProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.base, ease: EASE_OUT }}
        >
          <div className="relative w-[min(520px,92vw)]">
            <div className="glass-strong relative overflow-hidden px-8 py-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(720px 360px at 18% 0%, rgba(var(--accent2-rgb) / 0.16), transparent 56%), radial-gradient(640px 330px at 92% 20%, rgba(var(--accent-rgb) / 0.14), transparent 55%)',
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="font-display text-xs font-semibold tracking-[0.38em] text-white/55">
                    STARTING SYSTEM
                  </div>
                  <div className="font-display text-xs tracking-[0.35em] text-white/35">
                    AVA
                  </div>
                </div>

                <div className="mt-7">
                  <svg
                    viewBox="0 0 520 86"
                    className="h-[86px] w-full"
                    role="img"
                    aria-label="Загрузка"
                  >
                    <defs>
                      <linearGradient
                        id="line"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0" stopColor="rgba(255,255,255,0)" />
                        <stop
                          offset="0.35"
                          stopColor="rgba(255,255,255,0.75)"
                        />
                        <stop
                          offset="0.55"
                          stopColor="rgba(var(--accent2-rgb) / 0.92)"
                        />
                        <stop
                          offset="0.75"
                          stopColor="rgba(var(--accent-rgb) / 0.82)"
                        />
                        <stop offset="1" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                      <filter id="softGlow" x="-40%" y="-200%" width="180%" height="420%">
                        <feGaussianBlur stdDeviation="1.6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {[18, 43, 68].map((y, i) => (
                      <motion.path
                        key={y}
                        d={`M 10 ${y} L 510 ${y}`}
                        stroke="url(#line)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#softGlow)"
                        initial={{ pathLength: 0, opacity: 0.25 }}
                        animate={
                          reduced
                            ? { pathLength: 1, opacity: 0.9 }
                            : { pathLength: [0, 1, 1], opacity: [0.2, 0.95, 0.7] }
                        }
                        transition={{
                          duration: reduced ? DUR.fast : 1.25,
                          ease: EASE_IN_OUT,
                          delay: i * 0.15,
                          repeat: reduced ? 0 : Infinity,
                          repeatType: 'loop',
                          repeatDelay: 0.25,
                        }}
                      />
                    ))}
                  </svg>
                </div>

                <div className="mt-6 flex items-end justify-between gap-6">
                  <div className="text-xs leading-relaxed text-white/55">
                    <div className="font-display tracking-[0.18em] text-white/70">
                      Александра · Влада · Анна
                    </div>
                    <div className="mt-1 text-white/45">
                      Премиальная динамика. Мягкий свет. Чистая геометрия.
                    </div>
                  </div>
                  <motion.div
                    className="h-[10px] w-[10px] rounded-full"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.25))',
                      boxShadow:
                        '0 0 0 1px rgba(255,255,255,0.15), 0 0 28px rgba(var(--accent2-rgb) / 0.20)',
                    }}
                    animate={reduced ? undefined : { opacity: [0.4, 1, 0.55] }}
                    transition={
                      reduced
                        ? undefined
                        : { duration: 1.2, ease: EASE_IN_OUT, repeat: Infinity }
                    }
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

