export function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function sample<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(
    16,
  )}`
}

