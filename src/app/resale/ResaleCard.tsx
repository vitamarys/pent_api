'use client'

import Link from 'next/link'
import s from './ResaleCard.module.scss'

export interface ResaleCardProps {
  slug: string
  title: string
  price?: number
  area?: number
  bedrooms?: string
  bathrooms?: number
  unitType?: string
  location?: string
  images?: string[]
}

function IconArea() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path d="M4.26953 20.1784V5.26172C4.26953 4.98558 4.26953 4.76172 4.26953 4.76172H20.1029M20.1029 4.76172C20.1029 5.22195 19.7298 5.59505 19.2695 5.59505C18.8093 5.59505 18.4362 5.22195 18.4362 4.76172C18.4362 4.30149 18.8093 3.92839 19.2695 3.92839C19.7298 3.92839 20.1029 4.30149 20.1029 4.76172ZM15.9362 19.7617H18.7695C19.0457 19.7617 19.2695 19.5379 19.2695 19.2617V16.4284M19.2695 8.09505V9.76172M19.2695 12.2617V13.9284M7.60286 19.7617H9.26953M11.7695 19.7617H13.4362M4.26953 5.59505C4.72976 5.59505 5.10286 5.22195 5.10286 4.76172C5.10286 4.30149 4.72976 3.92839 4.26953 3.92839C3.8093 3.92839 3.4362 4.30149 3.4362 4.76172C3.4362 5.22195 3.8093 5.59505 4.26953 5.59505ZM4.26953 20.5951C4.72976 20.5951 5.10286 20.222 5.10286 19.7617C5.10286 19.3015 4.72976 18.9284 4.26953 18.9284C3.8093 18.9284 3.4362 19.3015 3.4362 19.7617C3.4362 20.222 3.8093 20.5951 4.26953 20.5951Z" stroke="rgba(31,31,31,0.7)" strokeWidth="1.5"/>
    </svg>
  )
}

function IconBath() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path d="M21 13V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V13.6C3 13.2686 3.26863 13 3.6 13H21ZM21 13V7C21 4.79086 19.2091 3 17 3H12M16 20L17 22M8 20L7 22M12 3C8.86312 3 8.18624 6.07539 8.04019 7.4023C8.00393 7.7317 8.26865 8 8.60003 8H15.4C15.7314 8 15.9961 7.73169 15.9598 7.4023C15.8138 6.07539 15.1369 3 12 3Z" stroke="rgba(31,31,31,0.7)" strokeWidth="1.5"/>
    </svg>
  )
}

function IconBed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path d="M4 12H20M4 12C2.89543 12 2 12.8954 2 14V18C2 18.5523 2.44772 19 3 19M4 12V7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V12M20 12C21.1046 12 22 12.8954 22 14V18C22 18.5523 21.5523 19 21 19M21 19H3M21 19V21M3 19V21M12 11V9.00001M12 11C12 11.5523 11.5523 12 11 12H8C7.44772 12 7 11.5523 7 11V9.00001C7 8.44773 7.44772 8.00001 8 8.00001H11C11.5523 8.00001 12 8.44773 12 9.00001M12 11C12 11.5523 12.4477 12 13 12H16C16.5523 12 17 11.5523 17 11V9.00001C17 8.44773 16.5523 8.00001 16 8.00001H13C12.4477 8.00001 12 8.44773 12 9.00001" stroke="rgba(31,31,31,0.7)" strokeWidth="1.5"/>
    </svg>
  )
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.4242 7.23927L12 7.67003L11.5757 7.2392C10.8021 6.45332 9.74553 6.01077 8.64279 6.01077C7.54006 6.01077 6.48345 6.45332 5.70987 7.2392C4.09674 8.89691 4.09674 11.5376 5.70987 13.1954L10.2037 17.7584C10.6775 18.2397 11.3247 18.5107 12 18.5107C12.6754 18.5107 13.3225 18.2397 13.7963 17.7584L18.2902 13.1954C19.9033 11.5377 19.9033 8.89699 18.2902 7.23928C17.5166 6.45337 16.46 6.0108 15.3572 6.0108C14.2545 6.0108 13.1978 6.45336 12.4242 7.23927Z" stroke="white" strokeWidth="1.5"/>
    </svg>
  )
}

export default function ResaleCard({ slug, title, price, area, bedrooms, bathrooms, unitType, location, images = [] }: ResaleCardProps) {
  const firstImage = images[0] ?? null

  const formattedPrice = price !== undefined
    ? price.toLocaleString('en-US') + ' AED'
    : null

  return (
    <Link href={`/resale/${slug}`} className={s.card}>
      {/* ── Media ── */}
      <div className={s.media}>
        {firstImage ? (
          <img src={firstImage} alt={title} className={s.img} />
        ) : (
          <div className={s.imgPlaceholder} />
        )}

        <div className={s.overlay}>
          {/* Top row: type tag + favorites */}
          <div className={s.topRow}>
            <div className={s.tagContainer}>
              {unitType && (
                <div className={s.tag}>
                  <span>{unitType}</span>
                </div>
              )}
            </div>
            <button
              className={s.favBtn}
              onClick={(e) => e.preventDefault()}
              aria-label="Add to favourites"
            >
              <IconHeart />
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={s.body}>
        {/* Property info */}
        <div className={s.propertyInfo}>
          <p className={s.title}>{title}</p>
          {location && <p className={s.location}>{location}</p>}
        </div>

        {/* Specs + Price */}
        <div className={s.bottomContainer}>
          {(area || bathrooms !== undefined || bedrooms) && (
            <div className={s.specs}>
              {area && (
                <div className={s.spec}>
                  <IconArea />
                  <span>{area.toLocaleString('en-US')} Sq.ft</span>
                </div>
              )}
              {bathrooms !== undefined && (
                <div className={s.spec}>
                  <IconBath />
                  <span>{bathrooms}</span>
                </div>
              )}
              {bedrooms && (
                <div className={s.spec}>
                  <IconBed />
                  <span>{bedrooms}</span>
                </div>
              )}
            </div>
          )}

          {formattedPrice && (
            <div className={s.priceRow}>
              <p className={s.price}>{formattedPrice}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
