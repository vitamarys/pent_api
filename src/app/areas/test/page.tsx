import HeroArea from '@/components/sections/HeroArea'
import AboutArea from '@/components/sections/AboutArea'
import DeveloperProjects from '@/components/sections/DeveloperProjects'
import AreaOverview from '@/components/sections/AreaOverview'
import ProjectMap from '@/components/sections/ProjectMap'
import ProjectAccordion from '@/components/sections/ProjectAccordion'

const IMAGES = {
  hero:     'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&q=80',
  overview: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=1400&q=80',
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
    title: 'Cayan Tower Residences',
    slug: 'cayan-tower-residences',
    location: 'Dubai Marina, Dubai',
    developerName: 'Cayan Group',
    handover: 'Q2 2026',
    priceFrom: 3_450_000,
    propertyTypes: ['Apartment', 'Penthouse'],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80' },
      { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80' },
    ],
  },
  {
    title: 'Princess Tower Heights',
    slug: 'princess-tower-heights',
    location: 'Dubai Marina, Dubai',
    developerName: 'Select Group',
    handover: 'Q1 2026',
    priceFrom: 1_850_000,
    propertyTypes: ['Studio', 'Apartment'],
    images: [
      { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80' },
    ],
  },
  {
    title: 'Damac Heights',
    slug: 'damac-heights',
    location: 'Dubai Marina, Dubai',
    developerName: 'DAMAC Properties',
    handover: 'Q3 2026',
    priceFrom: 4_200_000,
    propertyTypes: ['Apartment', 'Duplex'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80' },
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80' },
    ],
  },
]

export default function AreaTestPage() {
  return (
    <main>

      <HeroArea
        title="Dubai Marina"
        description="One of Dubai's most vibrant waterfront communities, Dubai Marina offers an unparalleled urban lifestyle surrounded by stunning skyscrapers, world-class dining, and a picturesque promenade."
        image={IMAGES.hero}
        breadcrumb={[
          { label: 'Areas', href: '/areas' },
          { label: 'Dubai Marina' },
        ]}
        ctaLabel="Explore Properties"
        ctaHref="#"
      />

      <AboutArea
        sectionTitle="About the district"
        description="Dubai Marina is a master-planned residential and commercial district built along a 3.5 km stretch of the Arabian Gulf shoreline. Renowned for its iconic skyline and vibrant atmosphere, the district is home to over 200 residential towers, 5-star hotels, and an award-winning yacht marina that accommodates up to 550 vessels."
        features={[
          {
            title: 'Prime Waterfront Location',
            description: 'Situated along the Arabian Gulf with 3.5 km of pristine waterfront, Dubai Marina offers unmatched views and direct access to JBR Beach — one of Dubai\'s most popular public beaches.',
          },
          {
            title: 'World-Class Infrastructure',
            description: 'The district is served by two Dubai Metro stations, the Dubai Tram network, and the Marina Walk — a 7 km promenade lined with cafés, restaurants and retail outlets that attracts millions of visitors each year.',
          },
        ]}
      />

      <DeveloperProjects
        developerName="Dubai Marina"
        sectionTitle="Latest Projects in Dubai Marina"
        projects={MOCK_PROJECTS}
        ctaLabel="See all projects"
        ctaHref="#"
      />

      <AreaOverview
        sectionTitle="Area Overview"
        image={IMAGES.overview}
        tabs={[
          {
            label: 'Overview',
            content: 'Dubai Marina is one of the largest man-made marinas in the world, stretching over 3.5 km along the shoreline. The district combines modern architecture with a relaxed waterfront lifestyle, making it the preferred address for professionals and families who want the best of both worlds.',
          },
          {
            label: 'Lifestyle',
            content: 'Residents enjoy an enviable lifestyle with over 200 dining options, boutique retail stores, and entertainment venues all within walking distance. The Marina Walk promenade connects the entire waterfront, creating a vibrant community hub day and night.',
          },
          {
            label: 'Connectivity',
            content: 'Dubai Marina is exceptionally well-connected. Two Metro stations (DMCC and Sobha Realty), the Dubai Tram, and multiple bus routes provide seamless access to the rest of the city. Sheikh Zayed Road is a 5-minute drive, connecting residents to Downtown Dubai in under 20 minutes.',
          },
          {
            label: 'Investment',
            content: 'The area consistently ranks among Dubai\'s top-performing real estate markets, with average gross rental yields of 6–8% for apartments. Strong demand from both short-term and long-term renters, combined with limited new supply, makes Dubai Marina one of the most resilient investment destinations in the UAE.',
          },
        ]}
      />

      <ProjectMap
        sectionTitle="Location"
        body="Dubai Marina is centrally located between Sheikh Zayed Road and the Arabian Gulf, with outstanding connectivity to key business districts, airports, and leisure destinations across Dubai."
        latitude={25.0760}
        longitude={55.1338}
        zoom={14}
        proximity={[
          { label: 'Dubai International Airport', value: '35 min' },
          { label: 'Al Maktoum Airport (DWC)',    value: '25 min' },
          { label: 'Downtown Dubai / Burj Khalifa', value: '20 min' },
          { label: 'Palm Jumeirah',               value: '10 min' },
          { label: 'JBR Beach',                   value: '5 min'  },
          { label: 'Mall of the Emirates',        value: '15 min' },
        ]}
      />

      <ProjectAccordion
        sectionTitle="Frequently Asked Questions"
        items={[
          {
            question: 'Can foreigners buy property in Dubai Marina?',
            answer: 'Yes. Dubai Marina is a designated freehold zone, meaning foreign nationals can purchase, own, and sell property with full ownership rights — with no restrictions on nationality.',
          },
          {
            question: 'What types of properties are available?',
            answer: 'The area primarily offers high-rise apartments ranging from studios to 4-bedroom units, as well as a limited number of duplexes and penthouses with panoramic marina and sea views.',
          },
          {
            question: 'What is the average rental yield in Dubai Marina?',
            answer: 'Rental yields in Dubai Marina typically range between 6% and 8% gross per annum, depending on the building, floor, and unit configuration. Studios and 1-bedroom apartments generally achieve the highest yields.',
          },
          {
            question: 'Is Dubai Marina a good choice for families?',
            answer: 'Absolutely. The district offers a safe, walkable environment with multiple international schools nearby, green spaces, playgrounds, and a family-friendly promenade. Proximity to JBR Beach and Bluewaters Island adds to the appeal for families.',
          },
          {
            question: 'What is the service charge range in Dubai Marina?',
            answer: 'Service charges vary by building and typically range from AED 12 to AED 25 per sq ft per year. These cover building maintenance, security, shared amenities, and common area upkeep.',
          },
        ]}
      />

    </main>
  )
}
