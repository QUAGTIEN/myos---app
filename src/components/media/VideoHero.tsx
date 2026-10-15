'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { heroContent, heroMedia } from '@/content/hero';
import { Container } from '../layout/Container';
import { Arrow } from '../ui/Arrow';
import { HeroLabelSculpture } from '../products/HeroLabelSculpture';

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

function MediaControls({ status, playing = false, retry = false, onToggle }: {
  status: string;
  playing?: boolean;
  retry?: boolean;
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
        aria-label={retry ? 'Thử phát lại video' : playing ? 'Tạm dừng video' : 'Phát video'}
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
    if (!video) return;
    if (failed) {
      // Retry only from a user gesture. Keep the poster until playing succeeds.
      setFailed(false);
      setHasPlayed(false);
      setPlayBlocked(false);
      video.load();
    }
    if (!video.paused) { video.pause(); return; }
    try { await video.play(); setPlayBlocked(false); }
    catch { setPlayBlocked(true); }
  }

  const status = failed ? 'Ảnh tĩnh · Có thể thử phát lại video'
    : playBlocked ? 'Nhấn Phát để xem video'
    : playing ? 'Video đang phát'
    : hasPlayed ? 'Video đã tạm dừng' : 'Đang tải video';

  return (
    <>
      <video
        id="hero-video"
        ref={videoRef}
        src={source}
        poster={heroMedia.poster ?? undefined}
        className={`hero-video${hasPlayed && !failed ? ' is-ready' : ''}`}
        autoPlay muted loop playsInline preload="none" aria-hidden="true"
        onPlaying={() => { setPlaying(true); setHasPlayed(true); setPlayBlocked(false); setFailed(false); }}
        onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setPlaying(false); }}
      />
      <MediaControls status={status} playing={playing} retry={failed} onToggle={toggleVideo} />
    </>
  );
}

export function VideoHero() {
  const [scenePaused, setScenePaused] = useState(false);
  // Server render is poster-only; check user preferences before setting any src.
  const preferences = useSyncExternalStore(subscribePreferences, getPreferences, () => 'pending');
  const [reducedMotion, mobile, constrained] = preferences.split(':').map(value => value === '1');
  const source = mobile ? heroMedia.mobileSrc ?? heroMedia.desktopSrc : heroMedia.desktopSrc;
  const canPlay = Boolean(preferences !== 'pending' && source && !reducedMotion && !constrained);
  const canAnimate = preferences !== 'pending' && !reducedMotion && !constrained && 'IntersectionObserver' in window;
  const fallbackStatus = reducedMotion ? 'Ảnh tĩnh · Chuyển động đã tắt'
    : constrained ? 'Ảnh tĩnh · Tiết kiệm dữ liệu' : 'Đang hiển thị ảnh tĩnh';

  return (
    <section className="video-hero" aria-labelledby="hero-title">
      <div className="hero-brand-arc" aria-hidden="true" />
      {(heroMedia.poster || source) && <div className="hero-media" data-reveal="hero-media">
        {heroMedia.poster && <Image
          src={heroMedia.poster}
          alt=""
          fill priority
          sizes="(max-width: 900px) 100vw, 55vw"
          className="hero-poster"
        />}
        <div className="media-overlay" aria-hidden="true" />
        {canPlay && source
          ? <HeroPlayback key={source} source={source} />
          : <MediaControls status={fallbackStatus} />}
      </div>}
      <Container className="hero-content">
        <div className="hero-copy">
          <p className="hero-eyebrow"><span aria-hidden="true" />{heroContent.eyebrow}</p>
          <h1 id="hero-title">{heroContent.title.map((line, index) => (
            <span className={`hero-title-line${index === 1 ? ' hero-title-accent' : ''}`} data-reveal="hero-title" data-reveal-delay={index + 1} key={line}>{index > 0 && ' '}{line}</span>
          ))}</h1>
          <p className="hero-description">{heroContent.description}</p>
          <div className="hero-actions">
            <Link href={heroContent.primaryCta.href} className="button button-primary">{heroContent.primaryCta.label}<Arrow /></Link>
            <Link href={heroContent.secondaryCta.href} className="hero-secondary">{heroContent.secondaryCta.label}<Arrow diagonal /></Link>
          </div>
          <ul className="hero-disciplines" aria-label="Hình thức thực hiện">{heroContent.disciplines.map(label => <li key={label}>{label}</li>)}</ul>
        </div>
      </Container>
      <HeroLabelSculpture animate={canAnimate && !scenePaused} />
      <div className="hero-bottom-line"><Container className="hero-bottom-inner">
        <p>Tem nhãn. Bao bì. Vật tư in.</p>
        <button type="button" className="hero-motion-toggle" hidden={!canAnimate} aria-pressed={!scenePaused} aria-controls="hero-product-scene" aria-label="Chuyển động sản phẩm" onClick={() => setScenePaused(value => !value)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">{scenePaused ? <path d="m8 5 11 7-11 7V5Z" fill="currentColor" /> : <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="3" />}</svg>
          Hiệu ứng: {scenePaused ? 'Tắt' : 'Bật'}
        </button>
        <a href={heroContent.discovery.href}>{heroContent.discovery.label}<Arrow diagonal /></a>
      </Container></div>
    </section>
  );
}
