import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';

interface Article {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    showOnHomepage?: boolean;
}

interface ArticlesProps {
    articles: Article[];
    t: typeof translations['is'];
    locale: Locale;
}

export default function Articles({ articles, t, locale }: ArticlesProps) {
    return (
        <section className="section articles-section" id="greinar">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{t.articles.title}</h2>
                </div>
                <div className="articles-grid">
                    {articles.filter(a => a.showOnHomepage !== false).map((article) => (
                        <Link href={`/${locale}/greinar/${article.slug}`} key={article.id} className="article-card">
                            <span className="article-date">
                                {new Date(article.date).toLocaleDateString('is-IS')}
                            </span>
                            <h3 className="article-title">{article.title}</h3>
                            <p className="article-excerpt">{article.excerpt}</p>
                            <span className="article-link">{t.articles.readMore}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
