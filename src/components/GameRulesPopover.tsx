import { useState } from 'react'

type GameRulesPopoverProps = {
  title: string
  children: React.ReactNode
}

export function GameRulesPopover({ title, children }: GameRulesPopoverProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        aria-label="Правила игры"
        aria-expanded={open}
      >
        Правила
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
          />
          <div
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-white/15 bg-[var(--bs-dark)] p-4 shadow-xl"
            role="dialog"
            aria-label={title}
          >
            <div className="text-xs font-semibold tracking-wider text-white/60">
              {title}
            </div>
            <div className="mt-2 text-sm leading-relaxed text-white/80">
              {children}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 text-xs text-[var(--bs-primary)]"
            >
              Закрыть
            </button>
          </div>
        </>
      )}
    </div>
  )
}
