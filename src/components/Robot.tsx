import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export function Robot() {
  const robotRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Mesh>(null);
  const rightLegRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (robotRef.current) {
      robotRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }

    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }

    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 0.8) * 0.1;
      rightArmRef.current.rotation.x = Math.sin(t * 0.8 + Math.PI) * 0.1;
    }

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t * 0.8) * 0.05;
      rightLegRef.current.rotation.x = Math.sin(t * 0.8 + Math.PI) * 0.05;
    }
  });

  return (
    <group ref={robotRef} position={[4, -1, 0]} rotation={[0, -Math.PI / 4, 0]} scale={0.8}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.8]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
        {/* Chest Details */}
        <mesh position={[0, 0.2, 0.41]}>
          <boxGeometry args={[0.8, 0.4, 0.01]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
        </mesh>
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 2.8, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.2, 0, 0.41]}>
          <boxGeometry args={[0.1, 0.1, 0.01]} />
          <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.2, 0, 0.41]}>
          <boxGeometry args={[0.1, 0.1, 0.01]} />
          <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[0.8, 2, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Left Hand */}
        <mesh position={[0, -1.4, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[-0.8, 2, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Right Hand */}
        <mesh position={[0, -1.4, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[0.3, 0.5, 0]}>
        <mesh position={[0, -0.75, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Left Foot */}
        <mesh position={[0, -1.6, 0.1]}>
          <boxGeometry args={[0.4, 0.3, 0.5]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[-0.3, 0.5, 0]}>
        <mesh position={[0, -0.75, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Right Foot */}
        <mesh position={[0, -1.6, 0.1]}>
          <boxGeometry args={[0.4, 0.3, 0.5]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}