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
          <img
            src={images[0].url}
            alt={layoutTitle}
            className={s.floorImage}
          />
        </div>
      ) : (
        <div className={s.card}>
          {/* Left: blurred placeholder with lock */}
          <div className={s.imageCol}>
            <img
              src="/images/floor-plan-placeholder.png"
              alt="Floor plan locked"
              className={s.placeholderImg}
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
