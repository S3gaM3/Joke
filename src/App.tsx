import { useEffect, useState } from 'react'
import { Background } from './components/Background'
import { Preloader } from './components/Preloader'
import { useLockBodyScroll } from './lib/useLockBodyScroll'
import { Landing } from './screens/Landing'

export default function App() {
  const [loading, setLoading] = useState(true)

  useLockBodyScroll(loading)

  useEffect(() => {
    let cancelled = false
    const min = new Promise<void>((r) => {
      window.setTimeout(() => r(), 900)
    })
    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.all([min, fonts]).then(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Background />
      <Landing />
      <Preloader visible={loading} />
    </>
  )
}
