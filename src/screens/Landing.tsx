import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { SurpriseDialog } from '../features/surprise/SurpriseDialog'
import { EASE_OUT } from '../lib/motion'

export function Landing() {
  const [surpriseOpen, setSurpriseOpen] = useState(false)

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

        <button
          type="button"
          onClick={() => setSurpriseOpen(true)}
          className="neon-underline rounded-full px-3 py-2 text-sm text-white/70 transition-all duration-500 ease-in-out hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          Сюрприз
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
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

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={() => setSurpriseOpen(true)}>
                Открыть сюрприз
              </Button>
              <a
                href="#collab"
                className="neon-underline rounded-full px-5 py-3 text-sm text-white/70 transition-all duration-500 ease-in-out hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                Коллаборация
              </a>
            </div>

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

        <section className="mt-14">
          <Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  t: 'Геометрия',
                  d: 'Строгие формы и точные пропорции. Никаких лишних деталей.',
                },
                {
                  t: 'Материал',
                  d: 'Стекло, металл, мокрый асфальт. Визуальная тактильность.',
                },
                {
                  t: 'Динамика',
                  d: 'Плавные переходы и «тяжесть» интерфейса как в премиум‑авто.',
                },
              ].map((f) => (
                <div
                  key={f.t}
                  className="glass rounded-[18px] p-7 transition-all duration-500 ease-in-out hover:-translate-y-1"
                >
                  <div className="font-display text-lg font-semibold tracking-tight text-white/88">
                    {f.t}
                  </div>
                  <div className="mt-3 h-px w-full chrome-line opacity-35" />
                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    {f.d}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="collab" className="mt-14">
          <Reveal>
            <div className="glass relative overflow-hidden p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-55"
                style={{
                  background:
                    'radial-gradient(900px 460px at 30% 0%, rgba(66,229,255,0.10), transparent 60%), radial-gradient(700px 420px at 90% 25%, rgba(177,140,255,0.12), transparent 55%)',
                }}
              />
              <div className="relative">
                <div className="font-display text-2xl font-semibold tracking-tight text-white/90">
                  Коллаборация AVA
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
                  Три самостоятельных бренда в одном пространстве: каждый со
                  своим оттенком, но с общей премиальной системой.
                </p>

                <div className="mt-8 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                  {[
                    { n: 'Александра', c: 'A', glow: 'var(--glow-violet)' },
                    { n: 'Влада', c: 'V', glow: 'var(--glow-cyan)' },
                    { n: 'Анна', c: 'A', glow: 'var(--glow-violet)' },
                  ].map((p, idx) => (
                    <div key={p.n} className="contents">
                      <div
                        className="glass rounded-[18px] p-6 transition-all duration-500 ease-in-out hover:-translate-y-1"
                        style={{ boxShadow: p.glow }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-display text-lg font-semibold text-white/88">
                              {p.n}
                            </div>
                            <div className="mt-1 text-xs tracking-[0.25em] text-white/45">
                              SIGNATURE
                            </div>
                          </div>
                          <div className="grid size-11 place-items-center rounded-2xl border border-white/14 bg-white/5">
                            <span className="font-display text-sm tracking-[0.38em] text-white/75">
                              {p.c}
                            </span>
                          </div>
                        </div>
                      </div>

                      {idx < 2 ? (
                        <div
                          aria-hidden
                          className="hidden h-px w-10 chrome-line opacity-45 sm:block"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="surprise" className="mt-14">
          <Reveal>
            <div className="glass p-8 sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="font-display text-2xl font-semibold tracking-tight text-white/90">
                    Сюрприз · Игры
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                    Три мини‑игры на 30–60 секунд — не про «скилл», а про
                    удовольствие от взаимодействия.
                  </p>
                </div>
                  <Button
                    variant="glass"
                    onClick={() => setSurpriseOpen(true)}
                  >
                    Открыть панель
                  </Button>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {[
                  { t: 'Найди оттенок', d: 'Премиальное колесо выбора — как регулятор в авто.' },
                  { t: 'Собери композицию', d: 'Поймай линии по таймингу и собери вензель.' },
                  { t: 'Реакция', d: 'Клик‑тест: иконки появляются и исчезают всё быстрее.' },
                ].map((g) => (
                  <div
                    key={g.t}
                    className="glass rounded-[18px] p-7 transition-all duration-500 ease-in-out hover:-translate-y-1"
                  >
                    <div className="font-display text-lg font-semibold tracking-tight text-white/88">
                      {g.t}
                    </div>
                    <div className="mt-3 h-px w-full chrome-line opacity-35" />
                    <p className="mt-4 text-sm leading-relaxed text-white/60">
                      {g.d}
                    </p>
                    <div className="mt-6 text-xs tracking-[0.22em] text-white/40">
                      PREMIUM MINI GAME
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mt-14 pb-2">
          <div className="text-xs tracking-wide text-white/35">
            AVA · Premium dark UI · 2026
          </div>
        </footer>
      </main>

      <SurpriseDialog open={surpriseOpen} onOpenChange={setSurpriseOpen} />
    </div>
  )
}

