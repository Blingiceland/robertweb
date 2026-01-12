import { NextRequest, NextResponse } from 'next/server';
import { getArticles, getNews, getVideos, saveArticles, saveNews, saveVideos, getSiteContent, saveSiteContent, getSiteContentRaw } from '@/lib/content';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    try {
        switch (type) {
            case 'articles':
                const articles = await getArticles();
                return NextResponse.json(articles, { headers: { 'Cache-Control': 'no-store' } });
            case 'news':
                const news = await getNews();
                return NextResponse.json(news, { headers: { 'Cache-Control': 'no-store' } });
            case 'videos':
                const videos = await getVideos();
                return NextResponse.json(videos, { headers: { 'Cache-Control': 'no-store' } });
            case 'site':
                const site = await getSiteContent();
                return NextResponse.json(site, { headers: { 'Cache-Control': 'no-store' } });
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const body = await request.json();

    try {
        switch (type) {
            case 'articles':
                const articles = await getArticles();
                const newArticle = {
                    ...body,
                    id: Date.now().toString(),
                    slug: body.title.toLowerCase()
                        .replace(/[áàâä]/g, 'a')
                        .replace(/[éèêë]/g, 'e')
                        .replace(/[íìîï]/g, 'i')
                        .replace(/[óòôö]/g, 'o')
                        .replace(/[úùûü]/g, 'u')
                        .replace(/[ýÿ]/g, 'y')
                        .replace(/[đ]/g, 'd')
                        .replace(/[þ]/g, 'th')
                        .replace(/[æ]/g, 'ae')
                        .replace(/[ő]/g, 'o')
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                };
                articles.unshift(newArticle);
                await saveArticles(articles);
                return NextResponse.json(newArticle);

            case 'news':
                const news = await getNews();
                const newNews = {
                    ...body,
                    id: Date.now().toString(),
                    slug: body.title.toLowerCase()
                        .replace(/[áàâä]/g, 'a')
                        .replace(/[éèêë]/g, 'e')
                        .replace(/[íìîï]/g, 'i')
                        .replace(/[óòôö]/g, 'o')
                        .replace(/[úùûü]/g, 'u')
                        .replace(/[ýÿ]/g, 'y')
                        .replace(/[đ]/g, 'd')
                        .replace(/[þ]/g, 'th')
                        .replace(/[æ]/g, 'ae')
                        .replace(/[ő]/g, 'o')
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                };
                news.unshift(newNews);
                await saveNews(news);
                return NextResponse.json(newNews);

            case 'videos':
                const videos = await getVideos();
                const newVideo = {
                    ...body,
                    id: Date.now().toString(),
                    slug: body.title.toLowerCase()
                        .replace(/[áàâä]/g, 'a')
                        .replace(/[éèêë]/g, 'e')
                        .replace(/[íìîï]/g, 'i')
                        .replace(/[óòôö]/g, 'o')
                        .replace(/[úùûü]/g, 'u')
                        .replace(/[ýÿ]/g, 'y')
                        .replace(/[đ]/g, 'd')
                        .replace(/[þ]/g, 'th')
                        .replace(/[æ]/g, 'ae')
                        .replace(/[ő]/g, 'o')
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                };
                videos.unshift(newVideo);
                await saveVideos(videos);
                return NextResponse.json(newVideo);

            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error saving content:', error);
        return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    try {
        switch (type) {
            case 'articles':
                const articles = await getArticles();
                const filteredArticles = articles.filter(a => a.id !== id);
                await saveArticles(filteredArticles);
                return NextResponse.json({ success: true });

            case 'news':
                const news = await getNews();
                const filteredNews = news.filter(n => n.id !== id);
                await saveNews(filteredNews);
                return NextResponse.json({ success: true });

            case 'videos':
                const videos = await getVideos();
                const filteredVideos = videos.filter(v => v.id !== id);
                await saveVideos(filteredVideos);
                return NextResponse.json({ success: true });

            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error deleting content:', error);
        return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const body = await request.json();

    // Site content doesn't need an ID
    if (type === 'site') {
        try {
            // Get raw content to preserve structure and other locales
            const raw = await getSiteContentRaw();

            // Ensure structure exists (handling potential corrupted/migrated data)
            if (!raw.about) raw.about = {};
            if (!raw.policy) raw.policy = {};
            if (!raw.visionCards) raw.visionCards = {};

            // Update content for default locale ('is')
            // The body matches the SiteContent interface (simplified)
            if (body.about) raw.about['is'] = body.about;
            if (body.policy) raw.policy['is'] = body.policy;
            if (body.visionCards) raw.visionCards['is'] = body.visionCards;

            await saveSiteContent(raw);
            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Error saving site content:', error);
            return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 });
        }
    }

    if (!id) {
        return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    try {
        switch (type) {
            case 'articles':
                const articles = await getArticles();
                const articleIndex = articles.findIndex(a => a.id === id);
                if (articleIndex === -1) {
                    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
                }
                articles[articleIndex] = { ...articles[articleIndex], ...body };
                await saveArticles(articles);
                return NextResponse.json(articles[articleIndex]);

            case 'news':
                const news = await getNews();
                const newsIndex = news.findIndex(n => n.id === id);
                if (newsIndex === -1) {
                    return NextResponse.json({ error: 'News not found' }, { status: 404 });
                }
                news[newsIndex] = { ...news[newsIndex], ...body };
                await saveNews(news);
                return NextResponse.json(news[newsIndex]);

            case 'videos':
                const videos = await getVideos();
                const videoIndex = videos.findIndex(v => v.id === id);
                if (videoIndex === -1) {
                    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
                }
                videos[videoIndex] = { ...videos[videoIndex], ...body };
                await saveVideos(videos);
                return NextResponse.json(videos[videoIndex]);

            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating content:', error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
