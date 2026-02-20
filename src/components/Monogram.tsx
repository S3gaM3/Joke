import { motion } from 'framer-motion'
import { DUR, EASE_IN_OUT } from '../lib/motion'

type MonogramProps = {
  size?: number
}

export function Monogram({ size = 120 }: MonogramProps) {
  return (
    <div
      className="grid place-items-center rounded-[26px] border border-white/12 bg-white/5"
      style={{
        width: size,
        height: size,
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.06), 0 28px 85px rgba(0,0,0,0.72)',
      }}
      aria-hidden
    >
      <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 120 120">
        <defs>
          <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="0.45" stopColor="rgba(var(--accent-rgb) / 0.95)" />
            <stop offset="1" stopColor="rgba(var(--accent2-rgb) / 0.9)" />
          </linearGradient>
          <filter id="mg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M16 92 L36 28 L56 92"
          fill="none"
          stroke="url(#m)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mg)"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{ duration: DUR.slow, ease: EASE_IN_OUT }}
        />
        <motion.path
          d="M50 92 L70 28 L90 92"
          fill="none"
          stroke="url(#m)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mg)"
          initial={{ pathLength: 0, opacity: 0.25 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: DUR.slow, ease: EASE_IN_OUT, delay: 0.08 }}
        />
        <motion.path
          d="M28 62 L78 62"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#mg)"
          initial={{ pathLength: 0, opacity: 0.15 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: DUR.base, ease: EASE_IN_OUT, delay: 0.22 }}
        />
      </svg>
    </div>
  )
}

