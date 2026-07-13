import HeroHome from '@/components/sections/HeroHome';
import SimilarProjects, { type SimilarProjectItem } from '@/components/sections/SimilarProjects';
import ProjectBanner from '@/components/sections/ProjectBanner';
import Areas, { type AreaItem } from '@/components/sections/Areas';
import NewsSlider, { type NewsItem } from '@/components/sections/NewsSlider';
import ProjectForm from '@/components/sections/ProjectForm';
import { getProjects } from '@/api/listings';
import { getAreas } from '@/api/areas';
import { getArticles } from '@/api/articles';
import { getStrapiImageUrl } from '@/lib/utils';
import type { OffPlanProjectCard } from '@/types/penthouse-api';

export const revalidate = 3600;

function toSimilarProjectItem(p: OffPlanProjectCard): SimilarProjectItem {
  return {
    slug: p.pageUrl?.url?.replace(/^\/(off-plan|projects)\//, '').replace(/\/$/, '') ?? String(p.id),
    title: p.title ?? '',
    location: p.area?.title,
    developer: p.developer?.name,
    handover: p.handover ?? undefined,
    priceFrom: p.minPrice ?? undefined,
    propertyTypes: p.projectTypes?.map((t) => t.name),
    images: p.previewImageFile ? [getStrapiImageUrl(p.previewImageFile.url)] : [],
  };
}

export default async function HomePage() {
  const [projectsRes, areasRes, articlesRes] = await Promise.all([
    getProjects({ pageSize: 8, sort: 'newest' }).catch(() => null),
    getAreas({ pageSize: 6 }).catch(() => null),
    getArticles({ pageSize: 4 }),
  ]);

  const projects = projectsRes?.result.data ?? [];
  const similarProjects: SimilarProjectItem[] = projects.map(toSimilarProjectItem);

  const areas: AreaItem[] = (areasRes?.data ?? []).map((area) => ({
    name: area.title,
    slug: area.pageUrl?.url?.replace(/^\/areas\//, '').replace(/\/$/, '') ?? String(area.id),
    image: area.previewImageFile ? getStrapiImageUrl(area.previewImageFile.url) : '',
  }));

  const news: NewsItem[] = (articlesRes?.data ?? []).map((article) => ({
    slug: article.pageUrl?.url?.replace(/^\/(articles|blog)\//, '').replace(/\/$/, '') ?? String(article.id),
    title: article.title,
    excerpt: article.summary ?? '',
    tag: article.category ?? '',
    date: article.date,
    readTime: article.timeToRead ?? '',
    image: article.previewImage ? getStrapiImageUrl(article.previewImage.url) : '',
    href: article.pageUrl?.url,
  }));

  return (
    <main>
      <HeroHome
        title="All luxury properties of Dubai in one place"
        subtitle="Tailored access to Dubai's prime real estate, curated for your lifestyle by our full-cycle real estate services."
      />
      {similarProjects.length > 0 && (
        <SimilarProjects
          projects={similarProjects}
          sectionTitle="Latest luxury projects"
          ctaLabel="See all projects"
          ctaHref="/off-plan"
        />
      )}
      <ProjectBanner
        title="Get professional property guidance"
        description="Leave your details, and an advisor will help you choose the right property and navigate the purchase process."
        ctaLabel="Learn more"
        ctaHref="#"
        image={{ url: '/images/banner-bg.png' }}
      />
      {areas.length > 0 && (
        <Areas
          areas={areas}
          sectionTitle="Best Areas for Luxury living in Dubai"
          ctaLabel="See all Areas"
          ctaHref="/areas"
        />
      )}
      {news.length > 0 && (
        <NewsSlider
          news={news}
          sectionTitle="Latest news"
          ctaLabel="See all news"
          ctaHref="/articles"
        />
      )}
      <ProjectForm
        sectionTitle="Request Information"
        description="Fill in the form below and our specialist will contact you within 24 hours."
        submitLabel="Send Request"
      />
    </main>
  );
}
