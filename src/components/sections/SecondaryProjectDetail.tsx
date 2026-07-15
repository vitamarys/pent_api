import type { SecondaryPropertyDld } from '@/types/penthouse-api'
import s from './SecondaryProjectDetail.module.scss'

interface Props {
  title?: string
  unitReferenceLabel?: string
  purposeLabel?: string
  statusLabel?: string
  emirateLabel?: string
  propertyNameLabel?: string
  addedOnLabel?: string
  dldLabel?: string
  dldText?: string
  unitReference?: string
  purpose?: string
  status?: string
  emirate?: string
  propertyName?: string
  addedOn?: string
  permitNumber?: string
  dld?: SecondaryPropertyDld | null
}

export default function SecondaryProjectDetail({
  title = 'Project Details',
  unitReferenceLabel = 'Unit Reference No.',
  purposeLabel = 'Purpose',
  statusLabel = 'Status',
  emirateLabel = 'Emirate',
  propertyNameLabel = 'Property Name',
  addedOnLabel = 'Added On',
  dldLabel = 'DLD Verified',
  dldText,
  unitReference,
  purpose,
  status,
  emirate,
  propertyName,
  addedOn,
  permitNumber,
  dld,
}: Props) {
  const rows = [
    { label: unitReferenceLabel, value: unitReference },
    { label: purposeLabel, value: purpose },
    { label: statusLabel, value: status },
    { label: emirateLabel, value: emirate },
    { label: propertyNameLabel, value: propertyName },
    { label: addedOnLabel, value: addedOn },
    ...(permitNumber ? [{ label: 'Permit No.', value: permitNumber }] : []),
  ].filter((r) => r.value)

  return (
    <section className={s.section}>
      <div className={s.card}>
        {/* Left: title + rows */}
        <div className={s.leftCol}>
          {title && <h2 className={s.title}>{title}</h2>}
          {rows.length > 0 && (
            <div className={s.rows}>
              {rows.map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`${s.row} ${i === rows.length - 1 ? s.rowLast : ''}`}
                >
                  <span className={s.rowLabel}>{label}</span>
                  <span className={s.rowValue}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vertical divider */}
        {dld && <div className={s.divider} />}

        {/* Right: DLD verification */}
        {dld && (
          <div className={s.rightCol}>
            <div className={s.dldTag}>DLD Verified</div>
            <div className={s.dldContent}>
              {dld.qrcodeUrl && (
                <div className={s.qrWrap}>
                  <img src={dld.qrcodeUrl} alt="DLD QR Code" className={s.qrImg} />
                </div>
              )}
              {dldText && <p className={s.dldText}>{dldText}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
