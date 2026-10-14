'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
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
  return () => {
    motion.removeEventListener('change', callback);
    mobile.removeEventListener('change', callback);
    connection?.removeEventListener('change', callback);
  };
}

function getPreferences() {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const connection = (navigator as NetworkNavigator).connection;
  const constrained = Boolean(connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? ''));
  return `${motion ? 1 : 0}:${mobile ? 1 : 0}:${constrained ? 1 : 0}`;
}

function MediaControls({ status, playing = false, onToggle }: {
  status: string;
  playing?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="media-controls">
      <div className="media-label">
        <p className="media-caption">{heroMedia.caption}</p>
        <p id="hero-media-status" className="media-status" role="status">{status}</p>
      </div>
      <button
        className="video-control"
        type="button"
        onClick={onToggle}
        disabled={!onToggle}
        aria-label={playing ? 'Tạm dừng video' : 'Phát video'}
        aria-describedby="hero-media-status"
        aria-controls={onToggle ? 'hero-video' : undefined}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {playing
            ? <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="3" />
            : <path d="m9 5 10 7-10 7V5Z" fill="currentColor" />}
        </svg>
      </button>
    </div>
  );
}

// Mounted only when motion/network settings allow video. Source changes create
// a fresh instance, so errors/readiness from an old source cannot hide its poster.
function HeroPlayback({ source }: { source: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let active = true;
    // Observe autoplay rejection rather than assuming autoPlay succeeded.
    void video.play().catch(() => { if (active) setPlayBlocked(true); });
    return () => { active = false; video.pause(); };
  }, [source]);

  async function toggleVideo() {
    const video = videoRef.current;
    if (!video || failed) return;
    if (!video.paused) { video.pause(); return; }
    try { await video.play(); setPlayBlocked(false); }
    catch { setPlayBlocked(true); }
  }

  const status = failed ? 'Video không khả dụng · Đang hiển thị ảnh tĩnh'
    : playBlocked ? 'Nhấn Phát để xem video'
    : playing ? 'Video đang phát'
    : hasPlayed ? 'Video đã tạm dừng' : 'Đang tải video';

  return (
    <>
      {!failed && <video
        id="hero-video"
        ref={videoRef}
        src={source}
        poster={heroMedia.poster ?? undefined}
        className={`hero-video${hasPlayed ? ' is-ready' : ''}`}
        autoPlay muted loop playsInline preload="none" aria-hidden="true"
        onPlaying={() => { setPlaying(true); setHasPlayed(true); setPlayBlocked(false); }}
        onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setPlaying(false); }}
      />}
      <MediaControls status={status} playing={playing} onToggle={failed ? undefined : toggleVideo} />
    </>
  );
}

export function VideoHero() {
  // Server render is poster-only; check user preferences before setting any src.
  const preferences = useSyncExternalStore(subscribePreferences, getPreferences, () => 'pending');
  const [reducedMotion, mobile, constrained] = preferences.split(':').map(value => value === '1');
  const source = mobile ? heroMedia.mobileSrc ?? heroMedia.desktopSrc : heroMedia.desktopSrc;
  const canPlay = Boolean(preferences !== 'pending' && source && !reducedMotion && !constrained);
  const fallbackStatus = reducedMotion ? 'Ảnh tĩnh · Chuyển động đã tắt'
    : constrained ? 'Ảnh tĩnh · Tiết kiệm dữ liệu' : 'Đang hiển thị ảnh tĩnh';

  return (
    <section className="video-hero" aria-labelledby="hero-title">
      <div className="hero-brand-arc" aria-hidden="true" />
      {(heroMedia.poster || source) && <div className="hero-media">
        {heroMedia.poster && <Image
          src={heroMedia.poster}
          alt=""
          fill priority
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 64px), 60vw"
          className="hero-poster"
        />}
        <div className="media-overlay" aria-hidden="true" />
        {canPlay && source
          ? <HeroPlayback key={source} source={source} />
          : <MediaControls status={fallbackStatus} />}
      </div>}
      <Container className="hero-content">
        <div className="hero-copy">
          <p className="hero-eyebrow">{heroContent.eyebrow}</p>
          <h1 id="hero-title">{heroContent.title.map((line, index) => (
            <span className="hero-title-line" key={line}>{index > 0 && ' '}{line}</span>
          ))}</h1>
          <p className="hero-description">{heroContent.description}</p>
          <div className="hero-actions">
            <Link href={heroContent.primaryCta.href} className="button button-primary">{heroContent.primaryCta.label}<Arrow /></Link>
            <Link href={heroContent.secondaryCta.href} className="hero-secondary">{heroContent.secondaryCta.label}<Arrow diagonal /></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
