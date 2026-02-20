import { Navigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { FindShadeGame } from '../games/find-shade/FindShadeGame'
import { ComposeLinesGame } from '../games/lines/ComposeLinesGame'
import { ReactionGame } from '../games/reaction/ReactionGame'
import { LaunchControlGame } from '../games/launch-control/LaunchControlGame'
import { ShiftPointsGame } from '../games/shift/ShiftPointsGame'
import { ParkingSensorGame } from '../games/parking/ParkingSensorGame'
import { HudMemoryGame } from '../games/hud-memory/HudMemoryGame'
import { ApexLineGame } from '../games/apex/ApexLineGame'
import { AmbientLightGame } from '../games/ambient/AmbientLightGame'
import { CarbonAlignGame } from '../games/carbon/CarbonAlignGame'
import { DriftAngleGame } from '../games/drift/DriftAngleGame'

const GAME_MAP: Record<string, { title: string; Component: () => JSX.Element }> = {
  launch: { title: 'Launch Control', Component: LaunchControlGame },
  shift: { title: 'Shift Points', Component: ShiftPointsGame },
  park: { title: 'Parking Sensor', Component: ParkingSensorGame },
  hud: { title: 'HUD Memory', Component: HudMemoryGame },
  shade: { title: 'Найди оттенок', Component: FindShadeGame },
  lines: { title: 'Собери композицию', Component: ComposeLinesGame },
  react: { title: 'Реакция', Component: ReactionGame },
  ambient: { title: 'Ambient Light', Component: AmbientLightGame },
  apex: { title: 'Apex Line', Component: ApexLineGame },
  drift: { title: 'Drift Angle', Component: DriftAngleGame },
  carbon: { title: 'Carbon Align', Component: CarbonAlignGame },
}

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>()
  const entry = gameId ? GAME_MAP[gameId] : null

  if (!entry) {
    return <Navigate to="/" replace />
  }

  const { Component } = entry

  return (
    <Layout>
      <section className="flex min-h-[calc(100dvh-4rem)] flex-col bg-[var(--bs-secondary)]">
        <Component />
      </section>
    </Layout>
  )
}
