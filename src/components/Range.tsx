import { type InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type RangeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  valueLabel?: string
}

export function Range({ label, valueLabel, className, ...props }: RangeProps) {
  return (
    <label className={clsx('block', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="text-xs tracking-[0.25em] text-white/45">{label}</div>
        {valueLabel ? (
          <div className="font-display text-xs tracking-[0.22em] text-white/55">
            {valueLabel}
          </div>
        ) : null}
      </div>
      <input
        {...props}
        type="range"
        className="mt-3 h-9 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none"
        style={{
          WebkitTapHighlightColor: 'transparent',
        }}
      />
    </label>
  )
}

