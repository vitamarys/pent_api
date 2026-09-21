import Container from "@/components/ui/Container";
import s from "./ProjectKeys.module.scss";

export interface KeyPoint {
  title: string;
  description: string;
}

export interface ProjectKeysProps {
  sectionTitle?: string;
  points: KeyPoint[];
}

export default function ProjectKeys({
  sectionTitle = "Key points of the project",
  points,
}: ProjectKeysProps) {
  return (
    <section className={s.section}>
      <Container>
        <h2 className={s.sectionTitle} data-anim="heading" suppressHydrationWarning>{sectionTitle}</h2>
        <div className={s.cards} data-anim-stagger="" suppressHydrationWarning>
          {points.map((point, i) => (
            <div key={i} className={s.card} data-anim="stagger" suppressHydrationWarning>
              <div className={s.cardHeader}>
                <span className={s.dot} />
                <p className={s.cardTitle}>{point.title}</p>
              </div>
              <p className={s.cardDescription}>{point.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
