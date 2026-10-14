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

    const elements = () => Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    function showEverything() {
      observer?.disconnect();
      observer = null;
      delete root.dataset.motion;
      elements().forEach(element => { element.dataset.revealState = 'visible'; });
    }

    function enableMotion() {
      observer?.disconnect();
      observer = null;

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
      observable.forEach(element => { element.dataset.revealState = 'pending'; });
      root.dataset.motion = 'enabled';
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.revealState = 'visible';
          observer?.unobserve(element);
        });
      }, { rootMargin: '20% 0px 20% 0px', threshold: 0 });
      observable.forEach(element => observer?.observe(element));
    }

    enableMotion();
    const handlePreference = () => reducedMotion.matches ? showEverything() : enableMotion();
    reducedMotion.addEventListener('change', handlePreference);

    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener('change', handlePreference);
      delete root.dataset.motion;
    };
  }, [pathname]);

  return null;
}
