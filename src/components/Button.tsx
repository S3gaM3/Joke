import { type ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'glass'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', ...props },
  ref,
) {
  const base = 'btn transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bs-primary)]/50 disabled:pointer-events-none disabled:opacity-55'

  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline-primary',
    glass: 'btn-outline-primary border-2 bg-white/5 hover:bg-white/10',
  }

  return (
    <button
      ref={ref}
      className={clsx(base, variants[variant], className)}
      {...props}
    />
  )
})
