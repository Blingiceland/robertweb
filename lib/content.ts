import { promises as fs } from 'fs';
import path from 'path';

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
    const filePath = path.join(contentDir, 'articles.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const articles = await getArticles();
    return articles.find((a) => a.slug === slug);
}

export async function getNews(): Promise<NewsItem[]> {
    const filePath = path.join(contentDir, 'news.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
    const news = await getNews();
    return news.find((n) => n.slug === slug);
}

export async function getVideos(): Promise<Video[]> {
    const filePath = path.join(contentDir, 'videos.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function saveArticles(articles: Article[]): Promise<void> {
    const filePath = path.join(contentDir, 'articles.json');
    await fs.writeFile(filePath, JSON.stringify(articles, null, 2));
}

export async function saveNews(news: NewsItem[]): Promise<void> {
    const filePath = path.join(contentDir, 'news.json');
    await fs.writeFile(filePath, JSON.stringify(news, null, 2));
}

export async function saveVideos(videos: Video[]): Promise<void> {
    const filePath = path.join(contentDir, 'videos.json');
    await fs.writeFile(filePath, JSON.stringify(videos, null, 2));
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
    const filePath = path.join(contentDir, 'site.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function getSiteContent(locale: string = 'is'): Promise<SiteContent> {
    const raw = await getSiteContentRaw();
    return {
        about: raw.about[locale] || raw.about['is'],
        policy: raw.policy[locale] || raw.policy['is'],
        visionCards: raw.visionCards[locale] || raw.visionCards['is']
    };
}

export async function saveSiteContent(content: SiteContentRaw): Promise<void> {
    const filePath = path.join(contentDir, 'site.json');
    await fs.writeFile(filePath, JSON.stringify(content, null, 4));
}

