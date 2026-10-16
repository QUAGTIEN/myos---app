'use client';

import type { CSSProperties, PointerEvent } from 'react';
import { useEffect, useRef } from 'react';

type SceneStyle = CSSProperties & {
  '--scene-tilt-x'?: string;
  '--scene-tilt-y'?: string;
  '--layer-index'?: number;
};

const rollLayers = Array.from({ length: 13 }, (_, index) => index);
const sheetLayers = Array.from({ length: 5 }, (_, index) => index);

export function ProductDepthScene({ compact = false }: { compact?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const limitsRef = useRef({ tilt: 0, scroll: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    let visibility: IntersectionObserver | null = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      const bounds = stage.getBoundingClientRect();
      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      const range = limitsRef.current.scroll;
      const offset = Math.max(-range / 2, Math.min(range / 2, (progress - 0.5) * range));
      stage.style.setProperty('--scene-scroll-y', `${offset.toFixed(2)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    function stop() {
      visibility?.disconnect();
      visibility = null;
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      limitsRef.current = { tilt: 0, scroll: 0 };
      stage!.style.removeProperty('--scene-scroll-y');
      stage!.style.removeProperty('--scene-tilt-x');
      stage!.style.removeProperty('--scene-tilt-y');
    }

    function configure() {
      stop();
      if (reducedMotion.matches || mobile.matches || !('IntersectionObserver' in window)) return;
      const tokens = getComputedStyle(stage!);
      limitsRef.current = {
        tilt: parseFloat(tokens.getPropertyValue('--depth-tilt-max')) || 0,
        scroll: parseFloat(tokens.getPropertyValue('--motion-scroll-range')) || 0,
      };
      visibility = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting) {
          update();
          window.addEventListener('scroll', onScroll, { passive: true });
        } else {
          window.removeEventListener('scroll', onScroll);
          if (frame) window.cancelAnimationFrame(frame);
          frame = 0;
        }
      }, { rootMargin: '15% 0px' });
      visibility.observe(stage!);
    }

    configure();
    reducedMotion.addEventListener('change', configure);
    mobile.addEventListener('change', configure);
    return () => {
      stop();
      reducedMotion.removeEventListener('change', configure);
      mobile.removeEventListener('change', configure);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!limitsRef.current.tilt || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.style.setProperty('--scene-tilt-x', `${(-y * limitsRef.current.tilt).toFixed(2)}deg`);
    stage.style.setProperty('--scene-tilt-y', `${(x * limitsRef.current.tilt).toFixed(2)}deg`);
  }

  function resetTilt() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--scene-tilt-x', '0deg');
    stage.style.setProperty('--scene-tilt-y', '0deg');
  }

  return <figure className={`product-depth-scene${compact ? ' product-depth-scene-compact' : ''}`} data-reveal="scene" aria-label={compact ? 'Mô phỏng cuộn tem và các lớp vật liệu' : undefined} aria-labelledby={compact ? undefined : 'depth-scene-title'}>
    {compact ? <figcaption className="depth-scene-compact-caption">Tem cuộn / Tem tờ</figcaption> : <figcaption className="depth-scene-copy">
      <p className="depth-scene-eyebrow">CẤU TRÚC SẢN PHẨM</p>
      <h3 id="depth-scene-title">Từ lớp vật liệu đến cuộn tem hoàn thiện.</h3>
      <p>Vật liệu, bề mặt in và hình thức bàn giao được xem xét cùng nhau trước khi chốt phương án.</p>
    </figcaption>}
    <div
      ref={stageRef}
      className="depth-stage"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="depth-object">
        <div className="sheet-stack">
          {sheetLayers.map(index => <span key={index} className="sheet-layer" style={{ '--layer-index': index } as SceneStyle} />)}
          <span className="sheet-print"><i /><i /><i /></span>
        </div>
        <div className="label-web"><span /><span /><span /></div>
        <div className="label-roll">
          {rollLayers.map(index => <span key={index} className="roll-layer" style={{ '--layer-index': index } as SceneStyle} />)}
          <span className="roll-face"><i /></span>
        </div>
        <span className="depth-shadow" />
      </div>
    </div>
  </figure>;
}
