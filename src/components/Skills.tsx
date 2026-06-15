import { Terminal, Brain, Bot, Cpu, ScanEye, CircuitBoard } from 'lucide-react';
import { Reveal, SectionHeading } from './Reveal';

const SKILLS = [
  {
    icon: Terminal,
    name: 'Core Development',
    details: 'Python, C/C++, Java, MATLAB — algorithm development and implementation.',
  },
  {
    icon: Brain,
    name: 'AI · ML / DL',
    details: 'Machine learning, deep reinforcement learning, neural networks, data processing.',
  },
  {
    icon: Bot,
    name: 'Robotics',
    details: 'ROS, path planning, mechanical design and kinematics, system integration.',
  },
  {
    icon: Cpu,
    name: 'Embedded Systems',
    details: 'Microcontrollers, sensor integration and calibration, PLC, IoT connectivity.',
  },
  {
    icon: ScanEye,
    name: 'Computer Vision',
    details: 'OpenCV, YOLO, image processing, object detection and recognition.',
  },
  {
    icon: CircuitBoard,
    name: 'Hardware Design',
    details: 'PCB design, electronic integration, 3D modeling and CAD, robotic prototyping.',
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative border-b border-line bg-obsidian py-28 md:py-36">
      <div className="mx-auto max-w-wide px-5 md:px-10">
        <SectionHeading
          index="02"
          kicker="Expertise"
          title="A full-stack robotics toolkit"
          description="From the silicon to the algorithm to the interface — the disciplines I combine to make machines work."
        />

        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.name} delay={(i % 3) * 0.08} className="bg-obsidian">
                <div className="group relative flex h-full flex-col gap-6 p-8 transition-colors duration-300 hover:bg-surface md:p-10">
                  <span className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r border-t border-lime opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center border border-line text-lime transition-colors duration-300 group-hover:border-lime/60">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-[11px] tracking-mono text-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{s.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{s.details}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
