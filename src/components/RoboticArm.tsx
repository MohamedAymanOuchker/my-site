import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export function RoboticArm() {
  const baseRef = useRef<Group>(null);
  const shoulderRef = useRef<Group>(null);
  const upperArmRef = useRef<Group>(null);
  const forearmRef = useRef<Group>(null);
  const wristRef = useRef<Group>(null);
  const clawBaseRef = useRef<Group>(null);
  const clawLeftRef = useRef<Mesh>(null);
  const clawRightRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Smooth robotic movements
    if (baseRef.current) {
      baseRef.current.rotation.y = Math.sin(t * 0.2) * 0.5;
    }

    if (shoulderRef.current) {
      shoulderRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 - 0.2;
    }

    if (upperArmRef.current) {
      upperArmRef.current.rotation.x = Math.sin(t * 0.3) * 0.15 - 0.3;
    }

    if (forearmRef.current) {
      forearmRef.current.rotation.x = Math.sin(t * 0.3) * 0.25;
    }

    if (wristRef.current) {
      wristRef.current.rotation.z = Math.sin(t * 0.4) * 0.2;
      wristRef.current.rotation.y = Math.sin(t * 0.3) * 0.3;
    }

    if (clawBaseRef.current) {
      clawBaseRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    }

    // Claw opening and closing animation
    if (clawLeftRef.current && clawRightRef.current) {
      const clawAngle = (Math.sin(t * 2) + 1) * 0.2;
      clawLeftRef.current.rotation.y = clawAngle;
      clawRightRef.current.rotation.y = -clawAngle;
    }
  });

  return (
    <group position={[-4, -2, 0]} scale={1.2}>
      {/* Base with rotating platform */}
      <group ref={baseRef}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[1.2, 1.5, 0.5, 32]} />
          <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Shoulder joint */}
        <group ref={shoulderRef} position={[0, 0.7, 0]}>
          <mesh>
            <boxGeometry args={[1, 0.8, 0.8]} />
            <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Upper arm */}
          <group ref={upperArmRef} position={[0, 0, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.4, 2.4, 0.4]} />
              <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Hydraulic detail */}
            <mesh position={[0.3, 1, 0.3]} rotation={[0, 0, Math.PI * 0.1]}>
              <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
              <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Elbow joint */}
            <group position={[0, 2.4, 0]}>
              <mesh>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.2} />
              </mesh>

              {/* Forearm */}
              <group ref={forearmRef}>
                <mesh position={[0, 1, 0]}>
                  <boxGeometry args={[0.35, 2, 0.35]} />
                  <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
                </mesh>

                {/* Wrist */}
                <group ref={wristRef} position={[0, 2, 0]}>
                  <mesh>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.2} />
                  </mesh>

                  {/* Claw base */}
                  <group ref={clawBaseRef} position={[0, 0.4, 0]}>
                    <mesh>
                      <boxGeometry args={[0.4, 0.3, 0.8]} />
                      <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* Claw parts */}
                    <group position={[0, 0, 0.4]}>
                      {/* Left claw */}
                      <mesh ref={clawLeftRef} position={[0.15, 0, 0]}>
                        <boxGeometry args={[0.1, 0.2, 0.6]} />
                        <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
                        <mesh position={[0, 0, 0.25]}>
                          <boxGeometry args={[0.05, 0.15, 0.2]} />
                          <meshStandardMaterial color="#93c5fd" metalness={0.8} roughness={0.2} />
                        </mesh>
                      </mesh>

                      {/* Right claw */}
                      <mesh ref={clawRightRef} position={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.1, 0.2, 0.6]} />
                        <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
                        <mesh position={[0, 0, 0.25]}>
                          <boxGeometry args={[0.05, 0.15, 0.2]} />
                          <meshStandardMaterial color="#93c5fd" metalness={0.8} roughness={0.2} />
                        </mesh>
                      </mesh>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}