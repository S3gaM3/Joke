import { motion } from 'framer-motion'

export function Landing() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div
            className="grid size-10 place-items-center rounded-2xl border"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
              borderColor: 'rgba(255,255,255,0.16)',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.08), 0 18px 55px rgba(0,0,0,0.65)',
            }}
            aria-hidden
          >
            <span className="font-display text-sm tracking-[0.35em] text-white/80">
              AVA
            </span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-[0.22em] text-white/85">
              PREMIUM GIFT
            </div>
            <div className="text-xs tracking-wide text-white/50">
              Александра · Влада · Анна
            </div>
          </div>
        </div>

        <a
          className="neon-underline rounded-full px-3 py-2 text-sm text-white/70 transition-all duration-500 ease-in-out hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          href="#surprise"
        >
          Сюрприз
        </a>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden p-10 sm:p-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(800px 420px at 25% 0%, rgba(177, 140, 255, 0.18), transparent 60%), radial-gradient(650px 360px at 90% 20%, rgba(66, 229, 255, 0.14), transparent 55%)',
            }}
          />

          <div className="relative">
            <div className="font-display text-xs font-semibold tracking-[0.38em] text-white/55">
              ULTRA MODERN · DARK · CHROME · GLASS
            </div>
            <h1 className="font-display mt-5 text-balance text-4xl font-bold tracking-[-0.02em] text-white/92 sm:text-6xl">
              Три имени. Один безупречный стиль.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/68 sm:text-lg">
              Этот сайт — маленькая, но премиальная витрина уважения к вашему
              вкусу: строгая геометрия, дорогие материалы и сдержанная динамика.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
                { name: 'Александра', code: 'A', glow: 'var(--glow-violet)' },
                { name: 'Влада', code: 'V', glow: 'var(--glow-cyan)' },
                { name: 'Анна', code: 'A', glow: 'var(--glow-violet)' },
              ].map((p) => (
                <div
                  key={p.name}
                  className="group glass rounded-[18px] p-6 transition-all duration-500 ease-in-out hover:-translate-y-1"
                  style={{ boxShadow: p.glow }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-xl font-semibold tracking-tight text-white/90">
                        {p.name}
                      </div>
                      <div className="mt-1 text-xs tracking-[0.25em] text-white/45">
                        DESIGN BRAND
                      </div>
                    </div>
                    <div className="grid size-10 place-items-center rounded-2xl border border-white/15 bg-white/5">
                      <span className="font-display text-sm tracking-[0.35em] text-white/75">
                        {p.code}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 h-px w-full chrome-line opacity-40 transition-opacity duration-500 ease-in-out group-hover:opacity-70" />
                  <p className="mt-5 text-sm leading-relaxed text-white/60">
                    Минимализм, воздух и точность. Всё ровно, как вы любите.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <section id="surprise" className="mt-10">
          <div className="glass p-8 sm:p-10">
            <div className="font-display text-xl font-semibold tracking-tight text-white/90">
              Сюрприз
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              Здесь будут три мини‑игры в той же эстетике. Следующий шаг —
              собрать полноценный раздел с «стеклом», неоном и идеальными
              анимациями.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

