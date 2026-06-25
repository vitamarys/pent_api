import Container from "@/components/ui/Container";
import s from "./ProjectTeam.module.scss";

export interface TeamStat {
  value: string;
  label: string;
}

export interface ProjectTeamProps {
  title?:       string;
  description?: string;
  image:        string;
  stats?:       TeamStat[];
  ctaLabel?:    string;
  ctaHref?:     string;
}

export default function ProjectTeam({
  title       = "Who We Are",
  description = "Metropolitan Premium Properties is an award-winning real estate company in Dubai. We are part of the Metropolitan Group, which was founded in 2008. Starting with property sales in Dubai, we have expanded to the global market. Today, we serve clients from all over the world, with offices in Dubai, Abu Dhabi, and Vienna.",
  image,
  stats,
  ctaLabel = "Contact us",
  ctaHref  = "#",
}: ProjectTeamProps) {
  return (
    <section className={s.section}>
      <Container>
        <div className={s.inner}>

          {/* Left: text + stats + button */}
          <div className={s.textCol}>
            <div className={s.textBlock}>
              <h2 className={s.title}>{title}</h2>
              <p className={s.description}>{description}</p>
            </div>

            {stats && stats.length > 0 && (
              <div className={s.statsGrid}>
                {stats.map((stat, i) => (
                  <div key={i} className={s.statItem}>
                    <span className={s.statValue}>{stat.value}</span>
                    <span className={s.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            <a href={ctaHref} className={s.ctaBtn}>
              {ctaLabel}
            </a>
          </div>

          {/* Right: team image */}
          <div className={s.imageWrap}>
            {image && <img src={image} alt={title} className={s.image} />}
          </div>

        </div>
      </Container>
    </section>
  );
}
