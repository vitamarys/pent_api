import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getStrapiImageUrl } from '@/lib/utils'
import { MOCK_DEVELOPERS, MOCK_PROJECTS } from '@/data/mock'
import type {
  StrapiDeveloperSection,
  StrapiHeroDeveloperSection,
  StrapiDeveloperAboutSection,
  StrapiDeveloperProjectsSection,
  StrapiDeveloperSliderSection,
  StrapiProjectForm as StrapiProjectFormSection,
  StrapiProjectAccordion,
  StrapiDeveloper,
  StrapiProject,
} from '@/types/strapi'
import HeroDeveloper from '@/components/sections/HeroDeveloper'
import DeveloperAbout from '@/components/sections/DeveloperAbout'
import DeveloperProjects from '@/components/sections/DeveloperProjects'
import type { DeveloperProjectItem } from '@/components/sections/DeveloperProjects'
import ProjectForm from '@/components/sections/ProjectForm'
import ProjectAccordion from '@/components/sections/ProjectAccordion'
import DeveloperSlider from '@/components/sections/DeveloperSlider'
import type { DeveloperSliderItem } from '@/components/sections/DeveloperSlider'

export const revalidate = 3600
export const dynamicParams = true

const DEFAULT_SECTIONS: StrapiDeveloperSection[] = [
  { id: 1, __component: 'sections.hero-developer', visible: true },
  { id: 2, __component: 'sections.developer-about', visible: true },
  { id: 3, __component: 'sections.developer-projects', visible: true },
  { id: 4, __component: 'sections.developer-slider', visible: true },
]

export async function generateStaticParams() {
  return MOCK_DEVELOPERS.map(({ slug }) => ({ slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const developer = MOCK_DEVELOPERS.find((d) => d.slug === slug)
  if (!developer) return {}
  return { title: developer.name }
}

function mediaUrl(media?: { url: string } | null) {
  return media ? getStrapiImageUrl(media.url) : ''
}

function toProjectItems(projects: StrapiProject[]): DeveloperProjectItem[] {
  return projects.map((p) => ({
    title: p.title,
    slug: p.slug,
    location: [p.district?.name, p.district?.city].filter(Boolean).join(', '),
    developerName: p.developer?.name ?? '',
    handover: p.handover,
    priceFrom: p.priceFrom,
    images: p.images ?? [],
    propertyTypes: p.propertyTypes,
  }))
}

function renderSection(
  section: StrapiDeveloperSection,
  developer: StrapiDeveloper,
  projects: StrapiProject[],
  otherDevelopers: DeveloperSliderItem[],
) {
  switch (section.__component) {
    case 'sections.hero-developer': {
      const s = section as StrapiHeroDeveloperSection
      return (
        <HeroDeveloper
          key={`${s.__component}-${s.id}`}
          name={developer.name}
          description={developer.description ?? ''}
          bgImage={mediaUrl(developer.imageBg)}
          logo={developer.logo ? mediaUrl(developer.logo) : undefined}
          stats={developer.stats?.map((st) => ({ label: st.label, value: st.value }))}
          ctaLabel={s.ctaLabel ?? 'Get Consultation'}
          ctaHref={s.ctaHref ?? '#'}
          breadcrumb={[
            { label: 'Developers', href: '/developers' },
            { label: developer.name },
          ]}
        />
      )
    }

    case 'sections.developer-about': {
      const s = section as StrapiDeveloperAboutSection
      return (
        <DeveloperAbout
          key={`${s.__component}-${s.id}`}
          sectionTitle={s.sectionTitle}
          sectionDescription={s.body}
          image={s.image ? mediaUrl(s.image) : undefined}
          features={s.features?.map((f) => ({
            title: f.title,
            description: f.description,
          }))}
        />
      )
    }

    case 'sections.developer-projects': {
      const s = section as StrapiDeveloperProjectsSection
      return (
        <DeveloperProjects
          key={`${s.__component}-${s.id}`}
          developerName={developer.name}
          ctaLabel={s.ctaLabel}
          ctaHref={s.ctaHref}
          projects={toProjectItems(projects)}
        />
      )
    }

    case 'sections.developer-slider': {
      const s = section as StrapiDeveloperSliderSection
      return (
        <DeveloperSlider
          key={`${s.__component}-${s.id}`}
          developers={otherDevelopers}
          sectionTitle={s.sectionTitle}
          ctaLabel={s.ctaLabel}
          ctaHref={s.ctaHref}
        />
      )
    }

    case 'sections.project-accordion': {
      const s = section as StrapiProjectAccordion
      return (
        <ProjectAccordion
          key={`${s.__component}-${s.id}`}
          sectionTitle={s.sectionTitle}
          items={s.items ?? []}
        />
      )
    }

    case 'sections.project-form': {
      const s = section as StrapiProjectFormSection
      return (
        <ProjectForm
          key={`${s.__component}-${s.id}`}
          sectionTitle={s.sectionTitle}
          description={s.description}
          submitLabel={s.submitLabel}
          privacyNote={s.privacyNote}
          consentLabel={s.consentLabel}
          agent={
            s.agent
              ? {
                  name: s.agent.name,
                  role: s.agent.role ?? '',
                  image: mediaUrl(s.agent.image),
                }
              : undefined
          }
        />
      )
    }

    default:
      return null
  }
}

export default async function DeveloperPage({ params }: Props) {
  const { slug } = await params

  const developer = MOCK_DEVELOPERS.find((d) => d.slug === slug) ?? null
  if (!developer) notFound()

  const projects = MOCK_PROJECTS.filter((p) => p.developer?.slug === slug)
  const otherDevelopers = MOCK_DEVELOPERS.filter((d) => d.slug !== slug)

  const sections = (developer.sections ?? DEFAULT_SECTIONS).filter((s) => s.visible !== false)

  const otherDevItems: DeveloperSliderItem[] = otherDevelopers.map((d) => ({
    name: d.name,
    slug: d.slug,
    description: d.description,
    logo: d.logo,
    imageBg: d.imageBg,
  }))

  return (
    <main>
      {sections.map((section) => renderSection(section, developer, projects, otherDevItems))}
    </main>
  )
}
