'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import s from './SecondaryDetails.module.scss'

interface Props {
  readMoreText?: string
  readLessText?: string
  locationLabel?: string
  developerLabel?: string
  typeOfPropertyLabel?: string
  furnishingLabel?: string
  floorsLabel?: string
  propertyStatusLabel?: string
  title?: string
  descriptionHtml?: string
  location?: string
  developer?: string
  propertyType?: string
  furnishing?: string
  floor?: string
  propertyStatus?: string
}

export default function SecondaryDetails({
  readMoreText = 'Read more',
  readLessText = 'Read less',
  locationLabel = 'Location',
  developerLabel = 'Developer',
  typeOfPropertyLabel = 'Type of property',
  furnishingLabel = 'Furnishing',
  floorsLabel = 'Floors',
  propertyStatusLabel = 'Property status',
  title,
  descriptionHtml,
  location,
  developer,
  propertyType,
  furnishing,
  floor,
  propertyStatus,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const rows: { label: string; value: string; isLink?: boolean }[] = [
    ...(location ? [{ label: locationLabel, value: location, isLink: true }] : []),
    ...(developer ? [{ label: developerLabel, value: developer, isLink: true }] : []),
    ...(propertyType ? [{ label: typeOfPropertyLabel, value: propertyType }] : []),
    ...(furnishing ? [{ label: furnishingLabel, value: furnishing }] : []),
    ...(floor ? [{ label: floorsLabel, value: floor }] : []),
    ...(propertyStatus ? [{ label: propertyStatusLabel, value: propertyStatus }] : []),
  ]

  if (!title && rows.length === 0 && !descriptionHtml) return null

  return (
    <section className={s.section}>
      {title && <h2 className={s.title}>{title}</h2>}

      {rows.length > 0 && (
        <div className={s.table}>
          {rows.map(({ label, value, isLink }, i) => (
            <div key={label} className={`${s.row} ${i === 0 ? s.rowFirst : ''}`}>
              <span className={s.rowLabel}>{label}</span>
              {isLink ? (
                <span className={s.rowValueLink}>
                  {value}
                  <ChevronRight size={16} />
                </span>
              ) : (
                <span className={s.rowValue}>{value}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {descriptionHtml && (
        <div className={s.descBlock}>
          <div className={`${s.desc} ${expanded ? s.descExpanded : ''}`}>
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
          {!expanded && <div className={s.descFade} />}
          <button className={s.toggleBtn} onClick={() => setExpanded((v) => !v)}>
            {expanded ? readLessText : readMoreText}
            <span className={s.toggleIcon}>{expanded ? '−' : '+'}</span>
          </button>
        </div>
      )}
    </section>
  )
}
