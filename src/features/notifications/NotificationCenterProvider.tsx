import { type PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DUR, EASE_OUT } from '../../lib/motion'
import {
  makeNotificationId,
  NotificationCtx,
  type AppNotification,
} from './notificationCenter'

export function NotificationCenterProvider({ children }: PropsWithChildren) {
  const [current, setCurrent] = useState<AppNotification | null>(null)

  const push = useCallback((n: Omit<AppNotification, 'id'>) => {
    const next: AppNotification = { id: makeNotificationId(), ...n }
    setCurrent(next)
    window.setTimeout(() => {
      setCurrent((c) => (c?.id === next.id ? null : c))
    }, 6200)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <NotificationCtx.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-[max(10px,env(safe-area-inset-top))]">
        <AnimatePresence>
          {current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: -18, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -18, filter: 'blur(12px)' }}
              transition={{ duration: DUR.base, ease: EASE_OUT }}
              className="pointer-events-auto w-full max-w-[540px]"
            >
              <div className="glass-strong overflow-hidden rounded-[22px] border border-white/10 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-[12px] bg-white/8">
                        <span className="font-display text-[11px] font-semibold tracking-[0.30em] text-white/85">
                          AVA
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold text-white/85">
                          {current.title}
                        </div>
                        <div className="text-[11px] tracking-[0.18em] text-white/45">
                          now
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-[15px] leading-relaxed text-white/82">
                      {current.body}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="pointer-events-auto rounded-[12px] bg-white/8 px-3 py-2 text-xs font-semibold text-white/70 transition-all duration-300 ease-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent-rgb)/0.35)]"
                    onClick={() => setCurrent(null)}
                  >
                    Закрыть
                  </button>
                </div>

                <motion.div
                  aria-hidden
                  className="mt-4 h-[2px] w-full rounded-full"
                  initial={{ scaleX: 1, opacity: 0.55 }}
                  animate={{ scaleX: 0, opacity: 0.25 }}
                  transition={{ duration: 6.2, ease: EASE_OUT }}
                  style={{
                    transformOrigin: 'left center',
                    background:
                      'linear-gradient(90deg, rgba(var(--accent-rgb) / 0.85), rgba(var(--accent2-rgb) / 0.65))',
                  }}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </NotificationCtx.Provider>
  )
}

