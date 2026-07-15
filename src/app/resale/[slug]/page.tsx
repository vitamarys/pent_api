import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type React from 'react'
import { getPageBySlug, getPageSlugs } from '@/api/pages'
import type { PenthousePage, PenthouseBlock, SecondaryProperty } from '@/types/penthouse-api'
import SecondaryHero from '@/components/sections/SecondaryHero'
import SecondarySidebar from '@/components/sections/SecondarySidebar'
import SecondaryDetails from '@/components/sections/SecondaryDetails'
import SecondaryProjectDetail from '@/components/sections/SecondaryProjectDetail'
import SecondaryFloorPlan from '@/components/sections/SecondaryFloorPlan'
import SecondaryAmenities from '@/components/sections/SecondaryAmenities'
import SecondaryReviews from '@/components/sections/SecondaryReviews'
import SecondarySimilar from '@/components/sections/SecondarySimilar'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectMap from '@/components/sections/ProjectMap'
import ProjectTeam from '@/components/sections/ProjectTeam'
import ProjectAwards from '@/components/sections/ProjectAwards'
import WorkProgress from '@/components/sections/WorkProgress'
import ProjectAccordion from '@/components/sections/ProjectAccordion'
import ProjectForm from '@/components/sections/ProjectForm'
import ProjectQr from '@/components/sections/ProjectQr'
import ProjectInfo from '@/components/sections/ProjectInfo'

export const revalidate = 3600
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs
    .filter((s) => s.startsWith('/resale/'))
    .map((s) => ({ slug: s.replace('/resale/', '').replace(/\/$/, '') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(`/resale/${slug}/`)
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.metaDescription,
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

function getProperty(page: PenthousePage): SecondaryProperty | null {
  const ae = page.associatedEntity?.[0] as
    | { __component: string; property?: SecondaryProperty }
    | undefined
  if (ae?.__component === 'associated-entity.secondary') return ae.property ?? null
  return null
}

// ── block renderer ────────────────────────────────────────────────────────────

function renderBlock(
  block: PenthouseBlock,
  index: number,
  property: SecondaryProperty | null,
): React.ReactNode {
  if (block.visible === false) return null

  switch (block.__component) {
    case 'block.secondary-hero': {
      if (!property) return null
      const b = block as { tourUrl?: string; videoUrl?: string }
      const images = (property.images ?? []).map((img) => ({ url: img.url }))
      return (
        <SecondaryHero
          key={index}
          subtitle={property.propertyTitle ?? undefined}
          images={images}
          breadcrumb={[
            { label: 'Resale', href: '/resale' },
            { label: property.propertyTitle ?? 'Property' },
          ]}
          tourUrl={b.tourUrl}
          videoUrl={b.videoUrl}
        />
      )
    }

    case 'block.secondary-details': {
      const b = block as {
        readMoreText?: string
        readLessText?: string
        locationLabel?: string
        typeOfPropertyLabel?: string
        furnishingLabel?: string
        floorsLabel?: string
        propertyStatusLabel?: string
      }
      if (!property) return null
      const location = [property.subCommunity, property.community].filter(Boolean).join(', ')
      return (
        <SecondaryDetails
          key={index}
          readMoreText={b.readMoreText}
          readLessText={b.readLessText}
          locationLabel={b.locationLabel}
          typeOfPropertyLabel={b.typeOfPropertyLabel}
          furnishingLabel={b.furnishingLabel}
          floorsLabel={b.floorsLabel}
          propertyStatusLabel={b.propertyStatusLabel}
          title={property.propertyTitle ?? undefined}
          descriptionHtml={property.webRemarks ?? undefined}
          location={location || undefined}
          propertyType={property.unitType ?? undefined}
          furnishing={property.primaryView ?? undefined}
          propertyStatus={property.completionStatus ?? undefined}
        />
      )
    }

    case 'block.secondary-project-detail': {
      const b = block as {
        title?: string
        UnitReferenceLabel?: string
        purposeLabel?: string
        statusLabel?: string
        emirateLabel?: string
        propertyNameLabel?: string
        addedOnLabel?: string
        dldLabel?: string
        dldText?: string
      }
      if (!property) return null
      return (
        <SecondaryProjectDetail
          key={index}
          title={b.title}
          unitReferenceLabel={b.UnitReferenceLabel}
          purposeLabel={b.purposeLabel}
          statusLabel={b.statusLabel}
          emirateLabel={b.emirateLabel}
          propertyNameLabel={b.propertyNameLabel}
          addedOnLabel={b.addedOnLabel}
          dldLabel={b.dldLabel}
          dldText={b.dldText}
          unitReference={property.unitReferenceNo ?? undefined}
          purpose={property.adType ?? undefined}
          status={property.completionStatus ?? undefined}
          emirate={property.emirate ?? undefined}
          propertyName={property.propertyName ?? undefined}
          addedOn={
            property.listingDate
              ? new Date(property.listingDate).toLocaleDateString('en-AE', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : undefined
          }
          permitNumber={property.permitNumber ?? undefined}
          dld={property.dld ?? null}
        />
      )
    }

    case 'block.secondary-floor-plan': {
      const b = block as {
        title?: string
        buttonText?: string
        layoutTitle?: string
        layoutDescription?: string
        images?: Array<{ url: string }> | null
      }
      return (
        <SecondaryFloorPlan
          key={index}
          title={b.title}
          buttonText={b.buttonText}
          layoutTitle={b.layoutTitle}
          layoutDescription={b.layoutDescription}
          images={b.images ?? null}
        />
      )
    }

    case 'block.secondary-amenities': {
      const b = block as {
        title?: string
        seeMoreButton?: string
        image?: { url: string } | null
      }
      return (
        <SecondaryAmenities
          key={index}
          title={b.title}
          seeMoreButton={b.seeMoreButton}
          image={b.image ?? null}
          features={property?.features ?? []}
        />
      )
    }

    case 'block.similar-block': {
      const b = block as { title?: string; buttonText?: string }
      if (!property?.id) return null
      return (
        <SecondarySimilar
          key={index}
          title={b.title ?? undefined}
          ctaLabel={b.buttonText ?? undefined}
          propertyId={property.id}
        />
      )
    }

    case 'block.overview': {
      const proj = property?.project
      if (!proj) return null
      const b = block as {
        title?: string
        description?: string
        videoURL?: string
        buttonText?: string
        locationLabel?: string
        developerLabel?: string
        handoverLabel?: string
        paymentPlanLabel?: string
        typesLabel?: string
        bedroomsLabel?: string
        floorsLabel?: string
        brandCollaborationLabel?: string
        imagesFile?: Array<{ url: string }>
      }
      const allImageUrls = (b.imagesFile ?? []).map((f) => f.url)
      const mainImage = allImageUrls[0] ?? ''
      const images: [string, string] = [allImageUrls[1] ?? '', allImageUrls[2] ?? '']

      const details: Array<{ label: string; value: string; type?: 'link' | 'text'; href?: string }> = []
      if (b.locationLabel && proj.area?.title) {
        details.push({ label: b.locationLabel, value: proj.area.title, type: proj.area.pageUrl ? 'link' : 'text', href: proj.area.pageUrl?.url })
      }
      if (b.developerLabel && proj.developer?.name) {
        details.push({ label: b.developerLabel, value: proj.developer.name, type: proj.developer.pageUrl ? 'link' : 'text', href: proj.developer.pageUrl?.url })
      }
      if (b.handoverLabel && proj.handoverValue) {
        details.push({ label: b.handoverLabel, value: proj.handoverValue })
      }
      if (b.paymentPlanLabel && proj.paymentPlan) {
        details.push({ label: b.paymentPlanLabel, value: proj.paymentPlan })
      }
      if (b.typesLabel && proj.projectTypes?.length) {
        details.push({ label: b.typesLabel, value: proj.projectTypes.map((t) => t.name).join(', ') })
      }
      if (b.bedroomsLabel && proj.beds?.multiValue?.length) {
        details.push({ label: b.bedroomsLabel, value: proj.beds.multiValue.join(', ') })
      }
      if (b.floorsLabel && proj.floors) {
        details.push({ label: b.floorsLabel, value: proj.floors })
      }
      if (b.brandCollaborationLabel && proj.brandCollaboration) {
        details.push({ label: b.brandCollaborationLabel, value: proj.brandCollaboration })
      }

      if (!mainImage && !b.description && !details.length) return null

      return (
        <ProjectInfo
          key={index}
          title={b.title ?? proj.title ?? ''}
          description={b.description ?? ''}
          mainImage={mainImage}
          images={images}
          videoUrl={b.videoURL ?? proj.videoURL ?? undefined}
          details={details}
          allImages={allImageUrls}
        />
      )
    }

    case 'block.banner': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        image?: { url?: string } | null
      }
      if (!b.title && !b.image) return null
      return (
        <ProjectBanner
          key={index}
          title={b.title}
          description={b.description}
          ctaLabel={b.buttonText ?? undefined}
          image={b.image?.url ? { url: b.image.url } : undefined}
        />
      )
    }

    case 'block.location': {
      const b = block as {
        title?: string
        description?: string
        mapLink?: string
        zoom?: number
        points?: Array<{ id: number; title: string; value: string }>
      }
      const lat = b.mapLink
        ? parseFloat(b.mapLink.split(',')[0])
        : property?.project?.coordinates?.lat
          ?? (property?.latitude ? parseFloat(property.latitude) : NaN)
      const lng = b.mapLink
        ? parseFloat(b.mapLink.split(',')[1])
        : property?.project?.coordinates?.lng
          ?? (property?.longitude ? parseFloat(property.longitude) : NaN)
      if (!lat || !lng) return null
      return (
        <ProjectMap
          key={index}
          sectionTitle={b.title ?? undefined}
          body={b.description}
          latitude={lat}
          longitude={lng}
          zoom={b.zoom ?? 13}
          proximity={b.points?.map((p) => ({ id: p.id, label: p.title, value: p.value }))}
        />
      )
    }

    case 'block.who-we-are': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        stats?: Array<{ id: number; title: string; value: string }>
        image?: { url: string }
      }
      return (
        <ProjectTeam
          key={index}
          title={b.title}
          description={b.description}
          ctaLabel={b.buttonText}
          stats={b.stats?.map((s) => ({ value: s.value, label: s.title })) ?? []}
          image={b.image?.url ?? ''}
        />
      )
    }

    case 'block.awards': {
      const b = block as {
        title?: string
        award?: Array<{ title: string; description: string; image?: { url: string } }>
      }
      if (!b.award?.length) return null
      return (
        <ProjectAwards
          key={index}
          sectionLabel={b.title}
          awards={b.award.map((a) => ({
            image: a.image?.url ?? '',
            value: a.title,
            label: a.description,
          }))}
        />
      )
    }

    case 'block.reviews': {
      const b = block as { title?: string }
      return <SecondaryReviews key={index} title={b.title} />
    }

    case 'block.working-process': {
      const b = block as {
        title?: string
        description?: string
        videoURL?: string
        videoButton?: string
        previewVideo?: { url?: string }
        steps?: Array<{ id: number; title: string; value: string }>
      }
      if (!b.steps?.length && !b.title) return null
      return (
        <WorkProgress
          key={index}
          sectionTitle={b.title ?? undefined}
          description={b.description ?? undefined}
          steps={b.steps ?? []}
          videoUrl={b.videoURL ?? undefined}
          videoButton={b.videoButton ?? undefined}
          previewImage={b.previewVideo?.url ?? undefined}
        />
      )
    }

    case 'block.secondary-faq': {
      const b = block as {
        title?: string
        questions?: Array<{ id: number; title: string; answer: string }>
      }
      if (!b.questions?.length) return null
      return (
        <ProjectAccordion
          key={index}
          sectionTitle={b.title ?? undefined}
          items={b.questions.map((q) => ({ title: q.title, answer: q.answer }))}
        />
      )
    }

    case 'block.any-questions-block': {
      const b = block as {
        contactFormData?: {
          title?: string
          description?: string
          buttonText?: string
          agreeText?: string
          policyText?: string
          agentName?: string
          agentPosition?: string
          agentImage?: { url?: string } | null
        }
      }
      const form = b.contactFormData
      return (
        <ProjectForm
          key={index}
          sectionTitle={form?.title}
          description={form?.description}
          submitLabel={form?.buttonText}
          consentLabel={form?.agreeText}
          privacyNote={form?.policyText}
          agent={
            form?.agentName
              ? {
                  name: form.agentName,
                  role: form.agentPosition ?? '',
                  image: form.agentImage?.url ?? '',
                }
              : undefined
          }
        />
      )
    }

    case 'block.project-qr-code': {
      const b = block as {
        tag?: string
        description?: string
        qrImage?: { url?: string } | null
      }
      return (
        <ProjectQr
          key={index}
          tagLabel={b.tag ?? undefined}
          description={b.description ?? undefined}
          qrUrl={b.qrImage?.url ?? null}
        />
      )
    }

    default:
      return null
  }
}

// ── inner blocks (go in left column of two-column section) ───────────────────

const INNER_BLOCKS = new Set([
  'block.secondary-hero',
  'block.secondary-details',
  'block.secondary-project-detail',
  'block.secondary-floor-plan',
  'block.secondary-amenities',
])

// ── page ──────────────────────────────────────────────────────────────────────

export default async function ResalePage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(`/resale/${slug}/`)

  if (!page || page.pageStatus !== 'PUBLISH' || page.deleted) notFound()

  const property = getProperty(page)

  const visibleBlocks = page.blocks.filter(
    (b) => !['block.header', 'block.footer'].includes(b.__component),
  )

  const innerBlocks = visibleBlocks.filter((b) => INNER_BLOCKS.has(b.__component))
  const outerBlocks = visibleBlocks.filter((b) => !INNER_BLOCKS.has(b.__component))

  const pricePerSqft =
    property?.price && property?.unitBuiltupArea
      ? Math.round(property.price / property.unitBuiltupArea)
      : undefined

  return (
    <main>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 40px 0', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
        <div>
          {innerBlocks.map((block, index) => {
            try {
              return renderBlock(block, index, property)
            } catch (err) {
              console.error(`Failed to render ${block.__component}`, err)
              return null
            }
          })}
        </div>
        <SecondarySidebar
          price={property?.price ?? undefined}
          pricePerSqft={pricePerSqft}
          area={property?.unitBuiltupArea ?? undefined}
          bedrooms={property?.bedrooms ? Number(property.bedrooms) : undefined}
          bathrooms={property?.noOfBathroom ?? undefined}
          parking={property?.parking ? Number(property.parking) : undefined}
          agent={property?.listingAgent ? { name: property.listingAgent, phone: property.listingAgentPhone ?? undefined } : undefined}
        />
      </div>
      {outerBlocks.map((block, index) => {
        try {
          return renderBlock(block, innerBlocks.length + index, property)
        } catch (err) {
          console.error(`Failed to render ${block.__component}`, err)
          return null
        }
      })}
    </main>
  )
}
