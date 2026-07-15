import Link from 'next/link'
import s from './ResalePagination.module.scss'

interface ResalePaginationProps {
  currentPage: number
  totalPages: number
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getPages(current: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, '...', current - 1, current, current + 1, '...', total]
}

export default function ResalePagination({ currentPage, totalPages }: ResalePaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPages(currentPage, totalPages)

  return (
    <div className={s.pagination}>
      {currentPage > 1 ? (
        <Link href={`/resale?page=${currentPage - 1}`} className={s.arrow} aria-label="Previous page">
          <ChevronLeft />
        </Link>
      ) : (
        <span className={`${s.arrow} ${s.arrowDisabled}`} aria-disabled="true">
          <ChevronLeft />
        </span>
      )}

      <div className={s.numbers}>
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className={s.ellipsis}>…</span>
          ) : (
            <Link
              key={page}
              href={`/resale?page=${page}`}
              className={`${s.btn} ${page === currentPage ? s.btnActive : ''}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link href={`/resale?page=${currentPage + 1}`} className={s.arrow} aria-label="Next page">
          <ChevronRight />
        </Link>
      ) : (
        <span className={`${s.arrow} ${s.arrowDisabled}`} aria-disabled="true">
          <ChevronRight />
        </span>
      )}
    </div>
  )
}
