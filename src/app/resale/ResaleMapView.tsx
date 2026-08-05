/// <reference types="@types/google.maps" />
'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import s from './ResaleMapView.module.scss'

export interface MapProperty {
  id:         string
  slug:       string
  title:      string
  price?:     number
  area?:      number
  bedrooms?:  string
  bathrooms?: number
  unitType?:  string
  location?:  string
  image?:     string
  lat?:       number
  lng?:       number
}

// ── Google Maps singleton loader ───────────────────────────────────────────────
let gmPromise: Promise<void> | null = null

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (gmPromise) return gmPromise
  if (typeof window !== 'undefined' && window.google) return Promise.resolve()
  gmPromise = new Promise<void>((resolve, reject) => {
    window.__gmInit = () => { resolve(); delete window.__gmInit }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=en&callback=__gmInit`
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(script)
  })
  return gmPromise
}

declare global {
  interface Window { __gmInit?: () => void }
}

// ── Map style ──────────────────────────────────────────────────────────────────
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: 'all', elementType: 'labels.text', stylers: [{ color: '#878787' }] },
  { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f9f5ed' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'all', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'all', stylers: [{ color: '#aee0f4' }] },
]

// ── SVG icon builders ──────────────────────────────────────────────────────────
function makePriceIcon(label: string, active: boolean) {
  const bg = active ? '#C19962' : 'rgba(31,31,31,0.7)'
  const fontSize = 16
  const paddingH = 16
  const charWidth = 9.5
  const width = Math.ceil(label.length * charWidth) + paddingH * 2
  const height = 34
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    <text x="${width / 2}" y="${height / 2}" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif" font-size="${fontSize}" font-weight="400" fill="white" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(width, height),
    anchor: new google.maps.Point(Math.floor(width / 2), height),
  }
}

function makeClusterSVG(count: number): string {
  const size = count < 10 ? 40 : count < 100 ? 44 : 48
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#1F1F1F"/>
    <text x="${size / 2}" y="${size / 2}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" font-weight="500" fill="white" text-anchor="middle" dominant-baseline="middle">${count}</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function formatMarkerPrice(price: number): string {
  const val = price >= 1_000_000
    ? `${(price / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    : `${Math.round(price / 1000)}K`
  return `from AED ${val}`
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function IconArea() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M4.27 20.18V5.26h15.83M4.27 5.60a.83.83 0 1 0 0-1.66.83.83 0 0 0 0 1.66ZM4.27 20.60a.83.83 0 1 0 0-1.67.83.83 0 0 0 0 1.67ZM20.10 5.60a.83.83 0 1 0 0-1.67.83.83 0 0 0 0 1.67ZM19.27 8.10v1.66M19.27 12.26v1.67M7.60 19.76h1.67M11.77 19.76h1.66M15.94 19.76h2.83a.28.28 0 0 0 .28-.28v-2.83M19.27 19.76v2" stroke="rgba(31,31,31,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function IconBath() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4A.6.6 0 0 1 3.6 13H21ZM21 13V7a4 4 0 0 0-4-4h-5M16 20l1 2M8 20l-1 2M12 3c-3.14 0-3.82 3.08-3.96 4.4A.6.6 0 0 0 8.6 8h6.8a.6.6 0 0 0 .6-.6C15.81 6.08 15.14 3 12 3Z" stroke="rgba(31,31,31,0.6)" strokeWidth="1.5"/>
    </svg>
  )
}
function IconBed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M4 12h16M4 12c-1.1 0-2 .9-2 2v4a1 1 0 0 0 1 1m1-7V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5m0 0c1.1 0 2 .9 2 2v4a1 1 0 0 1-1 1m-1 0H3m18 0v2M3 19v2m9-8v-2m0 2c0 .55-.45 1-1 1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1m0 2c0 .55.45 1 1 1h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1" stroke="rgba(31,31,31,0.6)" strokeWidth="1.5"/>
    </svg>
  )
}

// ── Popup card ─────────────────────────────────────────────────────────────────
function PopupCard({ prop, onClose }: { prop: MapProperty; onClose: () => void }) {
  return (
    <div className={s.popup}>
      {/* Close button — outside card, to the right on desktop */}
      <button className={s.popupClose} onClick={onClose} aria-label="Close">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <a href={`/resale/${prop.slug}`} className={s.popupCard}>
        <div className={s.popupMedia}>
          {prop.image
            ? <Image src={prop.image} alt={prop.title} fill className={s.popupImg} sizes="400px" />
            : <div className={s.popupImgPlaceholder} />
          }
          {prop.unitType && <span className={s.popupTag}>{prop.unitType}</span>}
          <button className={s.popupFav} onClick={e => e.preventDefault()} aria-label="Add to favourites">
            <Image src="/icons/icon-heart.svg" alt="" width={20} height={20} aria-hidden={true} />
          </button>
        </div>
        <div className={s.popupBody}>
          <p className={s.popupTitle}>{prop.title}</p>
          {prop.location && <p className={s.popupLocation}>{prop.location}</p>}
          <div className={s.popupSpecs}>
            {prop.area && (
              <span className={s.popupSpec}><IconArea />{Math.round(prop.area).toLocaleString('en-US')} Sq.ft</span>
            )}
            {prop.bathrooms !== undefined && (
              <span className={s.popupSpec}><IconBath />{prop.bathrooms}</span>
            )}
            {prop.bedrooms && (
              <span className={s.popupSpec}><IconBed />{prop.bedrooms}</span>
            )}
          </div>
          {prop.price != null && (
            <p className={s.popupPrice}>
              {Math.round(prop.price).toLocaleString('en-US')} <span className={s.popupPriceCurrency}>AED</span>
            </p>
          )}
        </div>
      </a>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ResaleMapView({ properties }: { properties: MapProperty[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const clustererRef = useRef<MarkerClusterer | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const activeMarkerRef = useRef<google.maps.Marker | null>(null)
  const activePropRef = useRef<MapProperty | null>(null)
  const [activeProperty, setActiveProperty] = useState<MapProperty | null>(null)

  const closePopup = useCallback(() => {
    if (activeMarkerRef.current && activePropRef.current) {
      const label = activePropRef.current.price != null
        ? formatMarkerPrice(activePropRef.current.price) : '—'
      activeMarkerRef.current.setIcon(makePriceIcon(label, false))
    }
    activeMarkerRef.current = null
    activePropRef.current = null
    setActiveProperty(null)
  }, [])

  const buildMarkers = useCallback((map: google.maps.Map, props: MapProperty[]) => {
    closePopup()

    // Destroy previous clusterer fully, then remove individual markers
    if (clustererRef.current) {
      clustererRef.current.clearMarkers()
      clustererRef.current = null
    }
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    const withCoords = props.filter(p => p.lat && p.lng)
    if (withCoords.length === 0) return

    const clusterRenderer = {
      render({ count, position }: { count: number; position: google.maps.LatLng }) {
        const size = count < 10 ? 40 : count < 100 ? 44 : 48
        return new google.maps.Marker({
          position,
          map,
          icon: {
            url: makeClusterSVG(count),
            scaledSize: new google.maps.Size(size, size),
            anchor: new google.maps.Point(size / 2, size / 2),
          },
          zIndex: 1000,
        })
      },
    }

    const gmMarkers: google.maps.Marker[] = withCoords.map(prop => {
      const label = prop.price != null ? formatMarkerPrice(prop.price) : '—'

      const marker = new google.maps.Marker({
        position: { lat: prop.lat!, lng: prop.lng! },
        icon: makePriceIcon(label, false),
        optimized: false,
      })

      marker.addListener('click', () => {
        if (activePropRef.current?.id === prop.id) { closePopup(); return }
        if (activeMarkerRef.current && activePropRef.current) {
          const prevLabel = activePropRef.current.price != null
            ? formatMarkerPrice(activePropRef.current.price) : '—'
          activeMarkerRef.current.setIcon(makePriceIcon(prevLabel, false))
        }
        marker.setIcon(makePriceIcon(label, true))
        activeMarkerRef.current = marker
        activePropRef.current = prop
        setActiveProperty(prop)
      })

      return marker
    })

    markersRef.current = gmMarkers
    clustererRef.current = new MarkerClusterer({ map, markers: gmMarkers, renderer: clusterRenderer })
  }, [closePopup])

  // Initialize map once
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_GOOGLE_MAPS_TOKEN
    if (!token || !containerRef.current) return

    let destroyed = false

    loadGoogleMaps(token).then(() => {
      if (destroyed || !containerRef.current) return

      const withCoords = properties.filter(p => p.lat && p.lng)
      const center = withCoords.length > 0
        ? { lat: withCoords[0].lat!, lng: withCoords[0].lng! }
        : { lat: 25.2048, lng: 55.2708 }

      const map = new google.maps.Map(containerRef.current!, {
        center,
        zoom: 11,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
      })

      mapRef.current = map
      map.addListener('click', () => closePopup())
      buildMarkers(map, properties)
    })

    return () => {
      destroyed = true
      clustererRef.current?.clearMarkers()
      markersRef.current.forEach(m => m.setMap(null))
      markersRef.current = []
      clustererRef.current = null
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers when properties change (skip initial render)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    if (!mapRef.current) return
    buildMarkers(mapRef.current, properties)
  }, [properties, buildMarkers])

  return (
    <div className={s.mapWrap}>
      <div ref={containerRef} className={s.mapCanvas} />
      {activeProperty && (
        <PopupCard prop={activeProperty} onClose={closePopup} />
      )}
    </div>
  )
}
