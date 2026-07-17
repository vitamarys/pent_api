'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import PopConsultation from '@/components/ui/PopConsultation';
import s from './SellHero.module.scss';

export interface SellHeroBreadcrumb {
  label: string;
  href?: string;
}

export interface SellHeroProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  bgImage?: string;
  breadcrumbs?: SellHeroBreadcrumb[];
}

function Breadcrumbs({ items }: { items: SellHeroBreadcrumb[] }) {
  return (
    <nav className={s.breadcrumbs} aria-label="Breadcrumb">
      <Link href="/" className={s.breadcrumbHome} aria-label="Home">
        <Image src="/icons/icon-home-w.svg" alt="Home" width={16} height={16} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className={s.breadcrumbItem}>
          <ChevronRight size={16} strokeWidth={1.5} className={s.breadcrumbSep} />
          {item.href ? (
            <Link href={item.href} className={i === items.length - 1 ? s.breadcrumbCurrent : s.breadcrumbLink}>
              {item.label}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? s.breadcrumbCurrent : s.breadcrumbLink}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function SellHero({
  title = 'Sell Your Luxury Property with Penthouse.ae',
  description = "Guaranteeing a seamless, confidential, and lucrative transaction targeted at Dubai's luxury demand",
  ctaLabel = 'Get Consultation',
  bgImage,
  breadcrumbs = [],
}: SellHeroProps) {
  const [popOpen, setPopOpen] = useState(false);

  return (
    <>
      <section
        className={s.hero}
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
      >
        <div className={s.overlay} />

        <Container className={s.containerFull}>
          {breadcrumbs.length > 0 && (
            <div className={s.breadcrumbsOuter}>
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}

          <div className={s.panelWrap}>
            <div className={s.panel}>
              {breadcrumbs.length > 0 && (
                <div className={s.breadcrumbsInner}>
                  <Breadcrumbs items={breadcrumbs} />
                </div>
              )}

              <div className={s.content}>
                <h1 className={s.title}>{title}</h1>
                <p className={s.desc}>{description}</p>
                <button className={s.cta} onClick={() => setPopOpen(true)}>
                  {ctaLabel}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <PopConsultation open={popOpen} onClose={() => setPopOpen(false)} />
    </>
  );
}
