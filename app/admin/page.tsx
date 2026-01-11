'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface ContentItem {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt?: string;
    description?: string;
}

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [articles, setArticles] = useState<ContentItem[]>([]);
    const [news, setNews] = useState<ContentItem[]>([]);
    const [videos, setVideos] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        try {
            const [articlesRes, newsRes, videosRes] = await Promise.all([
                fetch('/api/content?type=articles'),
                fetch('/api/content?type=news'),
                fetch('/api/content?type=videos'),
            ]);

            const articlesData = await articlesRes.json();
            const newsData = await newsRes.json();
            const videosData = await videosRes.json();

            setArticles(articlesData);
            setNews(newsData);
            setVideos(videosData);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleMigration() {
        if (!confirm('Ertu viss um að þú viljir endurstilla allt efni úr öryggisafriti? Þetta gæti yfirskrifað nýlegar breytingar.')) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/migrate', { method: 'POST' });
            const result = await res.json();

            if (result.success) {
                alert('Gagnaflutningur tókst! Endurhlaða síðunni...');
                window.location.reload();
            } else {
                alert('Gagnaflutningur mistókst: ' + JSON.stringify(result));
            }
        } catch (error) {
            console.error('Migration error:', error);
            alert('Villa kom upp við gagnaflutning');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-layout">
                <div className="container">
                    <p>Hleð gögnum... Vinsamlegast bíðið.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <div className="admin-header">
                <div className="container">
                    <h1 className="admin-title">Stjórnborð</h1>
                    <nav className="admin-nav">
                        <Link href="/admin/site">Síðuefni</Link>
                        <Link href="/admin/articles">Greinar ({articles.length})</Link>
                        <Link href="/admin/news">Fréttir ({news.length})</Link>
                        <Link href="/admin/videos">Myndskeið ({videos.length})</Link>
                        <Link href="/">← Forsíða</Link>
                        <button
                            onClick={logout}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Útskrá
                        </button>
                    </nav>
                </div>
            </div>

            <div className="container">
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2>Velkomin í stjórnborđ</h2>
                            <p style={{ marginTop: '16px', color: 'var(--dark-600)' }}>
                                Hér getur þú bætt við og breytt greinum, fréttum og myndböndum.
                            </p>
                        </div>
                        <button
                            onClick={handleMigration}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🔄 Flytja gögn í Blob
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '32px' }}>
                        <div style={{ padding: '24px', background: 'var(--light)', borderRadius: '12px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '48px', color: 'var(--primary)' }}>{articles.length}</h3>
                            <p>Greinar</p>
                        </div>
                        <div style={{ padding: '24px', background: 'var(--light)', borderRadius: '12px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '48px', color: 'var(--primary)' }}>{news.length}</h3>
                            <p>Fréttir</p>
                        </div>
                        <div style={{ padding: '24px', background: 'var(--light)', borderRadius: '12px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '48px', color: 'var(--primary)' }}>{videos.length}</h3>
                            <p>Myndskeiđ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
