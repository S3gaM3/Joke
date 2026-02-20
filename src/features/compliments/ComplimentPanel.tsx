import { useState } from 'react'
import { Button } from '../../components/Button'
import { ResultPlaque } from '../surprise/ResultPlaque'
import { sample } from '../../lib/random'

const COMPLIMENTS = [
  'У вас безупречный вкус, леди!',
  'Глаз — алмаз! Вы видите красоту в деталях.',
  'Идеальное решение. Как и всё, что вы делаете.',
  'Точно. Чисто. Дорого. Именно так и надо.',
  'Вы умеете держать стиль — без лишних слов.',
  'Сдержанная динамика и абсолютная точность. Браво.',
] as const

export function ComplimentPanel() {
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <div className="glass rounded-[18px] p-7">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="font-display text-lg font-semibold tracking-tight text-white/90">
            Комплимент‑модуль
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
            Мини‑деталь, которая делает интерфейс живым: одно нажатие — и
            появляется «табличка» с теплым премиальным сообщением.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs tracking-[0.25em] text-white/40">PLAQUE</div>
          <div className="font-display mt-1 text-sm tracking-tight text-white/70">
            GLASS MESSAGE
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button onClick={() => setMsg(sample(COMPLIMENTS))}>
          Сгенерировать
        </Button>
        <Button variant="glass" onClick={() => setMsg(null)} disabled={!msg}>
          Скрыть
        </Button>
        <div className="ml-auto text-xs tracking-[0.22em] text-white/40">
          MICRO‑INTERACTION
        </div>
      </div>

      <ResultPlaque
        tone="success"
        title="Сигнал признания"
        message={msg ?? ''}
        visible={Boolean(msg)}
        onClose={() => setMsg(null)}
      />
    </div>
  )
}

