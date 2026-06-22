import { ChevronDown } from 'lucide-react';

interface ShowMoreButtonProps {
  expanded: boolean;
  onToggle: () => void;
  collapsedLabel: string;
  expandedLabel: string;
}

export function ShowMoreButton({
  expanded,
  onToggle,
  collapsedLabel,
  expandedLabel,
}: ShowMoreButtonProps) {
  return (
    <div className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="group inline-flex items-center gap-2 border border-line px-6 py-3 font-mono text-[11px] uppercase tracking-mono text-muted transition-colors hover:border-lime/40 hover:text-lime focus-visible:border-lime/60 focus-visible:outline-none"
      >
        {expanded ? expandedLabel : collapsedLabel}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
