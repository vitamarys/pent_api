"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import s from "./ProjectPaymentPlan.module.scss";

export interface PaymentStage {
  title: string;
  subtitle?: string;
  percentage: string;
  paymentsLabel?: string;
}

export interface PaymentVersion {
  label: string;
  stages: PaymentStage[];
}

export interface ProjectPaymentPlanProps {
  sectionTitle?: string;
  description?: string;
  versions: PaymentVersion[];
  ctaLabel?: string;
}

export default function ProjectPaymentPlan({
  sectionTitle = "Payment Plan",
  description,
  versions,
  ctaLabel = "Discuss with expert",
}: ProjectPaymentPlanProps) {
  const [activeVersion, setActiveVersion] = useState(0);

  const stages = versions[activeVersion]?.stages ?? [];

  return (
    <section className={s.section}>
      <Container>
        {/* Header */}
        <div className={s.header}>
          <div className={s.headerLeft}>
            <h2 className={s.sectionTitle}>{sectionTitle}</h2>
            {description && <p className={s.description}>{description}</p>}
          </div>

          {versions.length > 1 && (
            <div className={s.tabsBar}>
              {versions.map((v, i) => (
                <button
                  key={i}
                  className={`${s.tab} ${activeVersion === i ? s.active : ""}`}
                  onClick={() => setActiveVersion(i)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: card row */}
        <div className={s.cards}>
          {stages.map((stage, i) => (
            <div key={i} className={s.card}>
              <div className={s.cardTop}>
                <div className={s.topWrap}>
                  <p className={s.stageTitle}>{stage.title}</p>
                  <p className={s.stageSubtitle}>{stage.subtitle}</p>
                </div>
                <div className={s.bottomWrap}>
                  <p className={s.percentage}>{stage.percentage} %</p>
                  {stage.paymentsLabel && (
                    <div className={s.badge}>
                      <span>{stage.paymentsLabel}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* CTA card — desktop only */}
          <button className={s.ctaCard}>
            <span className={s.ctaLabel}>{ctaLabel}</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mobile/Tablet: list rows */}
        <div className={s.list}>
          {stages.map((stage, i) => (
            <div key={i} className={s.listItem}>
              <div className={s.listItemLeft}>
                <p className={s.stageTitle}>{stage.title}</p>
                <p className={s.stageSubtitle}>{stage.subtitle}</p>
                {stage.paymentsLabel && (
                  <div className={s.badge}>
                    <span>{stage.paymentsLabel}</span>
                  </div>
                )}
              </div>
              <p className={s.percentage}>{stage.percentage} %</p>
            </div>
          ))}

          {/* CTA button — mobile/tablet only */}
          <button className={s.ctaBtn}>
            <span>{ctaLabel}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </Container>
    </section>
  );
}
