import { AnimatePresence, motion } from 'framer-motion'

type PreloaderProps = {
  visible: boolean
}

export function Preloader({ visible }: PreloaderProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[var(--bs-dark)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="poseify-spinner" role="status" aria-label="Загрузка" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
