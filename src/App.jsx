import { Suspense, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import { Koru } from './components/Koru.jsx'
import { SessionLedger, useSessionLedger } from './components/SessionLedger.jsx'

export default function App() {
  const [activeProtocol, setActiveProtocol] = useState('breathe')
  const { entries, recordSession } = useSessionLedger()
  const handleBreathCycleComplete = useCallback(() => {
    recordSession('breathing-cycle')
  }, [recordSession])

  return (
    <main className="app-shell">
      <section className="hero-copy" aria-label="Koru grounding companion">
        <p className="eyebrow">Somatic grounding companion</p>
        <h1>Meet Koru</h1>
        <p className="hero-copy__intro">
          Breathe with Koru's slow 4-7-8 rhythm. Press or hover over him to
          invite a gentle lateral head tilt for co-regulation.
        </p>

        <section className="protocol-menu" aria-labelledby="protocol-menu-heading">
          <div className="protocol-menu__header">
            <p className="protocol-menu__label" id="protocol-menu-heading">
              Sanctuary Protocols
            </p>
            <div className="protocol-tabs" role="tablist" aria-label="Sanctuary Protocols">
              <button
                className={`protocol-tab${activeProtocol === 'breathe' ? ' protocol-tab--active' : ''}`}
                id="protocol-tab-breathe"
                type="button"
                role="tab"
                aria-selected={activeProtocol === 'breathe'}
                aria-controls="protocol-panel-breathe"
                onClick={() => setActiveProtocol('breathe')}
              >
                Breathe
              </button>
              <button
                className={`protocol-tab${activeProtocol === 'history' ? ' protocol-tab--active' : ''}`}
                id="protocol-tab-history"
                type="button"
                role="tab"
                aria-selected={activeProtocol === 'history'}
                aria-controls="protocol-panel-history"
                onClick={() => setActiveProtocol('history')}
              >
                History
              </button>
            </div>
          </div>

          {activeProtocol === 'breathe' ? (
            <div
              className="protocol-panel"
              id="protocol-panel-breathe"
              role="tabpanel"
              aria-labelledby="protocol-tab-breathe"
            >
              <p>
                Stay with one full inhale, hold, and exhale. When the cycle completes,
                Koru saves a private timestamp as evidence that grounding happened.
              </p>
            </div>
          ) : (
            <div
              className="protocol-panel"
              id="protocol-panel-history"
              role="tabpanel"
              aria-labelledby="protocol-tab-history"
            >
              <SessionLedger entries={entries} />
            </div>
          )}
        </section>
      </section>

      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 1.15, 4.25], fov: 38 }}
          shadows
          dpr={[1, 2]}
        >
          <color attach="background" args={['#10151f']} />
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#008080" />
          <Suspense fallback={null}>
            <Center>
              <Koru
                rotation={[0, -0.18, 0]}
                scale={2.2}
                onBreathCycleComplete={handleBreathCycleComplete}
              />
            </Center>
            <Environment preset="city" environmentIntensity={0.24} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.8}
            maxPolarAngle={Math.PI / 1.75}
          />
        </Canvas>
      </div>
    </main>
  )
}
