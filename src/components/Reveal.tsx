import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Single scroll-triggered reveal with a refined ease-out curve. */
export function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: ReactNode;
  description?: string;
}

/** Mono index + label, large display title — the recurring section header. */
export function SectionHeading({ index, kicker, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-mono text-lime">{index}</span>
          <span className="h-px w-10 bg-lime/50" />
          <span className="font-mono text-[11px] uppercase tracking-mono text-muted">
            {kicker}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.02] text-ink md:text-6xl text-balance">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
