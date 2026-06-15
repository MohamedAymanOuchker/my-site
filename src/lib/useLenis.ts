import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initializes Lenis smooth scrolling and drives it from a single rAF loop.
 * Respects prefers-reduced-motion by skipping smoothing entirely.
 * Exposes window.__lenis for anchor links to use scrollTo.
 */
export function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // expose for nav anchor scrolling
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
}

/** Smooth-scroll to a selector, falling back to native when Lenis is off. */
export function scrollToId(id: string) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const el = document.querySelector(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
