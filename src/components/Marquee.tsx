const ITEMS = [
  'ROS / ROS2',
  'Deep Reinforcement Learning',
  'Computer Vision',
  'YOLO',
  'OpenCV',
  'Path Planning',
  'SLAM',
  'Embedded C/C++',
  'ESP32',
  'PyTorch',
  'TensorFlow',
  'PCB Design',
  'Kinematics',
  'IoT',
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative flex overflow-hidden border-y border-line bg-obsidian py-5 select-none">
      <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl font-semibold text-faint transition-colors hover:text-ink md:text-3xl">
              {item}
            </span>
            <span className="text-lime" aria-hidden>
              ◇
            </span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-obsidian to-transparent" />
    </div>
  );
}
