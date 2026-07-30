'use client'

import { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { useFavorites } from '@/hooks/useFavorites'
import AreaCard from '@/app/areas/AreaCard'
import DeveloperCard from '@/app/developers/DeveloperCard'
import ProjectCard from '@/app/projects/ProjectCard'
import ResaleCard from '@/app/resale/ResaleCard'
import s from './page.module.scss'

type Tab = 'projects' | 'areas' | 'developers'

interface FavProject {
  id: number
  slug: string
  title: string
  location?: string
  developer?: string
  handover?: string
  priceFrom?: number
  propertyTypes?: string[]
  images?: string[]
}

interface FavResale {
  id: number
  slug: string
  title: string
  price?: number
  area?: number
  bedrooms?: string
  bathrooms?: number
  unitType?: string
  location?: string
  images?: string[]
}

interface FavArea {
  id: number
  slug: string
  name: string
  description?: string
  image?: string
}

interface FavDeveloper {
  id: number
  slug: string
  name: string
  description?: string
  imageBg?: { url: string }
  logo?: { url: string }
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        stroke="#1f1f1f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="rgba(31,31,31,0.7)" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('projects')

  const { items: favProjects } = useFavorites<FavProject>('fav_projects')
  const { items: favResale } = useFavorites<FavResale>('fav_resale')
  const { items: favAreas } = useFavorites<FavArea>('fav_areas')
  const { items: favDevs } = useFavorites<FavDeveloper>('fav_developers')

  const totalProjects = favProjects.length + favResale.length

  return (
    <main>
      {/* ── Header ── */}
      <section className={s.header}>
        <Container>
          <nav className={s.breadcrumb}>
            <Link href="/" className={s.breadcrumbHome} aria-label="Home">
              <HomeIcon />
            </Link>
            <ChevronIcon />
            <span className={s.breadcrumbCurrent}>Favorites</span>
          </nav>

          <h1 className={s.title}>Favorites</h1>

          <div className={s.tabs}>
            <button
              className={`${s.tab} ${activeTab === 'projects' ? s.tabActive : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button
              className={`${s.tab} ${activeTab === 'areas' ? s.tabActive : ''}`}
              onClick={() => setActiveTab('areas')}
            >
              Areas
            </button>
            <button
              className={`${s.tab} ${activeTab === 'developers' ? s.tabActive : ''}`}
              onClick={() => setActiveTab('developers')}
            >
              Developers
            </button>
          </div>
        </Container>
      </section>

      {/* ── Content ── */}
      <section className={s.listing}>
        <Container>
          {/* Projects tab */}
          {activeTab === 'projects' && (
            totalProjects === 0 ? (
              <p className={s.empty}>No favorite projects yet</p>
            ) : (
              <div className={s.groups}>
                {favResale.length > 0 && (
                  <div className={s.group}>
                    <h2 className={s.groupTitle}>
                      Secondary projects{' '}
                      <span className={s.groupCount}>{favResale.length}</span>
                    </h2>
                    <div className={s.grid}>
                      {favResale.map(item => (
                        <ResaleCard
                          key={item.id}
                          id={item.id}
                          slug={item.slug}
                          title={item.title}
                          price={item.price}
                          area={item.area}
                          bedrooms={item.bedrooms}
                          bathrooms={item.bathrooms}
                          unitType={item.unitType}
                          location={item.location}
                          images={item.images}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {favProjects.length > 0 && (
                  <div className={s.group}>
                    <h2 className={s.groupTitle}>
                      Off-plan projects{' '}
                      <span className={s.groupCount}>{favProjects.length}</span>
                    </h2>
                    <div className={s.grid}>
                      {favProjects.map(item => (
                        <ProjectCard
                          key={item.id}
                          id={item.id}
                          slug={item.slug}
                          title={item.title}
                          location={item.location}
                          developer={item.developer}
                          handover={item.handover}
                          priceFrom={item.priceFrom}
                          propertyTypes={item.propertyTypes}
                          images={item.images}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* Areas tab */}
          {activeTab === 'areas' && (
            favAreas.length === 0 ? (
              <p className={s.empty}>No favorite areas yet</p>
            ) : (
              <div className={s.groups}>
                <div className={s.group}>
                  <h2 className={s.groupTitle}>
                    Areas <span className={s.groupCount}>{favAreas.length}</span>
                  </h2>
                  <div className={s.grid}>
                    {favAreas.map(item => (
                      <AreaCard
                        key={item.id}
                        id={item.id}
                        slug={item.slug}
                        name={item.name}
                        description={item.description}
                        image={item.image}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Developers tab */}
          {activeTab === 'developers' && (
            favDevs.length === 0 ? (
              <p className={s.empty}>No favorite developers yet</p>
            ) : (
              <div className={s.groups}>
                <div className={s.group}>
                  <h2 className={s.groupTitle}>
                    Developers <span className={s.groupCount}>{favDevs.length}</span>
                  </h2>
                  <div className={s.grid}>
                    {favDevs.map(item => (
                      <DeveloperCard
                        key={item.id}
                        id={item.id}
                        slug={item.slug}
                        name={item.name}
                        description={item.description}
                        imageBg={item.imageBg}
                        logo={item.logo}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </Container>
      </section>
    </main>
  )
}
