import Image from 'next/image'
import s from './SecondaryFloorPlan.module.scss'

interface Props {
  title?: string
  buttonText?: string
  layoutTitle?: string
  layoutDescription?: string
  images?: Array<{ url: string }> | null
}

export default function SecondaryFloorPlan({
  title = 'Floor plan',
  buttonText = 'Request Layout',
  layoutTitle = 'Layout on Request',
  layoutDescription = 'Get detailed layouts with exact areas, room dimensions, and available configurations.',
  images,
}: Props) {
  const hasImages = images && images.length > 0

  return (
    <section className={s.section}>
      {title && <h2 className={s.title}>{title}</h2>}

      {hasImages ? (
        <div className={s.card}>
          <Image
            src={images[0].url}
            alt={layoutTitle}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 800px"
            className={s.floorImage}
            style={{ width: '100%', height: 'auto', maxHeight: 500, objectFit: 'contain', display: 'block' }}
          />
        </div>
      ) : (
        <div className={s.card}>
          {/* Left: blurred placeholder with lock */}
          <div className={s.imageCol}>
            <Image
              src="/images/floor-plan-placeholder.webp"
              alt="Floor plan locked"
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={s.placeholderImg}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* Vertical divider */}
          <div className={s.divider} />

          {/* Right: text + button */}
          <div className={s.textCol}>
            <div className={s.textGroup}>
              {layoutTitle && <p className={s.layoutTitle}>{layoutTitle}</p>}
              {layoutDescription && (
                <p className={s.layoutDescription}>{layoutDescription}</p>
              )}
            </div>
            {buttonText && (
              <button className={s.requestBtn}>{buttonText}</button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
