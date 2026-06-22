import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { BlogPost } from './BlogCard';

const EASE = [0.22, 1, 0.36, 1] as const;

interface LenisLike {
  stop: () => void;
  start: () => void;
}

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export function BlogModal({ post, onClose }: BlogModalProps) {
  useEffect(() => {
    if (!post) return;

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
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
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
            aria-label={post.title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden border border-line bg-surface"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              autoFocus
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center border border-line bg-void/60 text-muted backdrop-blur transition-colors hover:border-lime/40 hover:text-lime"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <div className="min-h-0 flex-1 overflow-y-auto bg-void" data-lenis-prevent>
              {post.image && (
                <div className="relative aspect-[21/9] w-full overflow-hidden bg-obsidian">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-void via-void/40 to-transparent" />
                  <div className="absolute inset-0 z-10 bg-lime/5 mix-blend-overlay" />
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>
              )}

              <div className={`mx-auto max-w-3xl px-6 pb-20 pt-10 md:px-12 ${!post.image && 'pt-20'}`}>
                <div className="mb-10 text-center">
                  <span className="mb-4 block font-mono text-[11px] uppercase tracking-mono text-lime">
                    {post.date}
                  </span>
                  <h1 className="font-display text-3xl font-bold text-ink md:text-4xl lg:text-5xl text-balance">
                    {post.title}
                  </h1>
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-mono text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="prose prose-invert prose-lime mx-auto max-w-none prose-headings:font-display prose-a:text-lime hover:prose-a:text-lime/80 prose-img:rounded-lg prose-hr:border-line">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
