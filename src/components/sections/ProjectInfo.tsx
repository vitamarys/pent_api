'use client'

import '@fancyapps/ui/dist/fancybox/fancybox.css'
import Image from 'next/image'
import { useEffect, useState } from "react"
import { ChevronRight, Play, Maximize2 } from "lucide-react"
import dynamic from 'next/dynamic'
const PopPresentation = dynamic(() => import('@/components/ui/PopPresentation'))
const PopConsultation = dynamic(() => import('@/components/ui/PopConsultation'))
import Container from "@/components/ui/Container";
import s from "./ProjectInfo.module.scss";

export interface DetailItem {
  label: string;
  value: string;
  type?: "link" | "info" | "text";
  href?: string;
  published?: boolean;
}

export interface ProjectInfoProps {
  title: string;
  description: string;
  mainImage: string;
  images: [string, string];
  videoUrl?: string;
  details: DetailItem[];
  allImages?: string[];
  pageBitrixId?: string;
  paymentPlanExplanation?: string;
  brochureURL?: string;
  buttonText?: string;
}

const GALLERY_ID = "project-info-gallery"

export default function ProjectInfo({
  title,
  description,
  mainImage,
  images,
  videoUrl,
  details,
  allImages,
  pageBitrixId,
  paymentPlanExplanation,
  brochureURL,
  buttonText,
}: ProjectInfoProps) {
  const [presentationOpen, setPresentationOpen] = useState(false)
  const [consultationOpen, setConsultationOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const hasBrochure = !!brochureURL

  const galleryImages = allImages?.length
    ? allImages
    : [mainImage, ...(images ?? [])].filter(Boolean)

  useEffect(() => {
    let fancybox: any
    import("@fancyapps/ui").then((mod) => {
      fancybox = mod.Fancybox
      fancybox.bind(`[data-fancybox="${GALLERY_ID}"]`, {})
    })
    return () => {
      fancybox?.destroy()
    }
  }, [])

  return (
    <>
    <section id="overview" className={s.section}>
      <Container>
        <div className={s.row}>

          {/* Left column — text + details */}
          <div className={s.leftCol}>
            <div className={s.overviewBlock}>
              <h3 className={s.title} data-anim="heading" suppressHydrationWarning>{title}</h3>
              <p className={s.description} data-anim="text" suppressHydrationWarning>{description}</p>
            </div>

            <div className={s.detailsBlock}>
              <ul className={s.detailsList}>
                {details.map((item, i) => (
                  <li key={i} className={s.detailItem}>
                    <span className={s.detailLabel}>{item.label}</span>

                    {item.type === "link" && item.href && item.published !== false ? (
                      <a href={item.href} className={s.detailLink}>
                        {item.value}
                        <ChevronRight size={16} />
                      </a>
                    ) : item.type === "info" ? (
                      <span className={s.detailValueInfo}>
                        {item.value}
                        {paymentPlanExplanation && (
                          <span className={s.tooltipWrap}>
                            <img src="/icons/info.svg" alt="info" className={s.infoIcon} width={16} height={16} />
                            <span className={s.tooltip}>
                              {paymentPlanExplanation}
                              <span className={s.tooltipArrow} />
                            </span>
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className={s.detailValue}>{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
              <button
                className={s.downloadBtn}
                onClick={() => hasBrochure ? setPresentationOpen(true) : setConsultationOpen(true)}
              >
                {hasBrochure ? (buttonText ?? 'Download Brochure') : 'Check Availability'}
              </button>
            </div>
          </div>

          {/* Right column — images */}
          <div className={s.rightCol}>

            {/* All gallery anchors hidden, in correct order (mainImage first) */}
            {galleryImages.map((src, i) => (
              <a
                key={i}
                data-fancybox={GALLERY_ID}
                href={src}
                style={{ display: "none" }}
              />
            ))}

            {/* Main image */}
            <div
              className={s.mainImageWrap}
              data-anim="image"
              suppressHydrationWarning
            >
              {mainImage && <Image src={mainImage} alt={title} fill className={s.coverImg} sizes="(max-width: 768px) 100vw, 60vw" priority />}
              <div className={s.imgOverlay} />
              {videoUrl && (
                <button className={s.playBtn} onClick={() => setVideoOpen(true)}>
                  <Play size={16} />
                  Play Video
                </button>
              )}
            </div>

            <div className={s.additionalRow}>
              <div className={s.additionalImg}>
                {images?.[0] && <Image src={images[0]} alt="" fill className={s.coverImg} sizes="(max-width: 768px) 50vw, 30vw" />}
              </div>
              <div className={s.additionalImg}>
                {images?.[1] && <Image src={images[1]} alt="" fill className={s.coverImg} sizes="(max-width: 768px) 50vw, 30vw" />}
                {galleryImages.length > 0 && (
                  <button
                    className={s.photosBtn}
                    onClick={() => {
                      const first = document.querySelector<HTMLElement>(
                        `[data-fancybox="${GALLERY_ID}"]`
                      )
                      first?.click()
                    }}
                  >
                    <Maximize2 size={16} />
                    {galleryImages.length} photos
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>

    {videoOpen && videoUrl && (
      <div className={s.videoOverlay} onClick={() => setVideoOpen(false)}>
        <div className={s.videoModal} onClick={e => e.stopPropagation()}>
          <button className={s.videoClose} onClick={() => setVideoOpen(false)}>✕</button>
          <iframe
            src={videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen
            className={s.videoIframe}
          />
        </div>
      </div>
    )}

    <PopPresentation
      open={presentationOpen}
      onClose={() => setPresentationOpen(false)}
      image={mainImage}
      title={title}
      pageBitrixId={pageBitrixId}
      brochureURL={brochureURL}
    />
    <PopConsultation
      open={consultationOpen}
      onClose={() => setConsultationOpen(false)}
      pageBitrixId={pageBitrixId}
    />
    </>
  );
}
