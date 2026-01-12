import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.robertragnars.is';
    const articles = await getArticles();

    // Main pages for each locale
    const locales = ['is', 'en', 'pl'];
    const mainPages = locales.map(locale => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Article pages
    const articlePages = articles.flatMap(article =>
        locales.map(locale => ({
            url: `${baseUrl}/${locale}/greinar/${article.slug}`,
            lastModified: new Date(article.date),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    );

    return [
        ...mainPages,
        ...articlePages,
    ];
}
