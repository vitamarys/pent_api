import HeroDeveloper from '@/components/sections/HeroDeveloper'
import DeveloperAbout from '@/components/sections/DeveloperAbout'
import DeveloperProjects from '@/components/sections/DeveloperProjects'
import ProjectAccordion from '@/components/sections/ProjectAccordion'
import ProjectForm from '@/components/sections/ProjectForm'

const IMAGES = {
  bg:      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=80',
  logo:    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80',
  about:   'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80',
  agent:   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
}

const MOCK_PROJECTS = [
  {
    title: 'Marina Vista',
    slug: 'marina-vista',
    location: 'Dubai Marina, Dubai',
    developerName: 'Emaar Properties',
    handover: 'Q4 2025',
    priceFrom: 2_100_000,
    propertyTypes: ['Apartment'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80' },
    ],
  },
  {
    title: 'The Address Sky View',
    slug: 'address-sky-view',
    location: 'Downtown Dubai, Dubai',
    developerName: 'Emaar Properties',
    handover: 'Q2 2026',
    priceFrom: 3_800_000,
    propertyTypes: ['Apartment', 'Penthouse'],
    images: [
      { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80' },
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80' },
    ],
  },
  {
    title: 'Emaar Beachfront',
    slug: 'emaar-beachfront',
    location: 'Emaar Beachfront, Dubai',
    developerName: 'Emaar Properties',
    handover: 'Q1 2026',
    priceFrom: 2_600_000,
    propertyTypes: ['Apartment'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80' },
      { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80' },
    ],
  },
  {
    title: 'Burj Khalifa Residences',
    slug: 'burj-khalifa-residences',
    location: 'Downtown Dubai, Dubai',
    developerName: 'Emaar Properties',
    handover: 'Q3 2026',
    priceFrom: 8_500_000,
    propertyTypes: ['Apartment', 'Penthouse'],
    images: [
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80' },
      { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80' },
    ],
  },
]

export default function DeveloperTestPage() {
  return (
    <main>

      <HeroDeveloper
        name="Emaar Properties"
        description="Emaar Properties is one of the world's most valuable and admired real estate development companies. With proven competencies in properties, shopping malls & retail, and hospitality & leisure, Emaar shapes new lifestyles with a focus on design excellence, build quality, and timely delivery."
        bgImage={IMAGES.bg}
        logo={IMAGES.logo}
        stats={[
          { label: 'Years on market', value: '27+' },
          { label: 'Completed projects', value: '280+' },
          { label: 'Year of foundation', value: '1997' },
          { label: 'Countries', value: '36' },
        ]}
        ctaLabel="Get Consultation"
        ctaHref="#"
        breadcrumb={[
          { label: 'Developers', href: '/developers' },
          { label: 'Emaar Properties' },
        ]}
      />

      <DeveloperAbout
        sectionTitle="What Emaar Is Known For"
        sectionDescription="For over two decades, Emaar Properties has been at the forefront of transforming skylines and communities across the globe. Their unwavering commitment to quality and innovation has produced some of the world's most iconic developments."
        image={IMAGES.about}
        features={[
          {
            title: 'Iconic Architecture & Design',
            description: 'Emaar is responsible for the Burj Khalifa, the world\'s tallest building, and Dubai Mall — a benchmark for architectural excellence and urban planning that defines the modern skyline.',
          },
          {
            title: 'Smart Home Integration',
            description: 'Every Emaar residence is equipped with state-of-the-art smart home systems, allowing residents to control lighting, climate, security, and entertainment through a single interface.',
          },
          {
            title: 'Sustainable Communities',
            description: 'Emaar integrates sustainability at every stage of development — from green-certified buildings and solar energy solutions to walkable communities designed to reduce carbon footprint.',
          },
        ]}
      />

      <DeveloperProjects
        developerName="Emaar Properties"
        projects={MOCK_PROJECTS}
        ctaLabel="See all projects"
        ctaHref="#"
      />

      <ProjectAccordion
        sectionTitle="Frequently Asked Questions"
        items={[
          {
            question: 'Is Emaar a reliable developer to invest with?',
            answer: 'Yes. Emaar Properties is listed on the Dubai Financial Market and is one of the largest real estate developers in the world by market capitalisation. With over 27 years of track record and 280+ completed projects, Emaar is considered one of the safest developers to invest with in the UAE.',
          },
          {
            question: 'Does Emaar offer post-handover payment plans?',
            answer: 'Yes, Emaar regularly offers post-handover payment plans on selected off-plan projects. Typical structures include 80/20, 60/40, and extended 3-year post-handover plans. Exact terms vary by project and launch period.',
          },
          {
            question: 'What types of properties does Emaar develop?',
            answer: 'Emaar develops a wide range of property types including apartments, duplexes, penthouses, townhouses, and villas. Their portfolio spans from affordable mid-range units to ultra-luxury residences in prime locations across Dubai and internationally.',
          },
          {
            question: 'Can I get a mortgage for an Emaar off-plan property?',
            answer: 'Yes. Most UAE banks offer mortgage products for Emaar off-plan properties. Financing is typically available from the point of 40–50% construction completion. Our team can connect you with preferred banking partners who offer competitive rates for both residents and non-residents.',
          },
          {
            question: 'What is the average ROI on Emaar properties?',
            answer: 'Rental yields on Emaar properties typically range from 5% to 8% gross per annum depending on the location, unit type, and market conditions. Properties in Downtown Dubai and Dubai Marina have historically delivered the most consistent returns.',
          },
        ]}
      />

      <ProjectForm
        sectionTitle="Have any questions about Emaar?"
        description="Leave your details and our property advisor will get back to you with personalised project recommendations."
        submitLabel="Get Consultation"
        privacyNote="By submitting this form you agree to our Privacy Policy and Terms of Use."
        consentLabel="I consent to being contacted by the sales team"
        agent={{
          name: 'Jamie Lane',
          role: 'Luxury Property Advisor',
          image: IMAGES.agent,
        }}
      />

    </main>
  )
}
