import Link from 'next/link';
import Image from 'next/image';
import { translations } from '@/lib/i18n';

interface NewsItem {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    image: string;
}

interface NewsProps {
    news: NewsItem[];
    t: typeof translations['is'];
}

export default function News({ news, t }: NewsProps) {
    return (
        <section className="section news-section" id="frettir">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{t.news.title}</h2>
                </div>
                <div className="news-grid">
                    {news.slice(0, 3).map((item) => (
                        <Link href={`/frettir/${item.slug}`} key={item.id} className="news-card">
                            <div className="news-card-image">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={400}
                                        height={240}
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    <div className="placeholder-image"></div>
                                )}
                            </div>
                            <div className="news-card-content">
                                <span className="news-date">
                                    {new Date(item.date).toLocaleDateString('is-IS')}
                                </span>
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-excerpt">{item.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
