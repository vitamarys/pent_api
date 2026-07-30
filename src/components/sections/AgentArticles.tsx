'use client'

import Link from 'next/link'
import Container from '@/components/ui/Container'
import type { NewsItem } from '@/components/sections/NewsSlider'
import s from './AgentArticles.module.scss'

function ArticleCard({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href ?? `/news/${item.slug}`} className={s.card}>
      <div className={s.cardImage}>
        {item.image && <img src={item.image} alt={item.title} className={s.cardImg} />}
        {item.tag && <div className={s.cardTag}>{item.tag}</div>}
      </div>
      <div className={s.cardBody}>
        <p className={s.cardTitle}>{item.title}</p>
        <div className={s.cardMeta}>
          {item.excerpt && <p className={s.cardExcerpt}>{item.excerpt}</p>}
          <div className={s.cardInfo}>
            <span>{item.date}</span>
            {item.readTime && (
              <>
                <span className={s.dot} aria-hidden="true" />
                <span>{item.readTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface AgentArticlesProps {
  items: NewsItem[]
  title: string
}

export default function AgentArticles({ items, title }: AgentArticlesProps) {
  if (items.length === 0) return null

  return (
    <section className={s.section}>
      <Container>
        <h2 className={s.title}>{title}</h2>
        <div className={s.grid}>
          {items.map(item => (
            <ArticleCard key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </section>
  )
}
