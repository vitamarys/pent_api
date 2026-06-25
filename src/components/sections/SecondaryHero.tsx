'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Lock, MapPin, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import s from './SecondaryHero.module.scss'

interface Props {
  subtitle?: string
  description?: string
  images?: { url: string }[]
  amenities?: { label: string; image?: { url: string } }[]
  amenityImage?: { url: string }
  agent?: { name: string; role?: string; image?: { url: string } }
  floorPlanCtaLabel?: string
  // From project-level fields:
  price?: number
  pricePerSqft?: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  parking?: number
  location?: string
  propertyType?: string
  furnishing?: string
  floorsInfo?: string
  propertyStatus?: string
}

const DETAILS_LABELS = [
  { key: 'location',       label: 'Location'    },
  { key: 'propertyType',   label: 'Type'        },
  { key: 'furnishing',     label: 'Furnishing'  },
  { key: 'floorsInfo',     label: 'Floors'      },
  { key: 'propertyStatus', label: 'Status'      },
]

export default function SecondaryHero({
  subtitle,
  description,
  images = [],
  amenities = [],
  amenityImage,
  agent,
  floorPlanCtaLabel = 'Request Layout',
  price,
  pricePerSqft,
  area,
  bedrooms,
  bathrooms,
  parking,
  location,
  propertyType,
  furnishing,
  floorsInfo,
  propertyStatus,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const hasImages = images.length > 0

  function prev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }
  function next() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  const detailValues: Record<string, string | undefined> = {
    location,
    propertyType,
    furnishing,
    floorsInfo,
    propertyStatus,
  }

  const sidebarRows = [
    { label: 'Price per Sq.ft', value: pricePerSqft ? formatPrice(pricePerSqft) : undefined },
    { label: 'Area Sq.ft',      value: area ? `${area.toLocaleString('en-AE')} sq.ft` : undefined },
    { label: 'Bedrooms',        value: bedrooms != null ? String(bedrooms) : undefined },
    { label: 'Bathrooms',       value: bathrooms != null ? String(bathrooms) : undefined },
    { label: 'Parking',         value: parking != null ? String(parking) : undefined },
  ]

  return (
    <section className={s.section}>
      <div className={s.layout}>

        {/* ── LEFT COLUMN ── */}
        <div className={s.leftCol}>

          {/* Gallery */}
          <div className={s.gallery}>
            {hasImages ? (
              images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={subtitle ?? 'Property photo'}
                  className={`${s.galleryImage} ${i === activeIndex ? s.galleryImageActive : ''}`}
                />
              ))
            ) : (
              <div className={s.galleryPlaceholder} />
            )}

            {/* Top-left overlay buttons */}
            <div className={s.galleryBtns}>
              <button className={s.galleryBtn}>
                <span className={s.galleryBtnDot} />
                {images.length} photos
              </button>
              <button className={s.galleryBtn}>3D tour</button>
              <button className={s.galleryBtn}>▶ Play video</button>
            </div>

            {/* Arrow navigation */}
            {images.length > 1 && (
              <div className={s.galleryNav}>
                <button className={s.navArrow} onClick={prev} aria-label="Previous photo">
                  <ChevronLeft size={20} />
                </button>
                <button className={s.navArrow} onClick={next} aria-label="Next photo">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Pagination dots */}
            {images.length > 1 && (
              <div className={s.pagination}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`${s.dot} ${i === activeIndex ? s.dotActive : ''}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && <h3 className={s.subtitle}>{subtitle}</h3>}

          {/* Details table */}
          <div className={s.detailsTable}>
            {DETAILS_LABELS.map(({ key, label }) => {
              const val = detailValues[key]
              if (!val) return null
              return (
                <div key={key} className={s.detailRow}>
                  <span className={s.detailLabel}>{label}</span>
                  {key === 'location' ? (
                    <a href="#location" className={s.locationLink}>
                      <MapPin size={14} />
                      {val}
                    </a>
                  ) : (
                    <span className={s.detailValue}>{val}</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Description with read more */}
          {description && (
            <div className={s.descriptionBlock}>
              <div className={`${s.description} ${expanded ? s.descriptionExpanded : ''}`}>
                <p>{description}</p>
              </div>
              <button
                className={s.readMoreBtn}
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            </div>
          )}

          {/* Floor plan block */}
          <div className={s.floorPlan}>
            <div className={s.floorPlanLocked}>
              <Lock size={24} className={s.lockIcon} />
              <span className={s.floorPlanText}>Layout on Request</span>
            </div>
            <button className={s.floorPlanCta}>{floorPlanCtaLabel}</button>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className={s.amenitiesSection}>
              <h4 className={s.amenitiesTitle}>Amenities</h4>
              <div className={s.amenitiesLayout}>
                <ul className={s.amenitiesList}>
                  {amenities.map((item, i) => (
                    <li key={i} className={s.amenityItem}>
                      <span className={s.amenityDot} />
                      {item.label}
                    </li>
                  ))}
                </ul>
                {amenityImage && (
                  <div className={s.amenityImageWrap}>
                    <img src={amenityImage.url} alt="Amenities" className={s.amenityImage} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className={s.sidebar}>
          {/* Price */}
          <div className={s.sidebarPriceBlock}>
            <span className={s.priceLabel}>Price</span>
            {price != null && (
              <span className={s.sidebarPrice}>{formatPrice(price)}</span>
            )}
          </div>

          {/* Details table */}
          <div className={s.sidebarDetails}>
            {sidebarRows.map(({ label, value }) =>
              value ? (
                <div key={label} className={s.sidebarRow}>
                  <span className={s.sidebarLabel}>{label}</span>
                  <span className={s.sidebarValue}>{value}</span>
                </div>
              ) : null
            )}
          </div>

          {/* Agent card */}
          {agent && (
            <div className={s.agentCard}>
              <div className={s.agentAvatarWrap}>
                {agent.image ? (
                  <img src={agent.image.url} alt={agent.name} className={s.agentAvatar} />
                ) : (
                  <div className={s.agentAvatarFallback}>
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className={s.agentInfo}>
                <span className={s.agentName}>{agent.name}</span>
                {agent.role && <span className={s.agentRole}>{agent.role}</span>}
                <div className={s.agentStars}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={12} className={s.starIcon} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <button className={s.ctaBtn}>Request Availability</button>
        </aside>
      </div>
    </section>
  )
}
