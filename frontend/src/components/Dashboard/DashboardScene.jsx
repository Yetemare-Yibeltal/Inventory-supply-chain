import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  MeshDistortMaterial,
  Sphere
} from '@react-three/drei'

const InteractiveOrb = () => (
  <Float speed={4} rotationIntensity={1} floatIntensity={2}>
    <Sphere args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        color='#4f46e5'
        attach='material'
        distort={0.4}
        speed={2}
        roughness={0.2}
      />
    </Sphere>
  </Float>
)

const DashboardScene = () => {
  return (
    <div className='h-[400px] w-full rounded-2xl bg-zinc-900/40 border border-zinc-800/60 overflow-hidden'>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <InteractiveOrb />
          <Environment preset='city' />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  )
}

export default DashboardScene
