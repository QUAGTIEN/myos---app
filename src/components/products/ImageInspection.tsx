'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { ProductMedia } from '@/content/product-media';
import { getLoupeGeometry } from '@/lib/image-inspection';

const subscribe = () => () => {};

export function ImageInspection({ media, name, sizes }: { media: ProductMedia; name: string; sizes: string }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);
  const overflowRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [originalSize, setOriginalSize] = useState(false);
  const [originalFailed, setOriginalFailed] = useState(false);
  const titleId = useId();
  const noteId = useId();
  const canOpen = hydrated && typeof HTMLDialogElement !== 'undefined' && 'showModal' in HTMLDialogElement.prototype;

  function hideLens() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    lensRef.current?.removeAttribute('data-active');
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const hide = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      lensRef.current?.removeAttribute('data-active');
    };
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', hide, { passive: true });
    document.addEventListener('visibilitychange', hide);
    reduced.addEventListener('change', hide);
    pointer.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('scroll', hide);
      window.removeEventListener('resize', hide);
      document.removeEventListener('visibilitychange', hide);
      reduced.removeEventListener('change', hide);
      pointer.removeEventListener('change', hide);
      if (overflowRef.current !== null) document.body.style.overflow = overflowRef.current;
    };
  }, []);

  function moveLens(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { clientX: x, clientY: y } = event;
    if (!sourceRef.current) {
      sourceRef.current = new window.Image();
      sourceRef.current.src = media.src;
    }
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const stage = stageRef.current, photo = photoRef.current, lens = lensRef.current;
      const source = sourceRef.current;
      // Keep the gallery photo visible while the original is loading or unavailable.
      if (!stage || !photo?.complete || !photo.naturalWidth || !lens || !source?.complete || !source.naturalWidth) return;
      const style = getComputedStyle(lens);
      const geometry = getLoupeGeometry({ stage: stage.getBoundingClientRect(), image: photo.getBoundingClientRect(), x, y,
        diameter: lens.offsetWidth, sourceWidth: source.naturalWidth, sourceHeight: source.naturalHeight,
        maxZoom: Number.parseFloat(style.getPropertyValue('--inspection-zoom')) });
      if (!geometry) { lens.removeAttribute('data-active'); return; }
      lens.style.left = `${geometry.left}px`;
      lens.style.top = `${geometry.top}px`;
      lens.style.backgroundSize = `${geometry.width}px ${geometry.height}px`;
      lens.style.backgroundPosition = `${geometry.backgroundX}px ${geometry.backgroundY}px`;
      lens.style.backgroundImage = `url("${media.src}")`;
      lens.setAttribute('data-active', 'true');
    });
  }

  function closeViewer() {
    hideLens();
    setOpen(false);
    setOriginalSize(false);
    if (overflowRef.current !== null) {
      document.body.style.overflow = overflowRef.current;
      overflowRef.current = null;
    }
    if (triggerRef.current?.isConnected) triggerRef.current.focus();
  }

  function openViewer() {
    hideLens();
    if (!dialogRef.current || dialogRef.current.open) return;
    overflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setOpen(true);
    setOriginalFailed(false);
    dialogRef.current.showModal();
  }

  function keepViewerFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const dialog = event.currentTarget;
    const targets = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"], a[href]')];
    const first = targets[0], last = targets[targets.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  return <div className="image-inspection" data-ready={canOpen || undefined}>
    <div className="inspection-photo" ref={stageRef} onPointerMove={moveLens} onPointerLeave={hideLens} onPointerCancel={hideLens}>
      <Image ref={photoRef} src={media.webSrc ?? media.src} alt={media.alt} width={media.width} height={media.height} sizes={sizes} className="inspection-image" style={{ maxWidth: `min(100%, ${media.width}px)` }} />
      <span ref={lensRef} className="inspection-lens" aria-hidden="true" />
    </div>
    <a className="inspection-fallback" href={media.src} target="_blank" rel="noreferrer" aria-label={`Xem ảnh gốc: ${name} (mở thẻ mới)`}>Xem ảnh gốc <span aria-hidden="true">↗</span></a>
    <button ref={triggerRef} type="button" className="inspection-trigger" hidden={!canOpen} onClick={openViewer} aria-haspopup="dialog" aria-label={`Xem cận cảnh: ${name}`}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.6" /><path d="m15 15 6 6M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.6" /></svg>Xem cận cảnh
    </button>
    <dialog ref={dialogRef} className="inspection-dialog" aria-labelledby={titleId} aria-describedby={noteId} onKeyDown={keepViewerFocus} onClose={closeViewer} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
      <div className="inspection-dialog-inner">
        <div className="inspection-dialog-header"><div><p className="section-eyebrow">CHI TIẾT SẢN PHẨM</p><h2 id={titleId}>{name}</h2></div><button type="button" className="inspection-close" autoFocus aria-label="Đóng ảnh cận cảnh" onClick={() => dialogRef.current?.close()}>×</button></div>
        <div className="inspection-toolbar"><button type="button" aria-pressed={originalSize} onClick={() => setOriginalSize(value => !value)}>Kích thước gốc</button><p id={noteId}>{originalSize ? 'Cuộn trong vùng ảnh để xem các chi tiết.' : 'Chọn Kích thước gốc để xem ảnh ở độ phân giải nguồn.'}</p></div>
        <div className="inspection-viewport" data-original={originalSize || undefined} tabIndex={0} role="region" aria-label={`Vùng ảnh ${name}`}>
          {open && <Image src={media.src} alt={media.alt} width={media.width} height={media.height} className="inspection-original" onError={() => setOriginalFailed(true)} style={originalSize ? { width: media.width, maxWidth: 'none' } : undefined} />}
          {originalFailed && <p role="alert" className="inspection-error">Chưa tải được ảnh cận cảnh. <a href={media.src} target="_blank" rel="noreferrer">Mở ảnh gốc trong thẻ mới ↗</a></p>}
        </div>
      </div>
    </dialog>
  </div>;
}
