import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import { Koru } from './components/Koru.jsx'

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-copy" aria-label="Koru grounding companion">
        <p className="eyebrow">Somatic grounding companion</p>
        <h1>Meet Koru</h1>
        <p>
          Breathe with Koru's slow 4-7-8 rhythm. Press or hover over him to
          invite a gentle lateral head tilt for co-regulation.
        </p>
      </section>

      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 1.15, 4.25], fov: 38 }}
          shadows
          dpr={[1, 2]}
        >
          <color attach="background" args={['#10151f']} />
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[3.5, 4.5, 2.5]}
            intensity={2.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Suspense fallback={null}>
            <Center>
              <Koru rotation={[0, -0.18, 0]} scale={2.2} />
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
