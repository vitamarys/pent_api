import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import s from './HeroArea.module.scss'

export interface HeroAreaProps {
  title: string
  description: string
  image: string
  breadcrumb?: { label: string; href?: string }[]
  ctaLabel?: string
  ctaHref?: string
}

export default function HeroArea({
  title,
  description,
  image,
  breadcrumb = [],
  ctaLabel = 'Get Consultation',
  ctaHref = '/contact',
}: HeroAreaProps) {
  return (
    <section className={s.section}>
      {/* Background */}
      {image && (
        <img src={image} alt={title} className={s.bgImage} />
      )}

      {/* Top gradient overlay */}
      <div className={s.gradient} />

      {/* Content */}
      <div className={s.content}>
        <Container className={s.contentInner}>

          {/* Breadcrumbs */}
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={s.breadcrumbLink}>
              <Home size={16} strokeWidth={1.5} />
            </Link>
            {breadcrumb.map((item, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <ChevronRight size={16} className={s.breadcrumbChevron} strokeWidth={1.5} />
                {item.href ? (
                  <Link href={item.href} className={s.breadcrumbLink}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={s.breadcrumbCurrent}>{item.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Info card */}
          <div className={s.card}>
            <div className={s.cardText}>
              <h1 className={s.title}>{title}</h1>
              <p className={s.description}>{description}</p>
            </div>
            <Link href={ctaHref} className={s.ctaBtn}>
              {ctaLabel}
            </Link>
          </div>

        </Container>
      </div>
    </section>
  )
}
