import s from './Container.module.scss'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={[s.container, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
