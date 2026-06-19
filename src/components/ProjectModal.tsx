import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Github, Star, GitFork, Eye, CircleDot, History, Scale } from 'lucide-react';
import type { Project } from './ProjectCard';
import { useGitHubRepo, type RepoStats, type LanguageSlice } from '../lib/useGitHubRepo';
import { langColor } from '../lib/languageColors';

const EASE = [0.22, 1, 0.36, 1] as const;

interface LenisLike {
  stop: () => void;
  start: () => void;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function timeAgo(iso?: string): string {
  if (!iso) return '—';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  const y = Math.floor(days / 365);
  return `${y}yr${y > 1 ? 's' : ''} ago`;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border border-line bg-void/40 px-3 py-2.5">
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-mono text-faint">
        {icon}
        {label}
      </span>
      <span className="font-display text-lg font-semibold text-ink">{value}</span>
    </div>
  );
}

function LiveRepoPanel({ stats, languages }: { stats: RepoStats; languages: LanguageSlice[] }) {
  const top = languages.slice(0, 6);
  const shown = top.reduce((s, l) => s + l.pct, 0);
  const other = Math.max(0, 100 - shown);

  return (
    <div className="mt-8 border-t border-line pt-6">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-mono text-lime">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime" />
        Live from GitHub
      </span>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat icon={<Star className="h-3 w-3" />} label="Stars" value={compact(stats.stars)} />
        <Stat icon={<GitFork className="h-3 w-3" />} label="Forks" value={compact(stats.forks)} />
        <Stat icon={<Eye className="h-3 w-3" />} label="Watching" value={compact(stats.watchers)} />
        <Stat icon={<CircleDot className="h-3 w-3" />} label="Issues" value={compact(stats.openIssues)} />
        <Stat icon={<History className="h-3 w-3" />} label="Last push" value={timeAgo(stats.pushedAt)} />
        <Stat icon={<Scale className="h-3 w-3" />} label="License" value={stats.license ?? 'None'} />
      </div>

      {languages.length > 0 && (
        <div className="mt-5">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-void">
            {top.map((l) => (
              <span
                key={l.name}
                title={`${l.name} ${l.pct.toFixed(1)}%`}
                style={{ width: `${l.pct}%`, backgroundColor: langColor(l.name) }}
              />
            ))}
            {other > 0 && <span style={{ width: `${other}%`, backgroundColor: '#5C615E' }} />}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {top.map((l) => (
              <span key={l.name} className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: langColor(l.name) }}
                />
                {l.name}
                <span className="text-faint">{l.pct.toFixed(1)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="mt-8 animate-pulse border-t border-line pt-6">
      <div className="h-3 w-32 bg-surface-2" />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 border border-line bg-void/40" />
        ))}
      </div>
      <div className="mt-5 h-2 w-full rounded-full bg-surface-2" />
    </div>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { stats, languages, loading, error } = useGitHubRepo(project?.repoUrl);

  // Lock page scroll (and pause Lenis) while open; close on Escape.
  useEffect(() => {
    if (!project) return;

    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden border border-line bg-surface"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              autoFocus
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center border border-line bg-void/60 text-muted backdrop-blur transition-colors hover:border-lime/40 hover:text-lime"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* `min-h-0` lets this flex child shrink so it can scroll; */}
            {/* `data-lenis-prevent` stops Lenis from swallowing the wheel events */}
            <div className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
              {/* hero visual */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-obsidian">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
                <div className="absolute inset-0 z-10 bg-lime/5 mix-blend-overlay" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover opacity-90"
                />
              </div>

              <div className="p-7 md:p-9">
                <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{project.description}</p>

                {/* gallery */}
                {project.gallery && project.gallery.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {project.gallery.map((src) => (
                      <div
                        key={src}
                        className="aspect-video overflow-hidden border border-line bg-obsidian"
                      >
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* tech stack */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-mono text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* live GitHub intelligence */}
                {project.repoUrl && loading && <PanelSkeleton />}
                {project.repoUrl && !loading && !error && stats && (
                  <LiveRepoPanel stats={stats} languages={languages} />
                )}

                {/* actions */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-lime/40 bg-lime/10 px-4 py-2.5 font-mono text-xs uppercase tracking-mono text-lime transition-colors hover:bg-lime/20"
                    >
                      <Github className="h-4 w-4" strokeWidth={1.5} />
                      View Repository
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-xs uppercase tracking-mono text-faint">
                      Source not public
                    </span>
                  )}
                  {(project.liveUrl ?? stats?.homepage) && (
                    <a
                      href={project.liveUrl ?? stats?.homepage ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-xs uppercase tracking-mono text-muted transition-colors hover:border-lime/40 hover:text-lime"
                    >
                      Live Demo
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
