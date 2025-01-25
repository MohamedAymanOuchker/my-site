import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export function FloatingComponents() {
  const group = useRef<Group>(null);
  const chip1 = useRef<Mesh>(null);
  const chip2 = useRef<Mesh>(null);
  const sphere = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y = t * 0.1;
    }

    if (chip1.current) {
      chip1.current.position.y = Math.sin(t) * 0.5;
      chip1.current.rotation.z = t * 0.5;
    }

    if (chip2.current) {
      chip2.current.position.y = Math.sin(t + Math.PI) * 0.5;
      chip2.current.rotation.z = -t * 0.5;
    }

    if (sphere.current) {
      sphere.current.position.y = Math.cos(t * 0.5) * 0.3;
      sphere.current.rotation.y = t * 0.2;
    }

    if (ring.current) {
      ring.current.rotation.z = t * 0.3;
      ring.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={group}>
      {/* Circuit Board Chip 1 */}
      <mesh ref={chip1} position={[4, 0, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.8} roughness={0.2} />
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.9} roughness={0.1} />
        </mesh>
      </mesh>

      {/* Circuit Board Chip 2 */}
      <mesh ref={chip2} position={[-4, 0, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.8} roughness={0.2} />
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.9} roughness={0.1} />
        </mesh>
      </mesh>

      {/* Floating Sphere */}
      <mesh ref={sphere} position={[0, 3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.05, 16, 100]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.2} />
        </mesh>
      </mesh>

      {/* Orbital Ring */}
      <mesh ref={ring} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.1, 16, 100]} />
        <meshStandardMaterial color="#93c5fd" metalness={0.7} roughness={0.2} opacity={0.6} transparent />
      </mesh>
    </group>
  );
}