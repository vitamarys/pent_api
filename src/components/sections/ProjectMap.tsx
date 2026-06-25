"use client";

import { useEffect, useRef } from "react";
import s from "./ProjectMap.module.scss";
import Container from "@/components/ui/Container";
import { wrap } from "module";

interface ProximityItem {
  id?: number;
  label: string;
  value?: string;
}

interface Props {
  sectionTitle?: string;
  body?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  proximity?: ProximityItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

// ── Google Maps singleton loader ───────────────────────────────────────────────
let gmPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (gmPromise) return gmPromise;
  if (typeof window !== "undefined" && (window as any).google?.maps) {
    return Promise.resolve();
  }
  gmPromise = new Promise<void>((resolve, reject) => {
    (window as any).__gmInit = () => {
      resolve();
      delete (window as any).__gmInit;
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&language=en&callback=__gmInit`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
  return gmPromise;
}

// ── Map style ──────────────────────────────────────────────────────────────────
const MAP_STYLE = [
  {
    featureType: "all",
    elementType: "labels.text",
    stylers: [{ color: "#878787" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [{ color: "#f9f5ed" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9c9c9" }],
  },
  { featureType: "water", elementType: "all", stylers: [{ color: "#aee0f4" }] },
];

// ── SVG icons ─────────────────────────────────────────────────────────────────
const PROPERTY_MARKER_SVG = encodeURIComponent(`
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#f)">
      <rect x="12" y="12" width="32" height="32" rx="16" fill="#1f1f1f"/>
      <rect x="11" y="11" width="34" height="34" rx="17" stroke="white" stroke-width="2"/>
      <path d="M22 27L28 24C28.15 23.92 28.35 23.92 28.5 24L34 27" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 29V33C32 33.55 31.55 34 31 34H25C24.45 34 24 33.55 24 33V29" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <filter id="f" x="0" y="0" width="56" height="56" filterUnits="userSpaceOnUse">
        <feFlood flood-opacity="0" result="bg"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="alpha"/>
        <feOffset/><feGaussianBlur stdDeviation="8"/>
        <feComposite in2="alpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
        <feBlend in2="bg" result="shadow"/>
        <feBlend in="SourceGraphic" in2="shadow"/>
      </filter>
    </defs>
  </svg>
`);

const CLICK_MARKER_SVG = encodeURIComponent(`
  <svg width="56" height="68" viewBox="0 0 56 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#f2)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M28 7C39.05 7 48 15.89 48 26.85C48 28.19 47.87 29.5 47.61 30.76C46.13 41.82 33.45 54.16 29.37 57.88C28.64 58.54 27.57 58.54 26.85 57.88C23.14 54.51 12.35 44.04 9.28 33.86C8.45 31.68 8 29.32 8 26.85C8 15.89 16.95 7 28 7Z" fill="white"/>
      <rect x="12" y="11" width="32" height="32" rx="16" fill="#1C1C1E" fill-opacity="0.72"/>
      <rect x="20" y="19" width="16" height="16" rx="8" fill="white"/>
    </g>
    <defs>
      <filter id="f2" x="0" y="0" width="56" height="68" filterUnits="userSpaceOnUse">
        <feFlood flood-opacity="0" result="bg"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="alpha"/>
        <feOffset dy="1"/><feGaussianBlur stdDeviation="4"/>
        <feComposite in2="alpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
        <feBlend in2="bg" result="shadow"/>
        <feBlend in="SourceGraphic" in2="shadow"/>
      </filter>
    </defs>
  </svg>
`);

const CAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18.33 7.5L16.15 8.33" stroke="#1C1C1E"/><path d="M3.86 8.33L1.67 7.5" stroke="#1C1C1E"/><path d="M15.21 11.67H13.13" stroke="#1C1C1E"/><path d="M6.87 11.67H4.79" stroke="#1C1C1E"/><path d="M16.15 8.33L15.45 5C15.25 4.03 14.4 3.33 13.41 3.33H6.68C5.71 3.33 4.87 4 4.65 4.94L3.86 8.33" stroke="#1C1C1E"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.71 16.67H4.58C5.27 16.67 5.83 16.11 5.83 15.42V14.58H14.17V15.42C14.17 16.11 14.73 16.67 15.42 16.67H17.29C17.87 16.67 18.33 16.2 18.33 15.63V10.83C18.33 9.45 17.21 8.33 15.83 8.33H4.17C2.79 8.33 1.67 9.45 1.67 10.83V15.63C1.67 16.2 2.13 16.67 2.71 16.67Z" stroke="#1C1C1E"/></svg>`;

// ── Component ──────────────────────────────────────────────────────────────────
export default function ProjectMap({
  sectionTitle = "Location",
  body,
  latitude = 25.2048,
  longitude = 55.2708,
  zoom = 13,
  proximity = [],
  ctaLabel,
  ctaHref,
}: Props) {
  const destinations = proximity;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const stateRef = useRef({
    activePopup: null as any,
    directionsRenderer: null as any,
    etaOverlay: null as any,
    clickMarker: null as any,
    etaCache: new Map<string, string>(),
  });

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_GOOGLE_MAPS_TOKEN;
    if (!token || !containerRef.current) return;

    let destroyed = false;

    loadGoogleMaps(token).then(() => {
      if (destroyed || !containerRef.current) return;

      const gm = (window as any).google.maps;
      const st = stateRef.current;
      const loc = { lat: latitude, lng: longitude };

      // ── Init map ──────────────────────────────────────────────────────────
      const map = new gm.Map(containerRef.current, {
        center: loc,
        zoom,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        clickableIcons: true,
        gestureHandling: "cooperative",
        scrollwheel: false,
      });
      mapRef.current = map;

      // ── Property marker ───────────────────────────────────────────────────
      new gm.Marker({
        map,
        position: loc,
        zIndex: 999,
        icon: {
          url: `data:image/svg+xml;utf8,${PROPERTY_MARKER_SVG}`,
          scaledSize: new gm.Size(56, 56),
          anchor: new gm.Point(28, 28),
        },
      });

      // ── POI click ─────────────────────────────────────────────────────────
      map.addListener("click", (event: any) => {
        if (!event.placeId) return;
        event.stop();
        clearAllOverlays();
        loadPlaceDetails(event.placeId);
      });

      // ── Helpers ───────────────────────────────────────────────────────────
      function clearAllOverlays() {
        if (st.activePopup) {
          st.activePopup.setMap(null);
          st.activePopup = null;
        }
        if (st.directionsRenderer) {
          st.directionsRenderer.setMap(null);
          st.directionsRenderer = null;
        }
        if (st.etaOverlay) {
          st.etaOverlay.setMap(null);
          st.etaOverlay = null;
        }
        if (st.clickMarker) {
          st.clickMarker.setMap(null);
          st.clickMarker = null;
        }
      }

      function createClickMarker(position: any) {
        if (st.clickMarker) {
          st.clickMarker.setMap(null);
          st.clickMarker = null;
        }
        st.clickMarker = new gm.Marker({
          map,
          position,
          zIndex: 999,
          icon: {
            url: `data:image/svg+xml;utf8,${CLICK_MARKER_SVG}`,
            scaledSize: new gm.Size(40, 52),
            anchor: new gm.Point(20, 40),
          },
        });
      }

      function loadPlaceDetails(placeId: string) {
        const svc = new gm.places.PlacesService(map);
        svc.getDetails(
          {
            placeId,
            fields: [
              "name",
              "geometry",
              "formatted_address",
              "photos",
              "editorial_summary",
            ],
          },
          (place: any) => {
            if (!place) return;
            createClickMarker(place.geometry.location);
            showPlacePopup(place);
            drawRoute(loc, place.geometry.location);
          },
        );
      }

      function drawRoute(from: any, to: any) {
        if (st.directionsRenderer) {
          st.directionsRenderer.setMap(null);
          st.directionsRenderer = null;
        }

        const cacheKey = `${to.lat()},${to.lng()}`;
        st.directionsRenderer = new gm.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#c19962",
            strokeWeight: 3,
            strokeOpacity: 0.9,
          },
        });

        if (st.etaCache.has(cacheKey))
          renderEtaBubble(st.etaCache.get(cacheKey)!, to);

        new gm.DirectionsService().route(
          { origin: from, destination: to, travelMode: gm.TravelMode.DRIVING },
          (result: any, status: string) => {
            if (status !== "OK" || !result?.routes?.[0]?.legs?.[0]?.duration)
              return;
            st.directionsRenderer.setDirections(result);
            const text = result.routes[0].legs[0].duration.text;
            st.etaCache.set(cacheKey, text);
            renderEtaBubble(text, to);
          },
        );
      }

      function renderEtaBubble(text: string, position: any) {
        if (st.etaOverlay) {
          st.etaOverlay.setMap(null);
          st.etaOverlay = null;
        }

        const el = document.createElement("div");
        el.className = "gm-eta";
        el.innerHTML = `<span class="gm-eta__icon">${CAR_SVG}</span><span class="gm-eta__text">${text}</span>`;

        const overlay = new gm.OverlayView();
        overlay.onAdd = function () {
          this.getPanes().floatPane.appendChild(el);
        };
        overlay.draw = function () {
          const pt = this.getProjection().fromLatLngToDivPixel(position);
          el.style.left = `${pt.x}px`;
          el.style.top = `${pt.y - 65}px`;
        };
        overlay.onRemove = function () {
          el.remove();
        };
        overlay.setMap(map);
        st.etaOverlay = overlay;
      }

      function ensurePopupVisible(popupEl: HTMLElement) {
        const mapRect = containerRef.current!.getBoundingClientRect();
        const popupRect = popupEl.getBoundingClientRect();
        let px = 0,
          py = 0;
        if (popupRect.left < mapRect.left)
          px = popupRect.left - mapRect.left - 16;
        if (popupRect.right > mapRect.right)
          px = popupRect.right - mapRect.right + 16;
        if (popupRect.top < mapRect.top) py = popupRect.top - mapRect.top - 16;
        if (popupRect.bottom > mapRect.bottom)
          py = popupRect.bottom - mapRect.bottom + 16;
        if (px || py) map.panBy(px, py);
      }

      function showPlacePopup(place: any) {
        if (st.activePopup) {
          st.activePopup.setMap(null);
          st.activePopup = null;
        }

        const popupEl = buildPopupEl(place, clearAllOverlays);

        // block map events on popup
        [
          "click",
          "dblclick",
          "mousedown",
          "mouseup",
          "touchstart",
          "touchend",
        ].forEach((ev) => {
          popupEl.addEventListener(ev, (e: Event) => {
            if ((e.target as HTMLElement).closest(".gm-popup__close")) return;
            e.stopPropagation();
            e.preventDefault();
          });
        });

        let initialized = false;
        const overlay = new gm.OverlayView();
        overlay.onAdd = function () {
          this.getPanes().floatPane.appendChild(popupEl);
        };
        overlay.draw = function () {
          const proj = this.getProjection();
          if (!proj) return;
          const pt = proj.fromLatLngToDivPixel(place.geometry.location);
          const pw = popupEl.offsetWidth || 280;
          const ph = popupEl.offsetHeight || 260;
          const x = pt.x - pw / 2;
          const y = pt.y - 40 - 30 - ph;
          popupEl.style.transform = `translate(${x}px,${y}px)`;
          popupEl.style.opacity = "1";
          if (!initialized) {
            initialized = true;
            requestAnimationFrame(() => ensurePopupVisible(popupEl));
          }
        };
        overlay.onRemove = function () {
          popupEl.remove();
        };
        overlay.setMap(map);
        st.activePopup = overlay;
      }
    });

    return () => {
      destroyed = true;
      const st = stateRef.current;
      if (st.activePopup) st.activePopup.setMap(null);
      if (st.directionsRenderer) st.directionsRenderer.setMap(null);
      if (st.etaOverlay) st.etaOverlay.setMap(null);
      if (st.clickMarker) st.clickMarker.setMap(null);
      mapRef.current = null;
    };
  }, [latitude, longitude, zoom]);

  const zoomIn = () => mapRef.current?.setZoom(mapRef.current.getZoom() + 1);
  const zoomOut = () => mapRef.current?.setZoom(mapRef.current.getZoom() - 1);

  return (
    <section className={s.section}>
      <Container>
        <div className={s.layout}>
          {/* ── LEFT PANEL ── */}
          <div className={s.leftPanel}>
            <div className={s.leftContent}>
              <div className={s.textBlock}>
                <h2 className={s.title}>{sectionTitle}</h2>
                {body && <p className={s.description}>{body}</p>}
              </div>
              <div className={s.infoWrap}>
                    {destinations.length > 0 && (
                <div className={s.proximityTable}>
                  {destinations.map((item, i) => (
                    <div key={item.id ?? i} className={s.proximityRow}>
                      <span className={s.proximityLabel}>{item.label}</span>
                      <span className={s.proximityValue}>
                        {item.value ?? ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {ctaLabel && (
                <a href={ctaHref ?? "#"} className={s.cta}>
                  {ctaLabel}
                </a>
              )}
              </div>
          
            </div>
          </div>

          {/* ── MAP ── */}
          <div className={s.mapWrap}>
            <div ref={containerRef} className={s.mapCanvas} />

            <div className={s.zoomControls}>
              <button className={s.zoomBtn} onClick={zoomIn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#1f1f1f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button className={s.zoomBtn} onClick={zoomOut}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19"
                    stroke="#1f1f1f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Popup builder (vanilla DOM) ────────────────────────────────────────────────
function buildPopupEl(place: any, onClose: () => void): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "gm-popup";
  wrap.style.opacity = "0";
  wrap.style.position = "absolute";
  wrap.style.top = "0";
  wrap.style.left = "0";

  // Slider
  const sliderWrap = document.createElement("div");
  sliderWrap.className = "gm-popup__slider";

  const slides = document.createElement("div");
  slides.className = "gm-popup__slides";

  const photos: any[] = place.photos?.slice(0, 5) || [];
  if (photos.length) {
    photos.forEach((photo, i) => {
      const slide = document.createElement("div");
      slide.className = "gm-popup__slide";
      if (i === 0)
        slide.style.backgroundImage = `url('${photo.getUrl({ maxWidth: 800 })}')`;
      else slide.dataset.bg = photo.getUrl({ maxWidth: 800 });
      slides.appendChild(slide);
    });
  } else {
    const slide = document.createElement("div");
    slide.className = "gm-popup__slide gm-popup__slide--empty";
    slides.appendChild(slide);
  }

  const prevBtn = document.createElement("button");
  prevBtn.className = "gm-popup__prev";
  prevBtn.innerHTML = "‹";

  const nextBtn = document.createElement("button");
  nextBtn.className = "gm-popup__next";
  nextBtn.innerHTML = "›";

  const dotsWrap = document.createElement("div");
  dotsWrap.className = "gm-popup__dots";

  const closeBtn = document.createElement("button");
  closeBtn.className = "gm-popup__close";
  closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
  closeBtn.addEventListener("click", onClose);

  sliderWrap.append(slides, prevBtn, nextBtn, dotsWrap, closeBtn);

  // Info
  const info = document.createElement("div");
  info.className = "gm-popup__info";

  const name = document.createElement("span");
  name.className = "gm-popup__name";
  name.textContent = place.name;

  const desc = document.createElement("span");
  desc.className = "gm-popup__desc";
  desc.textContent = place.editorial_summary?.overview || "";

  const addr = document.createElement("span");
  addr.className = "gm-popup__addr";
  addr.textContent = place.formatted_address;

  info.append(name, desc, addr);
  wrap.append(sliderWrap, info);

  // Init slider
  let idx = 0;
  const allSlides = Array.from(
    slides.querySelectorAll<HTMLElement>(".gm-popup__slide"),
  );

  allSlides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.dataset.i = String(i);
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll<HTMLElement>("span"));

  function goTo(n: number) {
    idx = Math.max(0, Math.min(n, allSlides.length - 1));
    const s = allSlides[idx];
    if (s.dataset.bg) {
      s.style.backgroundImage = `url('${s.dataset.bg}')`;
      delete s.dataset.bg;
    }
    slides.style.transform = `translateX(${-280 * idx}px)`;
    prevBtn.style.display = idx > 0 ? "flex" : "none";
    nextBtn.style.display = idx < allSlides.length - 1 ? "flex" : "none";
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  prevBtn.addEventListener("click", () => goTo(idx - 1));
  nextBtn.addEventListener("click", () => goTo(idx + 1));

  let tx = 0;
  slides.addEventListener("touchstart", (e) => {
    tx = e.touches[0].clientX;
  });
  slides.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) < 40) return;
    goTo(idx + (dx < 0 ? 1 : -1));
  });

  goTo(0);
  return wrap;
}
