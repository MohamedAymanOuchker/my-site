import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { RoboticArm } from './RoboticArm';
import { Robot } from './Robot';

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }} dpr={[1, 2]}>
      <color attach="background" args={['#07080A']} />
      <Stars radius={100} depth={50} count={2600} factor={3} saturation={0} fade speed={0.6} />
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={1.6} color="#CDF564" />
      <pointLight position={[-10, -6, -6]} intensity={0.9} color="#7da0ff" />
      <pointLight position={[0, -8, 4]} intensity={0.5} color="#ffffff" />
      <RoboticArm />
      <Robot />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}