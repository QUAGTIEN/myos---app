'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useRef, useState, useSyncExternalStore } from 'react';
import { heroContent, heroMedia } from '@/content/hero';
import { Container } from '../layout/Container';
import { Arrow } from '../ui/Arrow';

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
type NetworkNavigator = Navigator & { connection?: Connection };

function subscribePreferences(callback: () => void) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 767px)');
  const connection = (navigator as NetworkNavigator).connection;
  motion.addEventListener('change', callback);
  mobile.addEventListener('change', callback);
  connection?.addEventListener('change', callback);
  return () => { motion.removeEventListener('change', callback); mobile.removeEventListener('change', callback); connection?.removeEventListener('change', callback); };
}

function getPreferences() {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const connection = (navigator as NetworkNavigator).connection;
  const constrained = Boolean(connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? ''));
  return `${motion ? 1 : 0}:${mobile ? 1 : 0}:${constrained ? 1 : 0}`;
}

export function VideoHero() {
  const preferences = useSyncExternalStore(subscribePreferences, getPreferences, () => '1:0:0');
  const [reducedMotion, mobile, constrained] = preferences.split(':').map(value => value === '1');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playError, setPlayError] = useState(false);
  const source = mobile ? heroMedia.mobileSrc ?? heroMedia.desktopSrc : heroMedia.desktopSrc;
  const blocked = !source || reducedMotion || constrained || failed;
  const status = reducedMotion ? 'Chuyển động đã tắt' : constrained ? 'Chế độ tiết kiệm dữ liệu' : failed ? 'Video không khả dụng' : playError ? 'Nhấn để phát video' : playing ? 'Tạm dừng video' : 'Phát video';

  async function toggleVideo() {
    const video = videoRef.current;
    if (!video || blocked) return;
    if (!video.paused) { video.pause(); return; }
    try { await video.play(); setPlayError(false); }
    catch { setPlayError(true); }
  }

  return (
    <section className="video-hero" aria-labelledby="hero-title">
      <div className="hero-brand-arc" aria-hidden="true" />
      {(heroMedia.poster || source) && <div className="hero-media">
        {heroMedia.poster && <Image src={heroMedia.poster} alt="" fill priority sizes="(max-width: 767px) 100vw, 65vw" className={`hero-poster ${loaded && !blocked ? 'poster-hidden' : ''}`} />}
        {!blocked && source && <video key={source} ref={videoRef} src={source} poster={heroMedia.poster ?? undefined} className="hero-video" autoPlay muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => { setPlaying(true); setLoaded(true); }} onPause={() => setPlaying(false)} onLoadedData={() => setLoaded(true)} onError={() => { setFailed(true); setPlaying(false); }} />}
        <div className="media-overlay" aria-hidden="true" />
        {source && <div className="media-controls">
          <div className="media-label"><p className="media-caption">{heroMedia.caption}</p><p className="media-status" role="status">{status}</p></div>
          <button className="video-control" type="button" onClick={toggleVideo} disabled={blocked} aria-label={status}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">{playing && !blocked ? <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="3" /> : <path d="m9 5 10 7-10 7V5Z" fill="currentColor" />}</svg>
          </button>
        </div>}
      </div>}
      <Container className="hero-content">
        <div className="hero-copy">
          <p className="hero-eyebrow">{heroContent.eyebrow}</p>
          <h1 id="hero-title">{heroContent.title.map((part, index) => <Fragment key={part}>{index > 0 && ' '}<span>{part}</span>{index === 1 ? <br className="title-break-desktop" /> : index < 3 ? <br className="title-break-mobile" /> : null}</Fragment>)}</h1>
          <p className="hero-description">{heroContent.description}</p>
          <div className="hero-actions"><Link href={heroContent.primaryCta.href} className="button button-primary">{heroContent.primaryCta.label}<Arrow /></Link><Link href={heroContent.secondaryCta.href} className="hero-secondary">{heroContent.secondaryCta.label}<Arrow diagonal /></Link></div>
        </div>
      </Container>
    </section>
  );
}
