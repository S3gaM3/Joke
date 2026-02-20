import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { DUR, EASE_OUT } from '../../lib/motion'
import { FindShadeGame } from '../../games/find-shade/FindShadeGame'
import { ComposeLinesGame } from '../../games/lines/ComposeLinesGame'
import { ReactionGame } from '../../games/reaction/ReactionGame'
import { LaunchControlGame } from '../../games/launch-control/LaunchControlGame'
import { ShiftPointsGame } from '../../games/shift/ShiftPointsGame'
import { ParkingSensorGame } from '../../games/parking/ParkingSensorGame'
import { HudMemoryGame } from '../../games/hud-memory/HudMemoryGame'
import { ApexLineGame } from '../../games/apex/ApexLineGame'
import { AmbientLightGame } from '../../games/ambient/AmbientLightGame'
import { CarbonAlignGame } from '../../games/carbon/CarbonAlignGame'
import { DriftAngleGame } from '../../games/drift/DriftAngleGame'

type SurpriseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tab?:
    | 'shade'
    | 'lines'
    | 'react'
    | 'launch'
    | 'shift'
    | 'park'
    | 'hud'
    | 'apex'
    | 'ambient'
    | 'carbon'
    | 'drift'
  onTabChange?: (
    tab:
      | 'shade'
      | 'lines'
      | 'react'
      | 'launch'
      | 'shift'
      | 'park'
      | 'hud'
      | 'apex'
      | 'ambient'
      | 'carbon'
      | 'drift',
  ) => void
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

export function SurpriseDialog({
  open,
  onOpenChange,
  tab,
  onTabChange,
}: SurpriseDialogProps) {
  type TabKey =
    | 'shade'
    | 'lines'
    | 'react'
    | 'launch'
    | 'shift'
    | 'park'
    | 'hud'
    | 'apex'
    | 'ambient'
    | 'carbon'
    | 'drift'

  const tabsRootProps =
    tab && onTabChange
      ? {
          value: tab,
          onValueChange: (v: string) => onTabChange(v as TabKey),
        }
      : { defaultValue: 'shade' as const }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed bottom-4 left-1/2 z-50 w-[min(980px,96vw)] -translate-x-1/2 focus:outline-none"
          aria-label="Сюрприз: мини-игры"
        >
          <motion.div
            className="glass-strong max-h-[88dvh] overflow-hidden rounded-[28px]"
            initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          >
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(900px 460px at 25% 0%, rgba(var(--accent2-rgb) / 0.12), transparent 60%), radial-gradient(760px 420px at 90% 10%, rgba(var(--accent-rgb) / 0.10), transparent 58%)',
                }}
              />

              <div className="relative max-h-[86dvh] overflow-y-auto overscroll-contain">
                <div className="relative flex justify-center pt-3">
                  <div
                    aria-hidden
                    className="h-[5px] w-14 rounded-full bg-white/20"
                  />
                </div>
                <div className="relative flex items-start justify-between gap-6 px-7 py-6 sm:px-8">
                  <div>
                    <Dialog.Title className="font-display text-xl font-semibold tracking-tight text-white/92">
                      Сюрприз · Премиум мини‑игры
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm leading-relaxed text-white/55">
                      30–60 секунд. Чистая система. Мягкие материалы. Плавные
                      переходы — как в iOS.
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

                  <Tabs.Root {...tabsRootProps} className="mt-6">
                    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
                      <Tabs.List className="flex gap-2 overflow-x-auto pb-2 lg:block lg:overflow-visible lg:pb-0">
                        {(
                          [
                            { v: 'launch', t: 'Launch Control' },
                            { v: 'shift', t: 'Shift Points' },
                            { v: 'park', t: 'Parking Sensor' },
                            { v: 'hud', t: 'HUD Memory' },
                            { v: 'react', t: 'Реакция' },
                            { v: 'lines', t: 'Собери композицию' },
                            { v: 'shade', t: 'Найди оттенок' },
                            { v: 'ambient', t: 'Ambient Light' },
                            { v: 'apex', t: 'Apex Line' },
                            { v: 'drift', t: 'Drift Angle' },
                            { v: 'carbon', t: 'Carbon Align' },
                          ] as const
                        ).map((it) => (
                          <Tabs.Trigger
                            key={it.v}
                            value={it.v}
                            className="dash-panel-sm shrink-0 rounded-[16px] border border-white/12 bg-white/4 px-4 py-3 text-left text-sm text-white/70 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/6 hover:text-white/88 data-[state=active]:border-[rgba(var(--accent2-rgb)/0.50)] data-[state=active]:bg-white/7 data-[state=active]:text-white/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 lg:mb-2 lg:w-full"
                          >
                            <div className="font-display tracking-tight">
                              {it.t}
                            </div>
                            <div className="mt-1 text-[11px] tracking-[0.25em] text-white/40">
                              MODE
                            </div>
                          </Tabs.Trigger>
                        ))}
                      </Tabs.List>

                      <div className="min-w-0">
                        <Tabs.Content value="launch" className="focus:outline-none">
                          <LaunchControlGame />
                        </Tabs.Content>
                        <Tabs.Content value="shift" className="focus:outline-none">
                          <ShiftPointsGame />
                        </Tabs.Content>
                        <Tabs.Content value="park" className="focus:outline-none">
                          <ParkingSensorGame />
                        </Tabs.Content>
                        <Tabs.Content value="hud" className="focus:outline-none">
                          <HudMemoryGame />
                        </Tabs.Content>
                        <Tabs.Content value="react" className="focus:outline-none">
                          <ReactionGame />
                        </Tabs.Content>
                        <Tabs.Content value="lines" className="focus:outline-none">
                          <ComposeLinesGame />
                        </Tabs.Content>
                        <Tabs.Content value="shade" className="focus:outline-none">
                          <FindShadeGame />
                        </Tabs.Content>
                        <Tabs.Content value="ambient" className="focus:outline-none">
                          <AmbientLightGame />
                        </Tabs.Content>
                        <Tabs.Content value="apex" className="focus:outline-none">
                          <ApexLineGame />
                        </Tabs.Content>
                        <Tabs.Content value="drift" className="focus:outline-none">
                          <DriftAngleGame />
                        </Tabs.Content>
                        <Tabs.Content value="carbon" className="focus:outline-none">
                          <CarbonAlignGame />
                        </Tabs.Content>
                      </div>
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

