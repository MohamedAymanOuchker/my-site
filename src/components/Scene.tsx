import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { RoboticArm } from './RoboticArm';
import { Robot } from './Robot';

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <color attach="background" args={['#111827']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
      <RoboticArm />
      <Robot />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}