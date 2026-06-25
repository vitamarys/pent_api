import Container from "@/components/ui/Container";
import s from "./ProjectGuide.module.scss";

export interface ProjectGuideProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  image: string;
}

export default function ProjectGuide({
  title = "Get professional property guidance",
  description = "Leave your details, and an advisor will help you choose the right property and navigate the purchase process.",
  buttonLabel = "Learn more",
  image,
}: ProjectGuideProps) {
  return (
    <section className={s.section}>
      <Container>
        <div className={s.banner} style={{ backgroundImage: `url(${image})` }}>
          <div className={s.overlay} />
          <div className={s.content}>
            <h2 className={s.title}>{title}</h2>
            <p className={s.description}>{description}</p>
            <button className={s.btn}>{buttonLabel}</button>
          </div>
        </div>
      </Container>
    </section>
  );
}
