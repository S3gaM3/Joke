import { createContext, useContext } from 'react'

export type AppNotification = {
  id: string
  title: string
  body: string
}

export type NotificationCenterApi = {
  push: (n: Omit<AppNotification, 'id'>) => void
}

export const NotificationCtx = createContext<NotificationCenterApi | null>(null)

export function useNotificationCenter() {
  const ctx = useContext(NotificationCtx)
  if (!ctx) throw new Error('NotificationCenter missing')
  return ctx
}

export function makeNotificationId() {
  return `n_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

