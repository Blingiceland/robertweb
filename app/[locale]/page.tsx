import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Policy from "@/components/sections/Policy";
import News from "@/components/sections/News";
import Articles from "@/components/sections/Articles";
import Videos from "@/components/sections/Videos";
import Contact from "@/components/sections/Contact";
import { getArticles, getNews, getVideos, getSiteContent } from "@/lib/content";
import { getTranslations, Locale, locales, defaultLocale } from "@/lib/i18n";

// Force dynamic rendering to always show fresh content
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
    const { locale: localeParam } = await params;
    // Validate and cast locale
    const locale: Locale = locales.includes(localeParam as Locale)
        ? (localeParam as Locale)
        : defaultLocale;
    const articles = await getArticles();
    const news = await getNews();
    const videos = await getVideos();
    const siteContent = await getSiteContent(locale);
    const t = getTranslations(locale);

    return (
        <main>
            <Hero locale={locale} t={t} />
            <About content={siteContent.about} />
            <Policy content={siteContent.policy} visionCards={siteContent.visionCards} />
            <News news={news} t={t} />
            <Articles articles={articles} t={t} locale={locale} />
            <Videos videos={videos} t={t} />
            <Contact t={t} />
        </main>
    );
}
