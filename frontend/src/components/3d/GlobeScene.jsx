import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Stars } from '@react-three/drei';

function Orb() {
  const orbRef = useRef();

  // Slowly rotate the orb
  useFrame((state, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.1;
      orbRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
      {/* Positioned behind text, slightly to the right */}
      <mesh ref={orbRef} position={[2, 0, -2]} scale={2.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color="#f59e0b" // SMD Gold
          emissive="#2d1b00" 
          envMapIntensity={1} 
          clearcoat={0.8} 
          clearcoatRoughness={0} 
          metalness={0.8} 
          roughness={0.2} 
          distort={0.4} 
          speed={2} 
          transparent={true}
          opacity={0.7} // Semi-transparent so it's a soft glowing orb
        />
      </mesh>
    </Float>
  );
}

export default function GlobeScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        {/* Soft lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#f59e0b" />
        
        {/* Soft background stars to complement the orb */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <Orb />
        
        {/* Environment map for reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
