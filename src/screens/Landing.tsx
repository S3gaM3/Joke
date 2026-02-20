import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { Monogram } from '../components/Monogram'
import { Reveal } from '../components/Reveal'
import { Layout } from '../components/Layout'

type GameId =
  | 'shade'
  | 'lines'
  | 'react'
  | 'launch'
  | 'shift'
  | 'park'
  | 'hud'
  | 'apex'
  | 'ambient'
  | 'carbon'
  | 'drift'

// Картинки: picsum.photos — бесплатные фото из открытых источников, seed для стабильности
const PICSUM = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`

const GAMES: { id: GameId; title: string; desc: string; image: string }[] = [
  { id: 'launch', title: 'Launch Control', desc: 'Поймай GO без фальстарта. Точный старт — это характер.', image: PICSUM('launch-race') },
  { id: 'shift', title: 'Shift Points', desc: 'Переключай строго в зелёном окне RPM.', image: PICSUM('shift-gear') },
  { id: 'park', title: 'Parking Sensor', desc: 'Остановись в зоне 15–25cm. Парковка ювелирная.', image: PICSUM('parking-car') },
  { id: 'hud', title: 'HUD Memory', desc: 'Повтори последовательность световых сегментов.', image: PICSUM('hud-dashboard') },
  { id: 'shade', title: 'Найди оттенок', desc: 'Премиальное колесо выбора — как регулятор в авто.', image: PICSUM('shade-color') },
  { id: 'lines', title: 'Собери композицию', desc: 'Поймай линии по таймингу и собери вензель.', image: PICSUM('lines-art') },
  { id: 'react', title: 'Реакция', desc: 'Клик‑тест: иконки появляются и исчезают всё быстрее.', image: PICSUM('react-speed') },
  { id: 'ambient', title: 'Ambient Light', desc: 'Настройка подсветки: оттенок + яркость.', image: PICSUM('ambient-light') },
  { id: 'apex', title: 'Apex Line', desc: 'Траектория по точкам: возьми апекс спокойно и точно.', image: PICSUM('apex-track') },
  { id: 'drift', title: 'Drift Angle', desc: 'Держи угол в окне ±3°. Управление как в панели.', image: PICSUM('drift-angle') },
  { id: 'carbon', title: 'Carbon Align', desc: 'Подгони текстуру карбона до идеального совпадения.', image: PICSUM('carbon-fiber') },
]

export function Landing() {
  const navigate = useNavigate()
  return (
    <Layout>
      {/* Hero - Poseify carousel style */}
      <header className="relative min-h-[100dvh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), radial-gradient(ellipse at 30% 20%, rgba(228,23,121,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(26,26,26,0.9) 0%, transparent 50%), linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
          }}
        />
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="poseify-title poseify-title-center mb-6"
          >
            <h5>Welcome</h5>
            <h1 className="text-4xl font-bold sm:text-6xl lg:text-7xl">AVA</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 max-w-2xl text-lg text-white/85"
          >
            Дорогие дамы, всё будет хорошо. Не грустите и не переживайте — вы сильные, вы со всем справитесь. Александра, Влада, Анна — этот подарок для вас.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="#games">
              <Button className="btn btn-outline-primary border-2 py-3 px-8">
                Смотреть игры
              </Button>
            </a>
          </motion.div>
        </div>
      </header>

      {/* About - Poseify bg-secondary */}
      <section id="about" className="bg-[var(--bs-secondary)]">
        <div className="container mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="poseify-title">
                <h5>History</h5>
                <h1>О коллаборации</h1>
              </div>
              <p className="mb-6 text-white/80">
                Три самостоятельных бренда в одном пространстве: каждый со своим оттенком, но общей силой и теплом. Помните: вы справитесь с любым поворотом. Чистая геометрия, мягкие материалы, много воздуха — и много уверенности впереди.
              </p>
              <ul className="mb-8 space-y-3">
                {['Геометрия и точные пропорции', 'Стекло, металл, мокрый асфальт', 'Плавные переходы как в премиум‑авто'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/85">
                    <span className="text-[var(--bs-primary)]">✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="#games">
                <Button className="btn btn-primary py-3 px-6">
                  Открыть игры
                </Button>
              </a>
            </Reveal>
            <Reveal>
              <div className="flex justify-center">
                <Monogram size={200} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services - Poseify alternating */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <div className="poseify-title poseify-title-center mx-auto">
              <h5>Services</h5>
              <h1>Мини‑игры</h1>
            </div>
          </div>

          {GAMES.slice(0, 4).map((g, i) => (
            <Reveal key={g.id}>
              <div
                className={`poseify-service flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:p-0 ${
                  i % 2 === 1 ? 'poseify-service-right lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 p-6 lg:p-12">
                  <h3 className="mb-4 font-display text-xl font-bold uppercase text-white">{g.title}</h3>
                  <p className="mb-6 text-white/80">{g.desc}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/games/${g.id}`)}
                    className="btn btn-outline-primary inline-flex border-2 px-4"
                  >
                    Играть <span aria-hidden>→</span>
                  </button>
                </div>
                <div className="flex flex-1 justify-center p-6">
                  <img
                    src={g.image}
                    alt=""
                    className="aspect-square w-48 flex-shrink-0 overflow-hidden rounded-full border-4 border-[var(--bs-primary)]/30 object-cover lg:w-64"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Banner - Poseify CTA */}
      <section className="bg-[var(--bs-secondary)] py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <div className="poseify-title poseify-title-center mx-auto mb-6">
              <h5>Игры</h5>
              <h1>Всё будет хорошо</h1>
            </div>
            <p className="mb-8 text-lg text-white/85">
              Не грустите, не переживайте — вы сильные. Десять мини‑режимов, чтобы отвлечься, поиграть и напомнить себе: вы со всем справитесь.
            </p>
            <a href="#games">
              <Button className="btn btn-primary py-4 px-10 text-lg">
                Выбрать игру
              </Button>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Games grid - Poseify team style */}
      <section id="games" className="py-16 lg:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <div className="poseify-title poseify-title-center mx-auto">
              <h5>Games</h5>
              <h1>Все игры</h1>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {GAMES.map((g) => (
              <Reveal key={g.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/games/${g.id}`)}
                  className="poseify-card group relative block w-full overflow-hidden rounded-none text-left transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bs-primary)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bs-dark)]">
                    <img
                      src={g.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
                  </div>
                  <div className="poseify-card-name">
                    <h5 className="mb-0 font-display text-base font-bold">{g.title}</h5>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                    <p className="text-center text-sm text-white/90">{g.desc}</p>
                    <span className="text-[var(--bs-primary)] font-semibold">Играть →</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
