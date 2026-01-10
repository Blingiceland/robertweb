import Link from 'next/link';
import { getNewsBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';

// Force dynamic rendering to always show fresh content
export const dynamic = 'force-dynamic';


export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const newsItem = await getNewsBySlug(slug);

    if (!newsItem) {
        notFound();
    }

    // Simple markdown to HTML (basic conversion)
    const contentHtml = newsItem.content
        .split('\n\n')
        .map((paragraph) => {
            if (paragraph.startsWith('# ')) {
                return `<h1>${paragraph.slice(2)}</h1>`;
            }
            if (paragraph.startsWith('## ')) {
                return `<h2>${paragraph.slice(3)}</h2>`;
            }
            if (paragraph.startsWith('### ')) {
                return `<h3>${paragraph.slice(4)}</h3>`;
            }
            if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').map(line => `<li>${line.slice(2)}</li>`).join('');
                return `<ul>${items}</ul>`;
            }
            return `<p>${paragraph}</p>`;
        })
        .join('');

    return (
        <article className="article-detail">
            <div className="container">
                <Link href="/#frettir" className="back-link">← Til baka</Link>
                <div className="article-detail-header">
                    <p className="article-detail-date">{new Date(newsItem.date).toLocaleDateString('is-IS')}</p>
                    <h1 className="article-detail-title">{newsItem.title}</h1>
                </div>
                <div
                    className="article-detail-content"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            </div>
        </article>
    );
}
