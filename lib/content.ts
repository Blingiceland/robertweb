import { put, head } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

export interface Article {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image: string;
}

export interface NewsItem {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image: string;
}

export interface Video {
    id: string;
    slug: string;
    title: string;
    date: string;
    description: string;
    youtubeUrl: string;
    thumbnail: string;
}

const contentDir = path.join(process.cwd(), 'content');

export async function getArticles(): Promise<Article[]> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'articles.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }

    try {
        const blob = await head('articles.json');
        const response = await fetch(blob.url);
        const data = await response.text();
        return JSON.parse(data);
    } catch (error) {
        // If blob doesn't exist yet, return empty array
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const articles = await getArticles();
    return articles.find((a) => a.slug === slug);
}

export async function getNews(): Promise<NewsItem[]> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'news.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }

    try {
        const blob = await head('news.json');
        const response = await fetch(blob.url);
        const data = await response.text();
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
    const news = await getNews();
    return news.find((n) => n.slug === slug);
}

export async function getVideos(): Promise<Video[]> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'videos.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }

    try {
        const blob = await head('videos.json');
        const response = await fetch(blob.url);
        const data = await response.text();
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveArticles(articles: Article[]): Promise<void> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'articles.json');
        await fs.writeFile(filePath, JSON.stringify(articles, null, 2));
    } else {
        await put('articles.json', JSON.stringify(articles, null, 2), {
            access: 'public'
        });
    }
}

export async function saveNews(news: NewsItem[]): Promise<void> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'news.json');
        await fs.writeFile(filePath, JSON.stringify(news, null, 2));
    } else {
        await put('news.json', JSON.stringify(news, null, 2), {
            access: 'public'
        });
    }
}

export async function saveVideos(videos: Video[]): Promise<void> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'videos.json');
        await fs.writeFile(filePath, JSON.stringify(videos, null, 2));
    } else {
        await put('videos.json', JSON.stringify(videos, null, 2), {
            access: 'public'
        });
    }
}

export interface VisionCard {
    id: string;
    icon: string;
    title: string;
    text: string;
}

export interface LocalizedAbout {
    title: string;
    paragraphs: string[];
}

export interface LocalizedPolicy {
    title: string;
    intro: string[];
    highlight: string;
}

export interface SiteContentRaw {
    about: Record<string, LocalizedAbout>;
    policy: Record<string, LocalizedPolicy>;
    visionCards: Record<string, VisionCard[]>;
}

export interface SiteContent {
    about: LocalizedAbout;
    policy: LocalizedPolicy;
    visionCards: VisionCard[];
}

export async function getSiteContentRaw(): Promise<SiteContentRaw> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'site.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }

    try {
        const blob = await head('site.json');
        const response = await fetch(blob.url);
        const data = await response.text();
        return JSON.parse(data);
    } catch (error) {
        // Return default structure if blob doesn't exist
        return { about: {}, policy: {}, visionCards: {} };
    }
}

// Default content objects to prevent crashes
const defaultAbout: LocalizedAbout = {
    title: '',
    paragraphs: []
};

const defaultPolicy: LocalizedPolicy = {
    title: '',
    intro: [],
    highlight: ''
};

export async function getSiteContent(locale: string = 'is'): Promise<SiteContent> {
    const raw = await getSiteContentRaw();

    // Safely get content with fallbacks
    // First try requested locale, then 'is', then default empty object
    const about = (raw.about?.[locale] || raw.about?.['is'] || defaultAbout);
    const policy = (raw.policy?.[locale] || raw.policy?.['is'] || defaultPolicy);
    const visionCards = (raw.visionCards?.[locale] || raw.visionCards?.['is'] || []);

    return {
        about,
        policy,
        visionCards
    };
}

export async function saveSiteContent(content: SiteContentRaw): Promise<void> {
    if (isDevelopment) {
        const filePath = path.join(process.cwd(), 'content', 'site.json');
        await fs.writeFile(filePath, JSON.stringify(content, null, 4));
    } else {
        await put('site.json', JSON.stringify(content, null, 4), {
            access: 'public'
        });
    }
}

