export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--bs-dark) 0%, var(--bs-secondary) 50%, var(--bs-dark) 100%)',
        }}
      />
    </div>
  )
}
