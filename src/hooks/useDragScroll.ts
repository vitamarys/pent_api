import { useRef, useCallback } from 'react'

export function useDragScroll(ref: { current: HTMLElement | null }) {
  const moved    = useRef(false)
  const startX   = useRef(0)
  const prevX    = useRef(0)
  const velocity = useRef(0)
  const rafId    = useRef(0)

  const momentum = useCallback(() => {
    const el = ref.current
    if (!el || Math.abs(velocity.current) < 0.5) return
    el.scrollLeft += velocity.current
    velocity.current *= 0.92
    rafId.current = requestAnimationFrame(momentum)
  }, [ref])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el || e.button !== 0) return

    cancelAnimationFrame(rafId.current)
    e.preventDefault()

    moved.current    = false
    startX.current   = e.pageX
    prevX.current    = e.pageX
    velocity.current = 0

    el.style.cursor         = 'grabbing'
    el.style.userSelect     = 'none'
    el.style.scrollBehavior = 'auto'

    const handleMove = (ev: MouseEvent) => {
      const dx = prevX.current - ev.pageX
      if (Math.abs(ev.pageX - startX.current) > 3) moved.current = true
      velocity.current = velocity.current * 0.5 + dx * 0.5
      el.scrollLeft += dx
      prevX.current = ev.pageX
    }

    const handleUp = () => {
      el.style.cursor         = 'grab'
      el.style.userSelect     = ''
      el.style.scrollBehavior = ''
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup',   handleUp)
      rafId.current = requestAnimationFrame(momentum)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup',   handleUp)
  }, [ref, momentum])

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (moved.current) {
      e.preventDefault()
      e.stopPropagation()
      moved.current = false
    }
  }, [])

  return { onMouseDown, onClickCapture }
}
