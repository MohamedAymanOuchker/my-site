import { Reveal } from './Reveal';

const STATS = [
  { value: '9+', label: 'Projects shipped' },
  { value: '6', label: 'Domains' },
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
                I build robots that <span className="text-lime">see, think and move</span> —
                bridging mechanical design, embedded systems and machine learning into systems
                that work in the real world.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
                My work spans autonomous agricultural robots, educational robotics platforms,
                real-time computer-vision pipelines and model-based aerospace systems. I care
                about the full stack of a machine — from the PCB and the path-planning algorithm
                to the interface a person actually touches.
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
