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

export function ProductDepthScene() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 767px)').matches) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const bounds = stage.getBoundingClientRect();
      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      const offset = Math.max(-24, Math.min(24, (progress - 0.5) * 48));
      stage.style.setProperty('--scene-scroll-y', `${offset.toFixed(2)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const visibility = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    }, { rootMargin: '15% 0px' });

    visibility.observe(stage);
    return () => {
      visibility.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.style.setProperty('--scene-tilt-x', `${(-y * 8).toFixed(2)}deg`);
    stage.style.setProperty('--scene-tilt-y', `${(x * 8).toFixed(2)}deg`);
  }

  function resetTilt() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--scene-tilt-x', '0deg');
    stage.style.setProperty('--scene-tilt-y', '0deg');
  }

  return <figure className="product-depth-scene" data-reveal="scene" aria-labelledby="depth-scene-title">
    <figcaption className="depth-scene-copy">
      <p className="depth-scene-eyebrow">CẤU TRÚC SẢN PHẨM</p>
      <h3 id="depth-scene-title">Từ lớp vật liệu đến cuộn tem hoàn thiện.</h3>
      <p>Một mô phỏng trực quan cho cách vật liệu, bề mặt in và hình thức bàn giao được xem xét cùng nhau trước khi chốt phương án.</p>
      <span>Minh họa 3D · Không phải quy cách kỹ thuật</span>
    </figcaption>
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
