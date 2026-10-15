type IntroOptions = { intro: boolean; onIntro: () => void };

/** A bounded, scroll-linked illustration; no timer runs after its entrance. */
export function startHeroMotion(figure: HTMLElement, options: IntroOptions) {
  const hero = figure.closest<HTMLElement>('.video-hero');
  const roll = figure.querySelector<SVGElement>('.hero-roll-motion');
  const stock = figure.querySelector<SVGElement>('.hero-ribbon-stock');
  const edge = figure.querySelector<SVGElement>('.hero-ribbon-edge');
  const label = figure.querySelector<SVGElement>('.hero-label-peel');
  const endPrint = figure.querySelector<SVGElement>('.hero-ribbon-end');
  const shadow = figure.querySelector<SVGElement>('.hero-roll-shadow');
  if (!hero || !roll || !stock || !edge || !label || !endPrint || !shadow || !('IntersectionObserver' in window)) return () => {};

  const originals = [
    { element: roll, name: 'transform' }, { element: stock, name: 'd' },
    { element: edge, name: 'd' }, { element: label, name: 'transform' },
    { element: endPrint, name: 'transform' }, { element: shadow, name: 'transform' },
  ].map(item => ({ ...item, value: item.element.getAttribute(item.name) }));
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer: IntersectionObserver | null = null;
  let frame = 0;
  let disposed = false;
  let intersecting = false;
  let running = false;
  let introComplete = !options.intro;
  let introStarted = false;
  let introStart = 0;
  let limits = { duration: 0, span: 0, drift: 0, turn: 0, unwind: 0, peel: 0, entry: 0 };
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const number = (n: number) => Number(n.toFixed(3));

  function restore() {
    for (const item of originals) {
      if (item.value === null) item.element.removeAttribute(item.name);
      else item.element.setAttribute(item.name, item.value);
    }
    figure.dataset.sceneMotion = 'static';
    delete figure.dataset.sceneProgress;
    delete figure.dataset.scenePhase;
  }

  function draw(now: number) {
    frame = 0;
    if (!running || disposed) return;
    if (!introStarted && !introComplete) {
      introStarted = true;
      introStart = now;
      options.onIntro();
    }
    const elapsed = limits.duration > 0 ? clamp((now - introStart) / limits.duration) : 1;
    const entrance = introComplete ? 1 : 1 - Math.pow(1 - elapsed, 3);
    if (elapsed === 1) introComplete = true;
    const bounds = hero!.getBoundingClientRect();
    const progress = clamp(-bounds.top / Math.max(bounds.height * limits.span, 1));
    const unwind = number(limits.unwind * (progress - (1 - entrance) * .65));
    const drop = number(unwind * .25);
    const peel = clamp((progress - .12) / .7);
    const turn = number(limits.turn * (progress - (1 - entrance) * .9));
    const lift = number(-limits.drift * progress + limits.entry * (1 - entrance));

    roll!.setAttribute('transform', `translate(${number(-progress * limits.drift * .3)} ${lift}) rotate(${turn} 368 276)`);
    stock!.setAttribute('d', `M200 338C221 397 266 417 328 430L${number(642 + unwind)} ${number(505 + drop)}L${number(532 + unwind)} ${number(577 + drop)}L237 501C170 484 157 454 170 417L200 338Z`);
    edge!.setAttribute('d', `M200 345C219 412 259 434 322 447L${number(634 + unwind)} ${number(516 + drop)}L${number(532 + unwind)} ${number(589 + drop)}L233 512C164 495 152 463 166 426L200 345Z`);
    label!.setAttribute('transform', `translate(${number(unwind * .45)} ${number(drop * .45 - limits.peel * peel)}) rotate(${number(-peel * limits.turn * .65)} 440 477)`);
    endPrint!.setAttribute('transform', `translate(${unwind} ${drop})`);
    shadow!.setAttribute('transform', `translate(0 ${number(progress * limits.drift * .15)})`);
    figure.dataset.sceneMotion = 'active';
    figure.dataset.sceneProgress = String(number(progress));
    figure.dataset.scenePhase = introComplete ? 'scroll' : 'entrance';
    if (!introComplete) frame = window.requestAnimationFrame(draw);
  }

  function queue() {
    if (running && !frame && !disposed) frame = window.requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    window.removeEventListener('scroll', queue);
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    // Returning to the scene never replays an interrupted entrance.
    if (introStarted) introComplete = true;
  }

  function syncVisibility() {
    const shouldRun = intersecting && !document.hidden && !preference.matches;
    if (!shouldRun) {
      stop();
      if (!preference.matches) figure.dataset.sceneMotion = 'suspended';
    } else if (!running) {
      running = true;
      window.addEventListener('scroll', queue, { passive: true });
      queue();
    }
  }

  function configure() {
    stop();
    observer?.disconnect();
    observer = null;
    intersecting = false;
    restore();
    if (preference.matches || disposed) return;
    const style = getComputedStyle(figure);
    const token = (name: string) => Number.parseFloat(style.getPropertyValue(name)) || 0;
    const factor = token('--hero-scene-factor');
    limits = {
      duration: token('--hero-scene-duration'), span: token('--hero-scene-scroll-span'),
      drift: token('--hero-scene-drift') * factor, turn: token('--hero-scene-turn') * factor,
      unwind: token('--hero-scene-unwind') * factor, peel: token('--hero-scene-peel') * factor,
      entry: token('--hero-scene-entry') * factor,
    };
    const nextObserver = new IntersectionObserver(entries => {
      if (disposed || observer !== nextObserver) return;
      intersecting = entries.some(entry => entry.isIntersecting);
      syncVisibility();
    }, { threshold: 0 });
    observer = nextObserver;
    observer.observe(figure);
  }

  preference.addEventListener('change', configure);
  document.addEventListener('visibilitychange', syncVisibility);
  window.addEventListener('resize', configure, { passive: true });
  configure();
  return () => {
    disposed = true;
    stop();
    observer?.disconnect();
    preference.removeEventListener('change', configure);
    document.removeEventListener('visibilitychange', syncVisibility);
    window.removeEventListener('resize', configure);
    restore();
  };
}
