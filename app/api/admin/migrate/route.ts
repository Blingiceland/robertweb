import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';
import { promises as fs } from 'fs';

// Content types to migrate
const CONTENT_FILES = ['site.json', 'articles.json', 'news.json', 'videos.json'];

export async function POST(request: NextRequest) {
    try {
        const results = [];
        const contentDir = path.join(process.cwd(), 'content');

        for (const filename of CONTENT_FILES) {
            try {
                // Read from local filesystem (deployment bundle)
                const filePath = path.join(contentDir, filename);
                const fileContent = await fs.readFile(filePath, 'utf-8');

                // Parse to ensure validity
                const jsonContent = JSON.parse(fileContent);

                // Upload to Vercel Blob
                await put(filename, JSON.stringify(jsonContent, null, 2), {
                    access: 'public'
                });

                results.push({ file: filename, status: 'success' });
            } catch (error) {
                console.error(`Error migrating ${filename}:`, error);
                results.push({ file: filename, status: 'error', error: String(error) });
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
