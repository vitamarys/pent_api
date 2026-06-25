import React from 'react'
import { ChevronRight } from 'lucide-react'
import s from './SecondaryOverview.module.scss'

interface Props {
  sectionTitle?: string
  description?: string
  mainImage?: { url: string }
  additionalImages?: { url: string }[]
  ctaLabel?: string
  ctaHref?: string
  // From project:
  location?: string
  developer?: string
  developerHref?: string
  handover?: string
  paymentPlan?: string
  propertyTypes?: string
  bedrooms?: string
  floors?: string
  brandCollaboration?: string
}

export default function SecondaryOverview({
  sectionTitle = 'Project Overview',
  description,
  mainImage,
  additionalImages = [],
  ctaLabel = 'Go to Project page',
  ctaHref = '#',
  location,
  developer,
  developerHref,
  handover,
  paymentPlan,
  propertyTypes,
  bedrooms,
  floors,
  brandCollaboration,
}: Props) {
  const infoRows = [
    { label: 'Location',              value: location,           href: undefined        },
    { label: 'Developer',             value: developer,          href: developerHref    },
    { label: 'Handover',              value: handover,           href: undefined        },
    { label: 'Payment Plan',          value: paymentPlan,        href: undefined        },
    { label: 'Types',                 value: propertyTypes,      href: undefined        },
    { label: 'Bedrooms',              value: bedrooms,           href: undefined        },
    { label: 'Floors',                value: floors,             href: undefined        },
    { label: 'Brand Collaboration',   value: brandCollaboration, href: undefined        },
  ].filter((row) => !!row.value)

  return (
    <section className={s.section}>
      <div className={s.layout}>

        {/* ── LEFT: text panel ── */}
        <div className={s.leftPanel}>
          <h2 className={s.sectionTitle}>{sectionTitle}</h2>

          {description && <p className={s.description}>{description}</p>}

          {infoRows.length > 0 && (
            <div className={s.infoTable}>
              {infoRows.map(({ label, value, href }) => (
                <div key={label} className={s.infoRow}>
                  <span className={s.infoLabel}>{label}</span>
                  {href ? (
                    <a href={href} className={s.infoLink}>
                      {value}
                      <ChevronRight size={14} />
                    </a>
                  ) : (
                    <span className={s.infoValue}>{value}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <a href={ctaHref} className={s.ctaBtn}>
            {ctaLabel}
          </a>
        </div>

        {/* ── RIGHT: image grid ── */}
        <div className={s.imagePanel}>
          <div className={s.mainImageWrap}>
            {mainImage ? (
              <img src={mainImage.url} alt={sectionTitle} className={s.mainImage} />
            ) : (
              <div className={s.imagePlaceholder} />
            )}
          </div>

          {additionalImages.length > 0 && (
            <div className={s.additionalImages}>
              {additionalImages.slice(0, 2).map((img, i) => (
                <div key={i} className={s.additionalImageWrap}>
                  <img src={img.url} alt="" className={s.additionalImage} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
