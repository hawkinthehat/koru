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
          orthographic
          camera={{ position: [0, 0, 6], zoom: 120, near: 0.1, far: 100 }}
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
              <Koru scale={2.2} />
            </Center>
            <Environment preset="city" environmentIntensity={0.24} />
          </Suspense>
          <OrbitControls
            enabled={false}
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            minPolarAngle={Math.PI / 2.8}
            maxPolarAngle={Math.PI / 1.75}
          />
        </Canvas>
      </div>
    </main>
  )
}
