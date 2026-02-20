import { type ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'glass'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', ...props },
  ref,
) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium tracking-wide transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-60'

  const styles =
    variant === 'glass'
      ? 'border border-white/14 bg-white/5 text-white/80 hover:bg-white/7 hover:border-white/22'
      : 'border border-white/16 bg-white/8 text-white/85 hover:border-[rgba(66,229,255,0.45)] hover:bg-white/10'

  return (
    <button
      ref={ref}
      className={clsx(base, styles, 'hover:-translate-y-0.5', className)}
      {...props}
    >
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 ease-in-out',
          'group-hover:opacity-100',
        )}
        style={{
          background:
            variant === 'glass'
              ? 'radial-gradient(420px 120px at 30% 0%, rgba(255,255,255,0.14), transparent 55%)'
              : 'radial-gradient(520px 160px at 30% 0%, rgba(var(--accent-rgb) / 0.20), transparent 55%), radial-gradient(520px 160px at 75% 0%, rgba(var(--accent2-rgb) / 0.16), transparent 55%)',
        }}
      />
      {props.children}
    </button>
  )
})

