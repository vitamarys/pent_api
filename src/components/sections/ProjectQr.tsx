import Container from '@/components/ui/Container'
import s from './ProjectQr.module.scss'

interface Props {
  tagLabel?: string
  description?: string
  qrUrl?: string | null
}

export default function ProjectQr({
  tagLabel = 'DLD Verified',
  description = "This project has been verified in partnership with the Dubai Land Department's (DLD) Real Estate Regulatory Agency (RERA)",
  qrUrl,
}: Props) {
  return (
    <section className={s.section}>
      <Container>
        <div className={s.card}>
          <div className={s.body}>
            <span className={s.tag}>{tagLabel}</span>
            <p className={s.description}>{description}</p>
          </div>

          {qrUrl && (
            <div className={s.qrWrap}>
              <img src={qrUrl} alt="QR code" className={s.qrImg} />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
