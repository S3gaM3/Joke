import { AnimatePresence, motion } from 'framer-motion'
import { DUR, EASE_OUT } from '../../lib/motion'

export type ResultTone = 'success' | 'fail'

type ResultPlaqueProps = {
  tone: ResultTone
  title: string
  message: string
  visible: boolean
  onClose?: () => void
}

export function ResultPlaque({
  tone,
  title,
  message,
  visible,
  onClose,
}: ResultPlaqueProps) {
  const accentHi =
    tone === 'success'
      ? 'rgba(var(--accent-rgb) / 0.92)'
      : 'rgba(var(--danger-rgb) / 0.86)'
  const accentGlow =
    tone === 'success'
      ? 'rgba(var(--accent-rgb) / 0.16)'
      : 'rgba(var(--danger-rgb) / 0.14)'

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] mx-auto flex w-full max-w-2xl justify-center px-5"
          initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
          transition={{ duration: DUR.base, ease: EASE_OUT }}
        >
          <div
            className="pointer-events-auto glass-strong w-full overflow-hidden rounded-[22px] px-7 py-6"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.18), 0 30px 90px rgba(0,0,0,0.75), 0 0 26px ${accentGlow}`,
            }}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="font-display text-base font-semibold tracking-tight text-white/90">
                  {title}
                </div>
                <div
                  className="mt-3 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accentHi}, transparent)`,
                    opacity: 0.55,
                  }}
                />
                <div className="mt-4 text-sm leading-relaxed text-white/65">
                  {message}
                </div>
              </div>

              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-[12px] border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-white/70 transition-all duration-300 ease-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent-rgb)/0.35)]"
                >
                  OK
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

