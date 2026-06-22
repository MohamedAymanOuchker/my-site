import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  image?: string;
  tags: string[];
}

interface BlogCardProps extends BlogPost {
  index: number;
  featured?: boolean;
  onSelect?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function BlogCard({
  title,
  excerpt,
  date,
  image,
  tags,
  index,
  featured = false,
  onSelect,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: EASE }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden border border-line bg-surface transition-colors duration-300 hover:border-lime/40 focus-visible:border-lime/60 focus-visible:outline-none ${
        featured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      {image && (
        <div
          className={`relative overflow-hidden bg-obsidian ${
            featured ? 'aspect-[16/10] lg:aspect-auto lg:w-1/2' : 'aspect-[16/10]'
          }`}
        >
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
      )}

      <div className={`flex flex-1 flex-col p-7 md:p-8 ${featured ? 'lg:justify-center' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-mono text-lime">{date}</span>
            <h3
              className={`font-display font-semibold text-ink transition-colors group-hover:text-lime ${
                featured ? 'text-2xl md:text-3xl' : 'text-xl'
              }`}
            >
              {title}
            </h3>
          </div>
          <ArrowUpRight
            className="mt-1 h-5 w-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
            strokeWidth={1.5}
          />
        </div>
        <p
          className={`mt-4 leading-relaxed text-muted ${
            featured ? 'max-w-md text-[15px]' : 'text-sm'
          }`}
        >
          {excerpt}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-mono text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
