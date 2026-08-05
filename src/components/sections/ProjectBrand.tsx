import Image from 'next/image'
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
        {image && <Image src={image} alt={devName} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />}
      </div>

      {/* Card */}
      <Container className={s.container}>
        <div className={s.cardWrap}>
        <div className={s.card}>
          {(logo || logoText) && (
            <div className={s.logoBadge}>
              {logo
                ? <Image src={logo} alt={devName} width={120} height={33} className={s.logo} />
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
