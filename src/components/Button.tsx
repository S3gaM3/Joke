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
    'group relative inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-[15px] font-semibold tracking-tight transition-all duration-300 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent-rgb)/0.35)] disabled:pointer-events-none disabled:opacity-55'

  const styles =
    variant === 'glass'
      ? 'border border-white/10 bg-white/8 text-white/88 hover:bg-white/10'
      : 'border border-transparent bg-[rgb(var(--accent-rgb))] text-white hover:brightness-[1.05] shadow-[0_10px_30px_rgba(0,0,0,0.45)]'

  return (
    <button
      ref={ref}
      className={clsx(base, styles, className)}
      {...props}
    >
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 ease-out',
          'group-hover:opacity-100',
        )}
        style={{
          background:
            variant === 'glass'
              ? 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))'
              : 'radial-gradient(520px 160px at 30% 0%, rgba(255,255,255,0.20), transparent 55%)',
        }}
      />
      {props.children}
    </button>
  )
})

