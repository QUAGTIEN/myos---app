'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const revealSelector = '[data-reveal]';

export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | null = null;
    const pending = new Set<HTMLElement>();
    let frame = 0;

    const elements = () => Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    function stopWatching() {
      observer?.disconnect();
      observer = null;
      pending.clear();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      root.removeEventListener('focusin', handleFocus);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function showEverything() {
      stopWatching();
      delete root.dataset.motion;
      elements().forEach(element => { element.dataset.revealState = 'visible'; });
    }

    function reveal(element: HTMLElement) {
      element.dataset.revealState = 'visible';
      pending.delete(element);
      observer?.unobserve(element);
      if (!pending.size) stopWatching();
    }

    function revealPassedContent() {
      frame = 0;
      // Fast scrolling can cross a region between observer deliveries. Anything
      // already passed must stay readable when returning or using the keyboard.
      const edge = window.innerHeight * 1.2;
      for (const element of pending) {
        if (!element.getClientRects().length || element.getBoundingClientRect().top <= edge) reveal(element);
      }
    }

    function handleScroll() {
      if (!frame) frame = window.requestAnimationFrame(revealPassedContent);
    }

    function handleFocus(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      for (const element of pending) if (element.contains(event.target)) reveal(element);
    }

    function enableMotion() {
      stopWatching();

      const targets = elements();
      if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        showEverything();
        return;
      }

      const observable = targets.filter(element => {
        if (element.getClientRects().length) return true;
        element.dataset.revealState = 'visible';
        return false;
      });
      observable.forEach(element => { element.dataset.revealState = 'pending'; pending.add(element); });
      root.dataset.motion = 'enabled';
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          reveal(element);
        });
      }, { rootMargin: '20% 0px 20% 0px', threshold: 0 });
      observable.forEach(element => observer?.observe(element));
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
      root.addEventListener('focusin', handleFocus);
      handleScroll();
    }

    enableMotion();
    const handlePreference = () => reducedMotion.matches ? showEverything() : enableMotion();
    reducedMotion.addEventListener('change', handlePreference);

    return () => {
      stopWatching();
      reducedMotion.removeEventListener('change', handlePreference);
      delete root.dataset.motion;
    };
  }, [pathname]);

  return null;
}
