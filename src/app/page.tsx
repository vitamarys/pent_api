import HeroHome from '@/components/sections/HeroHome';
import ProjectPromo from '@/components/sections/ProjectPromo';
import SimilarProjects from '@/components/sections/SimilarProjects';
import ProjectBanner from '@/components/sections/ProjectBanner';
import ProjectOfMonth from '@/components/sections/ProjectOfMonth';
import Areas from '@/components/sections/Areas';
import ProjectTeam from '@/components/sections/ProjectTeam';
import ProjectAwards from '@/components/sections/ProjectAwards';
import ProjectServices from '@/components/sections/ProjectServices';
import NewsSlider from '@/components/sections/NewsSlider';
import ProjectAccordion from '@/components/sections/ProjectAccordion';
import ProjectForm from '@/components/sections/ProjectForm';
import { MOCK_HERO_HOME, MOCK_HOME_PROMO, MOCK_SIMILAR_PROJECTS, MOCK_PROJECT_OF_MONTH, MOCK_AREAS, MOCK_PROJECT_TEAM, MOCK_PROJECT_AWARDS, MOCK_PROJECT_SERVICES, MOCK_NEWS, MOCK_PROJECT_ACCORDION, MOCK_PROJECT_FORM } from '@/data/mock';

export default function HomePage() {
  return (
    <main>
      <HeroHome {...MOCK_HERO_HOME} />
      <ProjectPromo bg="white" {...MOCK_HOME_PROMO} />
      <SimilarProjects
        projects={MOCK_SIMILAR_PROJECTS}
        sectionTitle="Latest luxury projects"
        ctaLabel="See all projects"
        ctaHref="/projects"
      />
      <ProjectBanner
        title="Get professional property guidance"
        description="Leave your details, and an advisor will help you choose the right property and navigate the purchase process."
        ctaLabel="Learn more"
        ctaHref="#"
        image={{ url: '/images/banner-bg.png' }}
      />
      <ProjectOfMonth
        projects={MOCK_PROJECT_OF_MONTH}
        sectionTitle="Project of the month"
        ctaLabel="Learn more"
      />
      <Areas
        areas={MOCK_AREAS}
        sectionTitle="Best Areas for Luxury living in Dubai"
        ctaLabel="See all Areas"
        ctaHref="/areas"
      />
      <ProjectBanner
        title="Get professional property guidance"
        description="Leave your details, and an advisor will help you choose the right property and navigate the purchase process."
        ctaLabel="Learn more"
        ctaHref="#"
        image={{ url: '/images/banner-bg.png' }}
      />
      <ProjectTeam {...MOCK_PROJECT_TEAM} />
      <ProjectAwards {...MOCK_PROJECT_AWARDS} />
      <ProjectServices {...MOCK_PROJECT_SERVICES} />
      <NewsSlider
        news={MOCK_NEWS}
        sectionTitle="Latest news"
        ctaLabel="See all news"
        ctaHref="/news"
      />
      <ProjectAccordion {...MOCK_PROJECT_ACCORDION} />
      <ProjectForm {...MOCK_PROJECT_FORM} />
    </main>
  );
}
