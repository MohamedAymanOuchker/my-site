import { useEffect, useState } from 'react';
import { scrollToId } from '../lib/useLenis';

const LINKS = [
  { id: '#about', label: 'About' },
  { id: '#skills', label: 'Expertise' },
  { id: '#work', label: 'Work' },
  { id: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'border-b border-line bg-void/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-wide items-center justify-between px-5 md:px-10">
        <a
          href="#top"
          onClick={go('#top')}
          className="group flex items-center gap-3"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center border border-lime/60 font-mono text-sm text-lime transition-colors group-hover:bg-lime group-hover:text-void">
            OA
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-mono text-muted sm:block">
            Ouchker · Robotics&nbsp;/&nbsp;AI
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.id}
              onClick={go(l.id)}
              className="font-mono text-[12px] uppercase tracking-mono text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          onClick={go('#contact')}
          className="flex items-center gap-2 border border-lime/50 px-4 py-2 font-mono text-[11px] uppercase tracking-mono text-lime transition-colors hover:bg-lime hover:text-void"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime animate-pulse-dot" aria-hidden />
          Available
        </a>
      </nav>
    </header>
  );
}
