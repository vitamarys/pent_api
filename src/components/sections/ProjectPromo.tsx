import Container from "@/components/ui/Container";
import s from "./ProjectPromo.module.scss";

export interface ProjectPromoProps {
  titleHighlight: string;
  titleRest: string;
  description: string;
  bg?: 'beige' | 'white';
}

export default function ProjectPromo({
  titleHighlight,
  titleRest,
  description,
  bg = 'beige',
}: ProjectPromoProps) {
  return (
    <section className={`${s.section} ${bg === 'white' ? s.sectionWhite : ''}`}>
      <Container>
        <div className={s.inner}>
          <h2 className={s.title} data-anim="heading" suppressHydrationWarning>
            <span className={s.highlight}>{titleHighlight} </span>
            {titleRest}
          </h2>
          <p className={s.description} data-anim="text" suppressHydrationWarning>{description}</p>
        </div>
      </Container>
    </section>
  );
}
