import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { DUR, EASE_OUT } from '../../lib/motion'
import { FindShadeGame } from '../../games/find-shade/FindShadeGame'
import { ComposeLinesGame } from '../../games/lines/ComposeLinesGame'
import { ReactionGame } from '../../games/reaction/ReactionGame'

type SurpriseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M5 5 L15 15 M15 5 L5 15"
        stroke="rgba(255,255,255,0.72)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SurpriseDialog({ open, onOpenChange }: SurpriseDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          aria-label="Сюрприз: мини-игры"
        >
          <motion.div
            className="glass-strong max-h-[86dvh] overflow-hidden"
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          >
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(900px 460px at 25% 0%, rgba(177,140,255,0.18), transparent 60%), radial-gradient(760px 420px at 90% 10%, rgba(66,229,255,0.14), transparent 58%)',
                }}
              />

              <div className="relative max-h-[86dvh] overflow-y-auto overscroll-contain">
                <div className="relative flex items-start justify-between gap-6 px-7 py-6 sm:px-8">
                  <div>
                    <Dialog.Title className="font-display text-xl font-semibold tracking-tight text-white/92">
                      Сюрприз · Премиум мини‑игры
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm leading-relaxed text-white/55">
                      30–60 секунд. Чистая геометрия. Стекло и металл. Плавные
                      переходы.
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-full border border-white/14 bg-white/5 p-3 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                      aria-label="Закрыть"
                    >
                      <CloseIcon />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="px-7 pb-7 sm:px-8 sm:pb-8">
                  <div className="h-px w-full chrome-line opacity-40" />

                  <Tabs.Root defaultValue="shade" className="mt-6">
                    <Tabs.List className="flex flex-wrap gap-2">
                      {[
                        { v: 'shade', t: 'Найди оттенок' },
                        { v: 'lines', t: 'Собери композицию' },
                        { v: 'react', t: 'Реакция' },
                      ].map((tab) => (
                        <Tabs.Trigger
                          key={tab.v}
                          value={tab.v}
                          className="rounded-full border border-white/14 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all duration-500 ease-in-out hover:border-white/22 hover:bg-white/7 hover:text-white/88 data-[state=active]:border-[rgba(66,229,255,0.42)] data-[state=active]:bg-white/8 data-[state=active]:text-white/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                        >
                          <span className="font-display tracking-tight">
                            {tab.t}
                          </span>
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>

                    <div className="mt-5">
                      <Tabs.Content value="shade" className="focus:outline-none">
                        <FindShadeGame />
                      </Tabs.Content>
                      <Tabs.Content value="lines" className="focus:outline-none">
                        <ComposeLinesGame />
                      </Tabs.Content>
                      <Tabs.Content value="react" className="focus:outline-none">
                        <ReactionGame />
                      </Tabs.Content>
                    </div>
                  </Tabs.Root>
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

