import Container from "@/components/ui/Container";
import s from "./ProjectBrand.module.scss";

export interface ProjectBrandProps {
  devName: string;
  description: string;
  logo?: string;
  logoText?: string;
  image: string;
}

export default function ProjectBrand({
  devName,
  description,
  logo,
  logoText,
  image,
}: ProjectBrandProps) {
  return (
    <section className={s.section}>

      {/* Full-bleed background — desktop only */}
      <div className={s.bg} style={{ backgroundImage: `url(${image})` }}>
        <div className={s.bgOverlay} />
      </div>

      {/* Stacked image — tablet/mobile only */}
      <div className={s.imageStack}>
        {image && <img src={image} alt={devName} />}
      </div>

      {/* Card */}
      <Container>
        <div className={s.cardWrap}>
        <div className={s.card}>
          {(logo || logoText) && (
            <div className={s.logoBadge}>
              {logo
                ? <img src={logo} alt={devName} className={s.logo} />
                : <span className={s.logoText}>{logoText}</span>
              }
            </div>
          )}
          <div className={s.textContent}>
            <h2 className={s.devName}>{devName}</h2>
            <p className={s.description}>{description}</p>
          </div>
        </div>
        </div>
      </Container>

    </section>
  );
}
