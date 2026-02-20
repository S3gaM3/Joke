import { motion, useInView } from 'framer-motion'
import { type PropsWithChildren, useRef } from 'react'
import { DUR, EASE_OUT } from '../lib/motion'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

type RevealProps = PropsWithChildren<{
  delay?: number
}>

export function Reveal({ children, delay = 0 }: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.25, once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
      animate={
        reduced
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : inView
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : undefined
      }
      transition={{ duration: DUR.base, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

