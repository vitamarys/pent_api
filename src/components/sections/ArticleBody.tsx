import type {
  ArticleContentBlock,
  ArticleTextSegment,
  ArticleTableContent,
  PenthouseArticleAuthor,
} from '@/types/penthouse-api'
import ArticleGallery from './ArticleGallery'
import ArticleToc, { type TocHeading } from './ArticleToc'
import Container from '@/components/ui/Container'
import s from './ArticleBody.module.scss'

interface ArticleBodyProps {
  content: ArticleContentBlock[]
  author?: PenthouseArticleAuthor
  editor?: PenthouseArticleAuthor
}

// ── helpers ───────────────────────────────────────────────────────────────────

function extractText(content: unknown): string {
  if (!content) return ''
  if (Array.isArray(content)) {
    return (content as ArticleTextSegment[])
      .map((c) => c.text ?? '')
      .join('')
  }
  return ''
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

// Flatten nested blocks (for table children, etc.)
function flattenBlocks(blocks: ArticleContentBlock[]): ArticleContentBlock[] {
  const result: ArticleContentBlock[] = []
  for (const block of blocks) {
    result.push(block)
    if (block.children && block.children.length > 0) {
      result.push(...flattenBlocks(block.children))
    }
  }
  return result
}

// Extract headings for TOC — use block.id (UUID) to guarantee uniqueness
function extractHeadings(blocks: ArticleContentBlock[]): TocHeading[] {
  const flat = flattenBlocks(blocks)
  return flat
    .filter((b) => b.type === 'heading')
    .map((b) => {
      const level = (b.props?.level as number) ?? 2
      const text = extractText(b.content)
      if (!text.trim()) return null
      return { id: `h-${b.id}`, text, level }
    })
    .filter((h): h is TocHeading => h !== null)
}

// ── block renderers ────────────────────────────────────────────────────────────

function renderBlock(block: ArticleContentBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'heading': {
      const level = (block.props?.level as number) ?? 2
      const text = extractText(block.content)
      if (!text.trim()) return null
      const id = `h-${block.id}`
      if (level === 2) return <h2 key={index} id={id} className={s.h2}>{text}</h2>
      if (level === 3) return <h3 key={index} id={id} className={s.h3}>{text}</h3>
      return <h4 key={index} id={id} className={s.h3}>{text}</h4>
    }

    case 'paragraph': {
      const text = extractText(block.content)
      if (!text.trim()) return null
      return <p key={index} className={s.paragraph}>{text}</p>
    }

    case 'image': {
      const props = block.props as { url?: string; caption?: string; name?: string }
      if (!props?.url) return null
      return (
        <div key={index} className={s.imageBlock}>
          <img src={props.url} alt={props.caption || props.name || ''} className={s.contentImage} />
        </div>
      )
    }

    case 'table': {
      const tableContent = block.content as ArticleTableContent | undefined
      if (!tableContent?.rows?.length) return null
      return (
        <div key={index} className={s.tableWrapper}>
          <table className={s.table}>
            <tbody>
              {tableContent.rows.map((row, ri) => (
                <tr key={ri} className={ri === 0 ? s.tableRowHead : s.tableRow}>
                  {row.cells.map((cell, ci) => (
                    <td key={ci} className={s.tableCell}>
                      {extractText(cell.content)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case 'quote': {
      const text = extractText(block.content)
      if (!text.trim()) return null
      return (
        <blockquote key={index} className={s.quote}>
          <p className={s.quoteText}>{text}</p>
        </blockquote>
      )
    }

    case 'projectBlock': {
      const props = block.props as { projectId?: string; title?: string }
      const project = block.content as {
        title?: string
        url?: string
        areaTitle?: string
        developerName?: string
        minPrice?: number
      } | null | undefined
      const href = project?.url ?? props?.projectId ?? '#'
      const title = project?.title ?? props?.title ?? 'View Project'
      return (
        <a key={index} href={href} className={s.projectCard}>
          <div className={s.projectCardInfo}>
            <span className={s.projectCardTitle}>{title}</span>
            {(project?.developerName || project?.areaTitle) && (
              <span className={s.projectCardMeta}>
                {[project.developerName, project.areaTitle].filter(Boolean).join(' · ')}
              </span>
            )}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )
    }

    case 'galleryBlock': {
      const props = block.props as { images?: string }
      if (!props?.images) return null
      let images: Array<{ url: string; caption?: string }> = []
      try {
        images = JSON.parse(props.images)
      } catch {
        return null
      }
      return <ArticleGallery key={index} images={images} />
    }

    default:
      return null
  }
}

// ── Author card ────────────────────────────────────────────────────────────────

function AuthorCard({
  person,
  role,
}: {
  person: PenthouseArticleAuthor
  role: string
}) {
  return (
    <div className={s.authorCard}>
      <div className={s.authorAvatar}>
        {(person.imageFile?.url ?? person.image?.url) ? (
          <img src={person.imageFile?.url ?? person.image?.url} alt={person.name} className={s.authorImg} />
        ) : (
          <div className={s.authorImgFallback} aria-hidden="true" />
        )}
      </div>
      <div className={s.authorInfo}>
        <p className={s.authorName}>{person.name}</p>
        <p className={s.authorRole}>{role}</p>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ArticleBody({ content, author, editor }: ArticleBodyProps) {
  const flat = flattenBlocks(content)
  const headings = extractHeadings(content)

  return (
    <section className={s.section}>
      <Container>
      <div className={s.layout}>
        {/* Content */}
        <div className={s.contentCol}>
          <div className={s.blocks}>
            {flat.map((block, i) => renderBlock(block, i))}
          </div>

          {(author || editor) && (
            <div className={s.authors}>
              <h3 className={s.authorsTitle}>Authors</h3>
              <div className={s.authorsList}>
                {author && <AuthorCard person={author} role="Author" />}
                {editor && <AuthorCard person={editor} role="Reviewer" />}
              </div>
            </div>
          )}
        </div>

        {/* TOC sidebar */}
        {headings.length > 0 && (
          <aside className={s.sidebar}>
            <ArticleToc headings={headings} />
          </aside>
        )}
      </div>
      </Container>
    </section>
  )
}
