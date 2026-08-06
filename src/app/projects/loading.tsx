import Image from 'next/image'
import Container from '@/components/ui/Container'
import s from './page.module.scss'
import ls from './loading.module.scss'

const SKELETON_COUNT = 9

export default function ProjectsLoading() {
  return (
    <main>
      <section className={s.header}>
        <Container>
          <div style={{ height: 32, marginBottom: 32 }} />
          <div className={s.headerContent}>
            <div style={{ height: 56, width: 320, background: 'rgba(31,31,31,0.06)', borderRadius: 4 }} />
          </div>
        </Container>
      </section>

      <section className={s.listing}>
        <Container>
          <div className={s.grid}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className={ls.skeletonWrap}>
                <Image
                  src="/skeletons/project.png"
                  alt=""
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div className={ls.shimmer} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
