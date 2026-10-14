'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent } from 'react';
import { mainNavigation, siteRoutes } from '@/content/navigation';
import { Container } from './Container';
import { Arrow } from '../ui/Arrow';

function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}

export function Header() {
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  const solid = pathname !== '/' || scrolled;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const restoreFocusRef = useRef(true);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1200px)');
    const onChange = () => { if (media.matches) dialogRef.current?.close(); };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => { dialogRef.current?.close(); }, [pathname]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  function openMenu() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMenuClosing(false);
    setMenuOpen(true);
    dialogRef.current?.showModal();
  }

  function closeMenu(restoreFocus = true) {
    restoreFocusRef.current = restoreFocus;
    if (!dialogRef.current?.open) return;
    setMenuClosing(true);
    closeTimerRef.current = setTimeout(() => dialogRef.current?.close(), 240);
  }

  function handleMenuClose() {
    setMenuOpen(false);
    setMenuClosing(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (restoreFocusRef.current) {
      const target = window.matchMedia('(min-width: 1200px)').matches
        ? wordmarkRef.current : triggerRef.current;
      target?.focus();
    }
    restoreFocusRef.current = true;
  }

  function keepMenuFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const targets = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')];
    const first = targets[0];
    const last = targets[targets.length - 1];
    const active = document.activeElement;
    if (!first || !last) return;
    if (event.shiftKey && active === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault(); first.focus();
    }
  }

  return (
    <>
      <header className="site-header" data-variant={solid ? 'solid' : 'over-hero'}>
        <Container className="header-inner">
          <Link ref={wordmarkRef} href="/" className="wordmark" aria-label="Sunflower — Trang chủ">
            <span>SUNFLOWER<span className="wordmark-dot" aria-hidden="true">.</span></span>
            <small>TEM NHÃN · BAO BÌ · VẬT TƯ IN</small>
          </Link>
          <nav className="desktop-navigation" aria-label="Điều hướng chính">
            {mainNavigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.label}</Link>)}
          </nav>
          <Link href="/lien-he" className="button button-primary header-cta" aria-current={pathname === '/lien-he' ? 'page' : undefined}>Yêu cầu báo giá <Arrow diagonal /></Link>
          <button ref={triggerRef} type="button" className="menu-trigger" aria-label="Mở menu" aria-haspopup="dialog" aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={openMenu}>
            <span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </Container>
      </header>
      <dialog ref={dialogRef} id="mobile-navigation" className={`mobile-menu${menuClosing ? ' is-closing' : ''}`} aria-labelledby="menu-title" onKeyDown={keepMenuFocus} onCancel={event => { event.preventDefault(); closeMenu(); }} onClose={handleMenuClose}>
        <div className="mobile-menu-top">
          <span className="wordmark" id="menu-title">SUNFLOWER<span className="wordmark-dot" aria-hidden="true">.</span></span>
          <button type="button" className="menu-close" aria-label="Đóng menu" onClick={() => closeMenu()} autoFocus><span aria-hidden="true">×</span></button>
        </div>
        <nav aria-label="Điều hướng trên điện thoại">
          {siteRoutes.slice(0, 6).map(item => <Link href={item.href} key={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={() => closeMenu(pathname === item.href)}>{item.label}<Arrow /></Link>)}
          <Link href="/lien-he" className="button button-primary mobile-menu-cta" aria-current={pathname === '/lien-he' ? 'page' : undefined} onClick={() => closeMenu(pathname === '/lien-he')}>Yêu cầu báo giá <Arrow diagonal /></Link>
        </nav>
      </dialog>
    </>
  );
}
