import Link from 'next/link'
import Container from '@/components/ui/Container'
import s from './ArticleHero.module.scss'
import { Home } from 'lucide-react'

interface ArticleHeroProps {
  title: string
  summary?: string
  category?: string
  date?: string
  timeToRead?: string
  heroImage?: string
  breadcrumb?: Array<{ label: string; href?: string }>
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export default function ArticleHero({
  title,
  summary,
  category,
  date,
  timeToRead,
  heroImage,
  breadcrumb = [],
}: ArticleHeroProps) {
  return (
    <div className={s.hero}>
      <Container className={s.inner}>
        {breadcrumb.length > 0 && (
          <nav className={s.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/" className={s.breadHome}><Home size={16} /></Link>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className={s.breadItem}>
                <svg className={s.breadArrow} width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {crumb.href ? (
                  <Link href={crumb.href} className={s.breadLink}>{crumb.label}</Link>
                ) : (
                  <span className={s.breadCurrent}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className={s.content}>
          <div className={s.titleGroup}>
            <h1 className={s.title}>{title}</h1>
          </div>
          {summary && (
            <p className={s.summary}>{summary}</p>
          )}
        </div>

        <div className={s.meta}>
          {category && (
            <span className={s.tag}>{category}</span>
          )}
          <div className={s.specs}>
            {date && <span>{formatDate(date)}</span>}
            {date && timeToRead && <span className={s.dot} aria-hidden="true" />}
            {timeToRead && <span>{timeToRead}</span>}
          </div>
        </div>
      </Container>

      {heroImage && (
        <div className={s.imageWrap}>
          <img src={heroImage} alt={title} className={s.image} />
        </div>
      )}
    </div>
  )
}
