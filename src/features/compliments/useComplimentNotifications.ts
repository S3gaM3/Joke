import { useEffect, useRef } from 'react'
import { sample } from '../../lib/random'
import { COMPLIMENTS } from './compliments'
import { useNotificationCenter } from '../notifications/notificationCenter'

function randDelayMs(minMs: number, maxMs: number) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

export function useComplimentNotifications(enabled = true) {
  const { push } = useNotificationCenter()
  const timeoutRef = useRef<number | null>(null)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const schedule = (first = false) => {
      const delay = first
        ? randDelayMs(12_000, 26_000)
        : randDelayMs(35_000, 180_000) // <= 3 minutes

      timeoutRef.current = window.setTimeout(() => {
        if (!enabledRef.current) return

        const body = sample(COMPLIMENTS)
        push({ title: 'Уведомление', body })

        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            try {
              // Some browsers may ignore this; still safe.
              new Notification('AVA', { body, silent: true })
            } catch {
              // ignore
            }
          }
        }

        schedule(false)
      }, delay)
    }

    schedule(true)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [enabled, push])
}

