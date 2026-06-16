import { Reveal } from './Reveal';

const STATS = [
  { value: '10+', label: 'Projects shipped' },
  { value: 'PhD', label: 'Researcher @ USMBA' },
  { value: '98%', label: 'Vision accuracy' },
  { value: '4DOF', label: 'Arm built' },
];

export function About() {
  return (
    <section id="about" className="relative border-b border-line bg-void py-28 md:py-36">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-wide px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] tracking-mono text-lime">01</span>
                <span className="h-px w-10 bg-lime/50" />
                <span className="font-mono text-[11px] uppercase tracking-mono text-muted">
                  About
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-8 font-display text-3xl font-semibold leading-[1.12] text-ink md:text-[2.7rem] text-balance">
                I build AI systems that make machines <span className="text-lime">move, decide
                and adapt</span> — without human intervention.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
                As a PhD researcher at USMBA and a Robotics &amp; AI engineer from Euromed
                University of Fes, I specialize in autonomous navigation, embedded AI and
                real-world control systems. My research focuses on adaptive planning for drones
                in complex, dynamic environments — and I've shipped 10+ projects, from an
                ESP32-based educational robot to a fuel-level calculation unit for aircraft
                systems. My approach: if it can't run in production, it doesn't count.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-px self-start border border-line bg-line">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="bg-void">
                <div className="flex h-full flex-col justify-between gap-6 p-7 md:p-8">
                  <span className="font-mono text-[10px] uppercase tracking-mono text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="font-display text-4xl font-bold text-ink md:text-5xl">
                      {s.value}
                    </div>
                    <div className="mt-1 text-sm text-muted">{s.label}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
