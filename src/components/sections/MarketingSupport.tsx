import Container from '@/components/ui/Container';
import s from './MarketingSupport.module.scss';

export interface MarketingSupportItem {
  number: string;
  title: string;
}

export interface MarketingSupportProps {
  sectionTitle?: string;
  description?: string;
  items: MarketingSupportItem[];
}

export default function MarketingSupport({
  sectionTitle = 'Strongest marketing Support',
  description,
  items,
}: MarketingSupportProps) {
  if (!items?.length) return null;

  return (
    <section className={s.section}>
      <div className={s.ellipse} aria-hidden />
      <Container>
        <div className={s.header}>
          <h2 className={s.title} data-anim="heading">{sectionTitle}</h2>
          {description && <p className={s.desc} data-anim="text">{description}</p>}
        </div>

        <div className={s.grid} data-anim-stagger="">
          {items.map((item, i) => (
            <div key={i} className={s.card} data-anim="stagger">
              <span className={s.number}>{item.number}</span>
              <p className={s.cardTitle}>{item.title}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
