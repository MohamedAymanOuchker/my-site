import { scrollToId } from '../lib/useLenis';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-void">
      <div className="mx-auto flex max-w-wide flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <button
          onClick={() => scrollToId('#top')}
          className="text-left font-display text-xl font-semibold text-ink transition-colors hover:text-lime"
        >
          Ouchker Med Ayman
        </button>
        <p className="font-mono text-[11px] uppercase tracking-mono text-faint">
          © {year} · Robotics &amp; AI Engineer · Built with React
        </p>
      </div>
    </footer>
  );
}
