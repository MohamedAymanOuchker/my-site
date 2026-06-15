import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
}

interface ProjectCardProps extends Project {
  index: number;
  featured?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  index,
  featured = false,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`group relative flex flex-col overflow-hidden border border-line bg-surface transition-colors duration-300 hover:border-lime/40 ${
        featured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden bg-obsidian ${
          featured ? 'aspect-[16/10] lg:aspect-auto lg:w-1/2' : 'aspect-[16/10]'
        }`}
      >
        {/* duotone tint unifies the mismatched source images */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
        <div className="absolute inset-0 z-10 bg-lime/5 mix-blend-overlay" />
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-90 grayscale-[35%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
        <span className="absolute left-4 top-4 z-20 font-mono text-[11px] tracking-mono text-lime">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className={`flex flex-1 flex-col p-7 md:p-8 ${featured ? 'lg:justify-center' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <h3
            className={`font-display font-semibold text-ink transition-colors group-hover:text-lime ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {title}
          </h3>
          <ArrowUpRight
            className="mt-1 h-5 w-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
            strokeWidth={1.5}
          />
        </div>
        <p
          className={`mt-3 leading-relaxed text-muted ${
            featured ? 'max-w-md text-[15px]' : 'text-sm'
          }`}
        >
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-mono text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
