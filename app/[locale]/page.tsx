import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Policy from "@/components/sections/Policy";
import Articles from "@/components/sections/Articles";
import Videos from "@/components/sections/Videos";
import Contact from "@/components/sections/Contact";
import { getArticles, getVideos, getSiteContent } from "@/lib/content";
import { getTranslations, Locale, locales, defaultLocale } from "@/lib/i18n";
import type { Metadata } from 'next';

// Force dynamic rendering to always show fresh content
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale: Locale = locales.includes(localeParam as Locale)
        ? (localeParam as Locale)
        : defaultLocale;

    const t = getTranslations(locale);

    const titles = {
        is: 'Róbert Ragnarsson - Frambjóðandi í prófkjöri Viðreisnar í Reykjavík',
        en: 'Róbert Ragnarsson - Candidate in Viðreisn Primary Election in Reykjavík',
        pl: 'Róbert Ragnarsson - Kandydat w wyborach wstępnych Viðreisn w Reykjavíku'
    };

    const descriptions = {
        is: 'Sérfræðingur í stjórnsýslu með rekstur sveitarfélaga sem sérsvið. Frambjóðandi til borgarstjórnar Reykjavíkur. Kominn er tími til raunverulegra breytinga.',
        en: 'Public administration specialist with municipal management expertise. Candidate for Reykjavík City Council. Time for real change.',
        pl: 'Specjalista ds. administracji publicznej z doświadczeniem w zarządzaniu gminami. Kandydat do Rady Miasta Reykjavíku. Czas na prawdziwą zmianę.'
    };

    return {
        title: titles[locale],
        description: descriptions[locale],
        keywords: locale === 'is'
            ? 'Róbert Ragnarsson, Viðreisn, Reykjavík, borgarstjórn, sveitarstjórnarkosningar, prófkjör'
            : locale === 'en'
                ? 'Róbert Ragnarsson, Viðreisn, Reykjavík, city council, municipal elections, primary'
                : 'Róbert Ragnarsson, Viðreisn, Reykjavík, rada miasta, wybory samorządowe',
        authors: [{ name: 'Róbert Ragnarsson' }],
        creator: 'Róbert Ragnarsson',
        publisher: 'Róbert Ragnarsson',
        alternates: {
            canonical: `https://www.robertragnars.is/${locale}`,
            languages: {
                'is': 'https://www.robertragnars.is/is',
                'en': 'https://www.robertragnars.is/en',
                'pl': 'https://www.robertragnars.is/pl',
            }
        },
        openGraph: {
            type: 'website',
            locale: locale === 'is' ? 'is_IS' : locale === 'en' ? 'en_US' : 'pl_PL',
            url: `https://www.robertragnars.is/${locale}`,
            title: titles[locale],
            description: descriptions[locale],
            siteName: 'Róbert Ragnarsson',
            images: [
                {
                    url: 'https://www.robertragnars.is/images/robert3.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Róbert Ragnarsson',
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: titles[locale],
            description: descriptions[locale],
            images: ['https://www.robertragnars.is/images/robert3.jpg'],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function Home({ params }: PageProps) {
    const { locale: localeParam } = await params;
    // Validate and cast locale
    const locale: Locale = locales.includes(localeParam as Locale)
        ? (localeParam as Locale)
        : defaultLocale;
    const articles = await getArticles();
    const videos = await getVideos();
    const siteContent = await getSiteContent(locale);
    const t = getTranslations(locale);

    // Structured Data (JSON-LD)
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Róbert Ragnarsson',
        jobTitle: locale === 'is' ? 'Frambjóðandi til borgarstjórnar' : 'City Council Candidate',
        affiliation: {
            '@type': 'Organization',
            name: 'Viðreisn',
            url: 'https://vidreisn.is'
        },
        url: 'https://www.robertragnars.is',
        image: 'https://www.robertragnars.is/images/robert3.jpg',
        sameAs: [
            'https://www.facebook.com/profile.php?id=61571738286908',
            'https://www.instagram.com/robertragnars/'
        ]
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Róbert Ragnarsson',
        url: 'https://www.robertragnars.is',
        inLanguage: [locale === 'is' ? 'is' : locale === 'en' ? 'en' : 'pl'],
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.robertragnars.is/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <main>
                <Hero locale={locale} t={t} />
                <About content={siteContent.about} />
                <Policy content={siteContent.policy} visionCards={siteContent.visionCards} />
                <Articles articles={articles} t={t} locale={locale} />
                <Videos videos={videos} t={t} />
                <Contact t={t} />
            </main>
        </>
    );
}
