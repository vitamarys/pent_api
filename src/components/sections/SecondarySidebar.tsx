'use client'

import { Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import s from './SecondarySidebar.module.scss'

interface Props {
  price?: number
  pricePerSqft?: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  parking?: number
  agent?: { name: string; role?: string; image?: { url: string }; phone?: string }
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9268 10.9315C11.4637 11.8027 12.197 12.536 13.0682 13.0729L13.89 12.5798C14.2485 12.3647 14.7028 12.3953 15.0292 12.6564L16.6243 13.9325C16.8476 14.1111 16.9838 14.3768 16.9984 14.6623C17.013 14.9479 16.9046 15.226 16.7007 15.4265L15.9796 16.1355C14.9863 17.115 13.4491 17.2808 12.2697 16.5358C10.3461 15.2916 8.70814 13.6536 7.46394 11.73C6.71886 10.5506 6.88474 9.01332 7.86424 8.02002L8.57324 7.29891C8.7737 7.09503 9.05184 6.9867 9.33739 7.00131C9.62294 7.01591 9.88858 7.15205 10.0672 7.37532L11.3433 8.97044C11.6044 9.29684 11.6349 9.7512 11.4199 10.1096L10.9268 10.9315Z" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.86809 19.9865L4.1711 20.4372C4.00291 20.4653 3.83152 20.4104 3.71096 20.2898C3.59039 20.1692 3.5355 19.9978 3.5636 19.8296L4.0142 17.1325C1.3825 13.0424 2.25794 7.62611 6.04416 4.57331C9.83038 1.52052 15.3091 1.81347 18.7482 5.25261C22.1873 8.69175 22.4802 14.1705 19.4273 17.9567C16.3745 21.7428 10.9582 22.6182 6.86809 19.9865Z" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function SecondarySidebar({
  price,
  pricePerSqft,
  area,
  bedrooms,
  bathrooms,
  parking,
  agent,
}: Props) {
  const specRows = [
    { label: 'Price per Sq.ft', value: pricePerSqft != null ? formatPrice(pricePerSqft) : undefined },
    { label: 'Area Sq.ft',      value: area != null ? `${area.toLocaleString('en-AE')} sq.ft` : undefined },
    { label: 'Bedrooms',        value: bedrooms != null ? String(bedrooms) : undefined },
    { label: 'Bathroom',        value: bathrooms != null ? String(bathrooms) : undefined },
    { label: 'Parking',         value: parking != null ? String(parking) : undefined },
  ]

  const visibleRows = specRows.filter((r) => r.value != null)

  return (
    <aside className={s.sidebar}>
      {/* Price block */}
      <div className={s.priceBlock}>
        <span className={s.priceLabel}>Price</span>
        {price != null && (
          <span className={s.priceValue}>{formatPrice(price)}</span>
        )}
      </div>

      {/* Specs table */}
      {visibleRows.length > 0 && (
        <div className={s.specsTable}>
          {visibleRows.map(({ label, value }) => (
            <div key={label} className={s.specRow}>
              <span className={s.specLabel}>{label}</span>
              <span className={s.specValue}>{value}</span>
            </div>
          ))}
        </div>
      )}

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
                <Star key={n} size={14} className={s.starIcon} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA row */}
      <div className={s.ctaRow}>
        <button className={s.ctaBtnPrimary}>Request Availability</button>
        {agent?.phone ? (
          <a
            href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={s.ctaBtnWhatsapp}
            aria-label="Contact via WhatsApp"
          >
            <span className={s.whatsappIcon}><WhatsAppIcon /></span>
            WhatsApp
          </a>
        ) : (
          <button className={s.ctaBtnWhatsapp} aria-label="Contact via WhatsApp">
            <span className={s.whatsappIcon}><WhatsAppIcon /></span>
            WhatsApp
          </button>
        )}
      </div>
    </aside>
  )
}
