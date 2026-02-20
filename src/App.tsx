import { useEffect, useState } from 'react'
import { Background } from './components/Background'
import { Preloader } from './components/Preloader'
import { useComplimentNotifications } from './features/compliments/useComplimentNotifications'
import { NotificationCenterProvider } from './features/notifications/NotificationCenterProvider'
import { useLockBodyScroll } from './lib/useLockBodyScroll'
import { Landing } from './screens/Landing'

export default function App() {
  const [loading, setLoading] = useState(true)

  useLockBodyScroll(loading)

  return (
    <NotificationCenterProvider>
      <AppInner loading={loading} setLoading={setLoading} />
    </NotificationCenterProvider>
  )
}

function AppInner({
  loading,
  setLoading,
}: {
  loading: boolean
  setLoading: (v: boolean) => void
}) {
  useComplimentNotifications(true)

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
  }, [setLoading])

  return (
    <>
      <Background />
      <Landing />
      <Preloader visible={loading} />
    </>
  )
}
