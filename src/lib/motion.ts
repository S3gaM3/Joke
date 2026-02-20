export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1]

export const DUR = {
  fast: 0.32,
  base: 0.45,
  slow: 0.6,
} as const

export function revealFromDark(delay = 0) {
  return {
    initial: { opacity: 0, y: 22, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: DUR.slow, ease: EASE_OUT, delay },
  } as const
}

