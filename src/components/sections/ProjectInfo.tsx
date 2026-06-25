'use client'

import { useEffect } from "react"
import { ChevronRight, Info, Play, Maximize2 } from "lucide-react";
import Container from "@/components/ui/Container";
import s from "./ProjectInfo.module.scss";

export interface DetailItem {
  label: string;
  value: string;
  type?: "link" | "info" | "text";
  href?: string;
}

export interface ProjectInfoProps {
  title: string;
  description: string;
  mainImage: string;
  images: [string, string];
  videoUrl?: string;
  details: DetailItem[];
  allImages?: string[];
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
}: ProjectInfoProps) {
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
    <section className={s.section}>
      <Container>
        <div className={s.row}>

          {/* Left column — text + details */}
          <div className={s.leftCol}>
            <div className={s.overviewBlock}>
              <h3 className={s.title}>{title}</h3>
              <p className={s.description}>{description}</p>
            </div>

            <div className={s.detailsBlock}>
              <ul className={s.detailsList}>
                {details.map((item, i) => (
                  <li key={i} className={s.detailItem}>
                    <span className={s.detailLabel}>{item.label}</span>

                    {item.type === "link" ? (
                      <a href={item.href ?? "#"} className={s.detailLink}>
                        {item.value}
                        <ChevronRight size={16} />
                      </a>
                    ) : item.type === "info" ? (
                      <span className={s.detailValueInfo}>
                        {item.value}
                        <Info size={14} />
                      </span>
                    ) : (
                      <span className={s.detailValue}>{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
              <button className={s.downloadBtn}>Download Brochure</button>
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

            {/* Main image — clicks the first hidden anchor to open gallery */}
            <div
              className={s.mainImageWrap}
              onClick={() => {
                const first = document.querySelector<HTMLElement>(
                  `[data-fancybox="${GALLERY_ID}"]`
                )
                first?.click()
              }}
            >
              {mainImage && <img src={mainImage} alt={title} className={s.coverImg} />}
              <div className={s.imgOverlay} />
              {videoUrl && (
                <a href={videoUrl} className={s.playBtn} onClick={e => e.stopPropagation()}>
                  <Play size={16} />
                  Play Video
                </a>
              )}
            </div>

            <div className={s.additionalRow}>
              <div className={s.additionalImg}>
                {images?.[0] && <img src={images[0]} alt="" className={s.coverImg} />}
              </div>
              <div className={s.additionalImg}>
                {images?.[1] && <img src={images[1]} alt="" className={s.coverImg} />}
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
  );
}
