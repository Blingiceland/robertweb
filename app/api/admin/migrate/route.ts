import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { defaultSiteContent, defaultArticles, defaultNews, defaultVideos } from '@/lib/defaultContent';

export async function POST(request: NextRequest) {
    try {
        const results = [];

        // 1. Site Content
        try {
            await put('site.json', JSON.stringify(defaultSiteContent, null, 2), {
                access: 'public',
                addRandomSuffix: false
            });
            results.push({ file: 'site.json', status: 'success' });
        } catch (error) {
            console.error('Error migrating site.json:', error);
            results.push({ file: 'site.json', status: 'error', error: String(error) });
        }

        // 2. Articles
        try {
            await put('articles.json', JSON.stringify(defaultArticles, null, 2), {
                access: 'public',
                addRandomSuffix: false
            });
            results.push({ file: 'articles.json', status: 'success' });
        } catch (error) {
            console.error('Error migrating articles.json:', error);
            results.push({ file: 'articles.json', status: 'error', error: String(error) });
        }

        // 3. News
        try {
            await put('news.json', JSON.stringify(defaultNews, null, 2), {
                access: 'public',
                addRandomSuffix: false
            });
            results.push({ file: 'news.json', status: 'success' });
        } catch (error) {
            console.error('Error migrating news.json:', error);
            results.push({ file: 'news.json', status: 'error', error: String(error) });
        }

        // 4. Videos
        try {
            await put('videos.json', JSON.stringify(defaultVideos, null, 2), {
                access: 'public',
                addRandomSuffix: false
            });
            results.push({ file: 'videos.json', status: 'success' });
        } catch (error) {
            console.error('Error migrating videos.json:', error);
            results.push({ file: 'videos.json', status: 'error', error: String(error) });
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
