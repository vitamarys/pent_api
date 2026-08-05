'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Container from '@/components/ui/Container'
const PopConsultation = dynamic(() => import('@/components/ui/PopConsultation'))
import s from './AgentHero.module.scss'

// ── BlockNote content types ───────────────────────────────────────────────────

interface TextSegment {
  type: 'text'
  text: string
  styles?: Record<string, unknown>
}

interface ContentBlock {
  id: string
  type: string
  props?: Record<string, unknown>
  content?: TextSegment[]
  children?: ContentBlock[]
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AgentHeroProps {
  name:         string
  position?:    string
  description?: string
  imageUrl?:    string
  phone?:       string
  email?:       string
  whatsapp?:    string
  instagram?:   string
  linkedin?:    string
  telegram?:    string
  languages?:   Array<{ name?: string } | string>
  content?:     ContentBlock[]
}

// ── Breadcrumbs ───────────────────────────────────────────────────────────────

function Breadcrumbs({ name }: { name: string }) {
  return (
    <nav className={s.breadcrumbs} aria-label="Breadcrumb">
      <Link href="/" className={s.breadcrumbHome} aria-label="Home">
        <Image src="/icons/icon-home-b.svg" alt="Home" width={24} height={24} />
      </Link>
      <span className={s.breadcrumbSep}><ChevronRight size={16} strokeWidth={1.5} /></span>
      <Link href="/agents" className={s.breadcrumbLink}>Agents</Link>
      <span className={s.breadcrumbSep}><ChevronRight size={16} strokeWidth={1.5} /></span>
      <span className={s.breadcrumbCurrent}>{name}</span>
    </nav>
  )
}

// ── Social / contact link ─────────────────────────────────────────────────────

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={s.socialLink} target="_blank" rel="noopener noreferrer">
      <span>{label}</span>
      <ChevronRight size={16} strokeWidth={1.5} />
    </a>
  )
}

// ── BlockNote renderer ────────────────────────────────────────────────────────

function renderTextSegments(segments: TextSegment[] | undefined): React.ReactNode {
  if (!segments) return null
  return segments.map((seg, i) => {
    if (seg.styles?.bold) return <strong key={i}>{seg.text}</strong>
    if (seg.styles?.italic) return <em key={i}>{seg.text}</em>
    return seg.text
  })
}

function renderContentBlock(block: ContentBlock, i: number): React.ReactNode {
  switch (block.type) {
    case 'heading': {
      const level = (block.props?.level as number) ?? 2
      const Tag = `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements
      return <Tag key={i} className={s.contentHeading}>{renderTextSegments(block.content)}</Tag>
    }
    case 'paragraph':
      return <p key={i} className={s.contentParagraph}>{renderTextSegments(block.content)}</p>
    case 'bulletListItem':
      return <li key={i} className={s.contentListItem}>{renderTextSegments(block.content)}</li>
    case 'numberedListItem':
      return <li key={i} className={s.contentListItem}>{renderTextSegments(block.content)}</li>
    default:
      return null
  }
}

function renderContent(blocks: ContentBlock[]): React.ReactNode {
  const result: React.ReactNode[] = []
  let listItems: React.ReactNode[] = []
  let listType: 'ul' | 'ol' | null = null

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType === 'ol' ? 'ol' : 'ul'
      result.push(<Tag key={`list-${result.length}`} className={s.contentList}>{listItems}</Tag>)
      listItems = []
      listType = null
    }
  }

  blocks.forEach((block, i) => {
    if (block.type === 'bulletListItem') {
      if (listType !== 'ul') { flushList(); listType = 'ul' }
      listItems.push(renderContentBlock(block, i))
    } else if (block.type === 'numberedListItem') {
      if (listType !== 'ol') { flushList(); listType = 'ol' }
      listItems.push(renderContentBlock(block, i))
    } else {
      flushList()
      result.push(renderContentBlock(block, i))
    }
  })
  flushList()
  return result
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgentHero({
  name,
  position,
  description,
  imageUrl,
  phone,
  email,
  whatsapp,
  instagram,
  linkedin,
  telegram,
  languages = [],
  content = [],
}: AgentHeroProps) {
  const [popOpen, setPopOpen] = useState(false)
  const hasSocials = !!(whatsapp || instagram || linkedin || telegram)
  const normalizedLangs = languages.map((l) =>
    typeof l === 'string' ? l : (l.name ?? '')
  ).filter(Boolean)

  return (
    <>
    <PopConsultation
      open={popOpen}
      onClose={() => setPopOpen(false)}
      agent={name ? { name, role: position ?? '', image: imageUrl ?? '' } : undefined}
    />
    <section className={s.section}>
      <Container>
        <Breadcrumbs name={name} />
        <div className={s.inner}>

          {/* ── Left column ── */}
          <div className={s.leftCol}>
            <div className={s.photoWrap}>
              {imageUrl ? (
                <Image src={imageUrl} alt={name} fill className={s.photo} />
              ) : (
                <div className={s.photoPlaceholder} />
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className={s.rightCol}>

            {/* Contact card */}
            <div className={s.card}>
              {normalizedLangs.length > 0 && (
                <div className={s.languages}>
                  {normalizedLangs.map((lang, i) => (
                    <span key={i} className={s.langTag}>{lang}</span>
                  ))}
                </div>
              )}

              <div className={s.nameBlock}>
                <h1 className={s.name}>{name}</h1>
                {position && <p className={s.position}>{position}</p>}
              </div>

              {description && <p className={s.description}>{description}</p>}

              <div className={s.divider} />

              {hasSocials && (
                <div className={s.socials}>
                  {whatsapp && <ContactLink href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} label="WhatsApp" />}
                  {instagram && <ContactLink href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`} label="Instagram" />}
                  {linkedin && <ContactLink href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} label="LinkedIn" />}
                  {telegram && <ContactLink href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram}`} label="Telegram" />}
                </div>
              )}

              <div className={s.contacts}>
                {phone && (
                  <div className={s.contactItem}>
                    <span className={s.contactLabel}>Phone</span>
                    <a href={`tel:${phone}`} className={s.contactValue}>{phone}</a>
                  </div>
                )}
                {email && (
                  <div className={s.contactItem}>
                    <span className={s.contactLabel}>Email</span>
                    <a href={`mailto:${email}`} className={s.contactValue}>{email}</a>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={s.ctaBtn}
                onClick={() => setPopOpen(true)}
              >
                Request a call back
              </button>
            </div>

            {/* About section */}
            {(content.length > 0) && (
              <div className={s.about}>
           
                <div className={s.aboutContent}>
                  {renderContent(content)}
                </div>
              </div>
            )}

          </div>
        </div>
      </Container>
    </section>
    </>
  )
}
