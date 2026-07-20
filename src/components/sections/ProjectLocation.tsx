import React from 'react'
import { MapPin } from 'lucide-react'
import s from './ProjectLocation.module.scss'

interface ProximityItem {
  id?: number
  label: string
  value: string
}

interface Props {
  sectionTitle?: string
  description?: string
  mapUrl?: string
  address?: string
  proximity?: ProximityItem[]
  ctaLabel?: string
  ctaHref?: string
  lat?: number
  lng?: number
}

export default function ProjectLocation({
  sectionTitle = 'Location',
  description,
  mapUrl,
  address,
  proximity = [],
  ctaLabel,
  ctaHref,
  lat,
  lng,
}: Props) {
  const directionsUrl = lat && lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : undefined
  return (
    <section className={s.section}>
      <div className={s.layout}>

        {/* ── LEFT PANEL ── */}
        <div className={s.leftPanel}>
          <div className={s.leftContent}>
            <div className={s.textBlock}>
              <h2 className={s.title}>{sectionTitle}</h2>
              {description && <p className={s.description}>{description}</p>}
            </div>

            {proximity.length > 0 && (
              <div className={s.proximityTable}>
                {proximity.map((item, i) => (
                  <div key={item.id ?? i} className={s.proximityRow}>
                    <span className={s.proximityLabel}>{item.label}</span>
                    <span className={s.proximityValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {address && (
              <div className={s.address}>
                <MapPin size={14} className={s.addressIcon} />
                <span>{address}</span>
              </div>
            )}
          </div>

          <div className={s.ctaRow}>
            {ctaLabel && (
              <a href={ctaHref ?? '#'} className={s.cta}>
                {ctaLabel}
              </a>
            )}
            {directionsUrl && (
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={s.directions}>
                <MapPin size={16} />
                Get Directions
              </a>
            )}
          </div>
        </div>

        {/* ── MAP ── */}
        <div className={s.mapWrap}>
          {mapUrl ? (
            <iframe
              src={mapUrl}
              className={s.mapIframe}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={sectionTitle}
            />
          ) : (
            <div className={s.mapPlaceholder}>
              <MapPin size={40} className={s.mapPlaceholderIcon} />
              {address && <span className={s.mapPlaceholderText}>{address}</span>}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
