import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { DescriptionExpander } from './DescriptionExpander'
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
  locationHref?: string
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
  locationHref,
  developer,
  propertyType,
  furnishing,
  floor,
  propertyStatus,
}: Props) {
  const rows: { label: string; value: string; href?: string }[] = [
    ...(location ? [{ label: locationLabel, value: location, href: locationHref }] : []),
    ...(developer ? [{ label: developerLabel, value: developer }] : []),
    ...(propertyType ? [{ label: typeOfPropertyLabel, value: propertyType }] : []),
    ...(furnishing ? [{ label: furnishingLabel, value: furnishing }] : []),
    ...(floor ? [{ label: floorsLabel, value: floor }] : []),
    ...(propertyStatus ? [{ label: propertyStatusLabel, value: propertyStatus }] : []),
  ]

  if (!title && rows.length === 0 && !descriptionHtml) return null

  return (
    <section className={s.section}>
      {title && <h2 className={s.title} data-anim="heading">{title}</h2>}

      {rows.length > 0 && (
        <div className={s.table}>
          {rows.map(({ label, value, href }, i) => (
            <div key={label} className={`${s.row} ${i === 0 ? s.rowFirst : ''}`}>
              <span className={s.rowLabel}>{label}</span>
              {href ? (
                <Link href={href} className={s.rowValueLink}>
                  {value}
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <span className={s.rowValue}>{value}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {descriptionHtml && (
        <DescriptionExpander
          html={descriptionHtml}
          readMoreText={readMoreText}
          readLessText={readLessText}
        />
      )}
    </section>
  )
}
