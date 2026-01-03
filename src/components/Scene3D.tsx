"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";

function FloatingOrb({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <FloatingOrb position={[-3, 2, -2]} color="#10b981" scale={1.2} />
        <FloatingOrb position={[3, -1, -3]} color="#3b82f6" scale={0.8} />
        <FloatingOrb position={[0, -2, -1]} color="#8b5cf6" scale={1} />
        <FloatingOrb position={[-2, -1, -4]} color="#f59e0b" scale={0.6} />
        <FloatingOrb position={[2, 2, -5]} color="#ec4899" scale={0.9} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Suspense>
    </Canvas>
  );
}
