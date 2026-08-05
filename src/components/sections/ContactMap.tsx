'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import s from './ContactMap.module.scss';

// ── Constants ──────────────────────────────────────────────────────────────────
const LAT = 25.099328192883068;
const LNG = 55.157006253650174;
const ZOOM = 14;

const OFFICE_NAME    = 'Palm View Tower 1';
const OFFICE_ADDRESS = 'Ground Floor, R02, Dubai, UAE';
const OFFICE_PHONE   = '+971 52 222 2105';
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

const SLIDES = [
  '/images/ContactUs/Slide1.png',
  '/images/ContactUs/Slide2.png',
  '/images/ContactUs/Slide3.png',
];

// ── Google Maps singleton loader ───────────────────────────────────────────────
let gmPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (gmPromise) return gmPromise;
  if (typeof window !== 'undefined' && (window as any).google?.maps) {
    return Promise.resolve();
  }
  gmPromise = new Promise<void>((resolve, reject) => {
    (window as any).__gmInitContact = () => {
      resolve();
      delete (window as any).__gmInitContact;
    };
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&language=en&callback=__gmInitContact`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
  return gmPromise;
}

// ── Map style ──────────────────────────────────────────────────────────────────
const MAP_STYLE = [
  { featureType: 'all', elementType: 'labels.text', stylers: [{ color: '#878787' }] },
  { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f9f5ed' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'all', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'all', stylers: [{ color: '#aee0f4' }] },
];

const PIN_URL = '/icons/Pin.svg';

// ── Component ──────────────────────────────────────────────────────────────────
export default function ContactMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<any>(null);

  // Slider state
  const [slide, setSlide]       = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const trackRef  = useRef<HTMLDivElement>(null);

  const total  = SLIDES.length;
  const goTo   = useCallback((n: number) => setSlide(Math.max(0, Math.min(n, total - 1))), [total]);
  const goPrev = useCallback(() => goTo(slide - 1), [slide, goTo]);
  const goNext = useCallback(() => goTo(slide + 1), [slide, goTo]);

  // Map init
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_GOOGLE_MAPS_TOKEN;
    if (!token || !mapContainerRef.current) return;
    let destroyed = false;

    loadGoogleMaps(token).then(() => {
      if (destroyed || !mapContainerRef.current) return;
      const gm  = (window as any).google.maps;
      const loc = { lat: LAT, lng: LNG };

      const map = new gm.Map(mapContainerRef.current, {
        center: loc,
        zoom: ZOOM,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
        scrollwheel: false,
      });
      mapRef.current = map;

      new gm.Marker({
        map,
        position: loc,
        zIndex: 999,
        icon: {
          url: PIN_URL,
          scaledSize: new gm.Size(51, 51),
          anchor: new gm.Point(25, 25),
        },
      });
    });

    return () => { destroyed = true; mapRef.current = null; };
  }, []);

  const zoomIn  = () => mapRef.current?.setZoom(mapRef.current.getZoom() + 1);
  const zoomOut = () => mapRef.current?.setZoom(mapRef.current.getZoom() - 1);

  // Touch/drag slider
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientX;
    setDragging(false);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - dragStart.current;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? goNext() : goPrev();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = e.clientX;
    setDragging(true);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!dragging) return;
    setDragging(false);
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? goNext() : goPrev();
  };

  return (
    <section className={s.section}>
      <Container className={s.container}>

        {/* Title */}
        <h2 className={s.title}>Visit our offices</h2>

        {/* Map block */}
        <div className={s.mapBlock}>
          <div ref={mapContainerRef} className={s.mapCanvas} />

          {/* Info card over map */}
          <div className={s.infoCard}>
            <p className={s.officeName}>{OFFICE_NAME}</p>
            <p className={s.officeAddress}>{OFFICE_ADDRESS}</p>
            <div className={s.infoRow}>
              <p className={s.officePhone}>{OFFICE_PHONE}</p>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.directionsLink}
              >
                Get directions →
              </a>
            </div>
          </div>

          {/* Zoom controls */}
          <div className={s.zoomControls}>
            <button className={s.zoomBtn} onClick={zoomIn} aria-label="Zoom in">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className={s.zoomBtn} onClick={zoomOut} aria-label="Zoom out">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            className={s.fullscreenBtn}
            aria-label="Fullscreen"
            onClick={() => {
              const el = mapContainerRef.current;
              if (!el) return;
              if (!document.fullscreenElement) el.requestFullscreen?.();
              else document.exitFullscreen?.();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 6V1H6M10 1H15V6M15 10V15H10M6 15H1V10" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Tablet/mobile info (below map) */}
        <div className={s.infoCardMobile}>
          <p className={s.officeName}>{OFFICE_NAME}</p>
          <p className={s.officeAddress}>{OFFICE_ADDRESS}</p>
          <div className={s.infoRow}>
            <p className={s.officePhone}>{OFFICE_PHONE}</p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={s.directionsLink}
            >
              Get directions →
            </a>
          </div>
        </div>

        {/* Slider */}
        <div className={s.sliderSection}>
          <div className={s.sliderHeader}>
            <h3 className={s.sliderTitle}>Inside our office</h3>
            <div className={s.sliderNav}>
              <span className={s.sliderCounter}>
                {String(slide + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button
                className={`${s.navBtn} ${slide === 0 ? s.navBtnDisabled : ''}`}
                onClick={goPrev}
                disabled={slide === 0}
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className={`${s.navBtn} ${slide === total - 1 ? s.navBtnDisabled : ''}`}
                onClick={goNext}
                disabled={slide === total - 1}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className={s.sliderViewport}>
            <div
              ref={trackRef}
              className={s.sliderTrack}
              style={{ transform: `translateX(calc(-${slide} * var(--slide-step)))` }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            >
              {SLIDES.map((src, i) => (
                <div key={i} className={s.slide}>
                  <Image
                    src={src}
                    alt={`Office interior ${i + 1}`}
                    fill
                    className={s.slideImg}
                    draggable={false}
                    sizes="(max-width: 767px) 90vw, (max-width: 1199px) 60vw, 44vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}
