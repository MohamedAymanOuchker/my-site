import { Suspense, useRef, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { scrollToId } from '../lib/useLenis';

// Code-split the 3D scene (Three.js + fiber + drei) into its own chunk so the
// initial bundle stays small; it loads after first paint behind the Suspense fallback.
const Scene = lazy(() => import('./Scene').then((m) => ({ default: m.Scene })));

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax: scene drifts slower, copy lifts and fades as you scroll away.
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] w-full overflow-hidden bg-void">
      {/* 3D scene layer (drop-in point for a scrubbed cinematic clip later) */}
      <motion.div style={{ y: sceneY }} className="absolute inset-0">
        <Suspense fallback={<div className="h-full w-full bg-void" />}>
          <Scene />
        </Suspense>
      </motion.div>

      {/* Cinematic vignettes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_40%,#07080A_100%)]" />

      {/* Corner HUD ticks */}
      <HudCorners />

      {/* Foreground copy */}
      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-wide flex-col justify-center px-5 md:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-12 bg-lime" />
          <span className="font-mono text-[11px] uppercase tracking-mono text-lime">
            PhD Researcher · Robotics × AI
          </span>
        </motion.div>

        <h1 className="mt-6 max-w-5xl font-display text-[16vw] font-bold leading-[0.86] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-[8.5rem]">
          {['Ouchker', 'Med Ayman'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
        >
          I build AI systems that make machines move, decide and adapt — from autonomous
          UAV navigation and ROS stacks to embedded AI that ships.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => scrollToId('#work')}
            className="group flex items-center gap-3 bg-lime px-6 py-3.5 font-mono text-[12px] uppercase tracking-mono text-void transition-transform hover:-translate-y-0.5"
          >
            View Work
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => scrollToId('#contact')}
            className="border border-line px-6 py-3.5 font-mono text-[12px] uppercase tracking-mono text-ink transition-colors hover:border-lime hover:text-lime"
          >
            Get in touch
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-line">
          <span className="mt-2 h-2 w-0.5 rounded-full bg-lime animate-scroll-hint" />
        </div>
      </div>
    </section>
  );
}

function HudCorners() {
  const cls = 'absolute h-5 w-5 border-lime/40';
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
      <span className={`${cls} left-8 top-20 border-l border-t`} />
      <span className={`${cls} right-8 top-20 border-r border-t`} />
      <span className={`${cls} bottom-8 left-8 border-b border-l`} />
      <span className={`${cls} bottom-8 right-8 border-b border-r`} />
    </div>
  );
}
