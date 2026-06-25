import React from "react";
import Container from "@/components/ui/Container";
import s from "./ProjectDev.module.scss";

export interface StatItem {
  label: string;
  value: string;
}

export interface ProjectDevProps {
  devName:     string;
  description: string;
  image:       string;
  logo?:       string;
  stats?:      StatItem[];
  ctaLabel?:   string;
  ctaHref?:    string;
}

export default function ProjectDev({
  devName,
  description,
  image,
  logo,
  stats,
  ctaLabel = "Go to developer page",
  ctaHref  = "#",
}: ProjectDevProps) {
  return (
    <section className={s.section}>

      {/* Full-bleed background — desktop only */}
      <div className={s.bg} style={{ backgroundImage: `url(${image})` }} />

      {/* Stacked image — tablet/mobile only */}
      <div className={s.imageStack}>
        {image && <img src={image} alt={devName} />}
      </div>

      <Container>
        <div className={s.cardWrap}>
          <div className={s.card}>

            {/* Logo */}
            {logo && (
              <div className={s.logoWrap}>
                <img src={logo} alt={devName} className={s.logo} />

              </div>
            )}

            {/* Info */}
            <div className={s.infoContainer}>
              <div className={s.textContent}>
                <h2 className={s.devName}>{devName}</h2>
                <p className={s.description}>{description}</p>
              </div>

              {stats && stats.length > 0 && (
                <div className={s.statsRow}>
                  {stats.map((stat, i) => (
                    <React.Fragment key={i}>
                      <div className={s.divider} />
                      <div className={s.statItem}>
                        <span className={s.statLabel}>{stat.label}</span>
                        <span className={s.statValue}>{stat.value}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}

              <a href={ctaHref} className={s.ctaBtn}>
                {ctaLabel}
              </a>
            </div>

          </div>
        </div>
      </Container>

    </section>
  );
}
