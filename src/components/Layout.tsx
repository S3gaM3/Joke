import { type PropsWithChildren, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Layout({ children }: PropsWithChildren) {
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [backToTopVisible, setBackToTopVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 0)
      setBackToTopVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-dvh">
      {/* Navbar - Poseify style */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 transition-all duration-300 lg:px-12 ${
          navScrolled ? 'bg-[#0D0D0D] shadow-lg' : 'bg-transparent'
        }`}
      >
        <Link to="/" className="font-display text-xl font-bold uppercase tracking-wide text-[var(--bs-primary)]">
          AVA
        </Link>

        <button
          type="button"
          className="rounded p-2 text-white lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Меню"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div
          className={`absolute left-0 right-0 top-full mt-0 flex flex-col gap-4 bg-[#0D0D0D] px-6 py-4 lg:static lg:mt-0 lg:flex-row lg:items-center lg:gap-0 lg:bg-transparent lg:px-0 lg:py-0 ${
            mobileMenuOpen ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <Link
            to="/#about"
            className="font-display text-sm font-semibold uppercase tracking-wider text-white transition hover:text-[var(--bs-primary)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            О нас
          </Link>
          <Link
            to="/#games"
            className="ml-0 font-display text-sm font-semibold uppercase tracking-wider text-white transition hover:text-[var(--bs-primary)] lg:ml-8"
            onClick={() => setMobileMenuOpen(false)}
          >
            Игры
          </Link>
          <Link
            to="/"
            className="btn btn-outline-primary mt-2 border-2 lg:mt-0 lg:ml-8"
            onClick={() => setMobileMenuOpen(false)}
          >
            На главную
          </Link>
        </div>
      </nav>

      <main className="pt-16">{children}</main>

      {/* Footer - Poseify */}
      <footer className="bg-[var(--bs-dark)] py-12">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <Link to="/" className="font-display mb-4 inline-block text-2xl font-bold uppercase tracking-wide text-white">
            AVA
          </Link>
          <p className="mb-2 text-white/70">© AVA · Premium dark UI · 2026</p>
          <p className="text-sm text-white/50">Александра · Влада · Анна</p>
        </div>
      </footer>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`back-to-top ${backToTopVisible ? 'visible' : ''}`}
        aria-label="Наверх"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  )
}
