'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Video {
    id: string;
    slug: string;
    title: string;
    date: string;
    description: string;
    youtubeUrl: string;
    thumbnail: string;
}

const emptyForm = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    youtubeUrl: '',
    thumbnail: ''
};

export default function AdminVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        fetchVideos();
    }, []);

    async function fetchVideos() {
        try {
            const res = await fetch('/api/content?type=videos', { cache: 'no-store' });
            const data = await res.json();
            setVideos(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await fetch(`/api/content?type=videos&id=${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    resetForm();
                    fetchVideos();
                } else {
                    alert('Villa við að uppfæra myndskeiđ');
                }
            } else {
                const res = await fetch('/api/content?type=videos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    resetForm();
                    fetchVideos();
                } else {
                    alert('Villa við að vista myndskeiđ');
                }
            }
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Villa við að vista myndskeiđ');
        }
    }

    function resetForm() {
        setFormData(emptyForm);
        setShowForm(false);
        setEditingId(null);
    }

    function handleEdit(video: Video) {
        setFormData({
            title: video.title,
            date: video.date,
            description: video.description,
            youtubeUrl: video.youtubeUrl,
            thumbnail: video.thumbnail
        });
        setEditingId(video.id);
        setShowForm(true);
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/content?type=videos&id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setLoading(true);
                await fetchVideos();
            } else {
                alert('Villa við að eyđa myndskeiđi');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Villa við að eyđa myndskeiđi');
        }
    }

    if (loading) {
        return (
            <div className="admin-layout">
                <div className="container">
                    <p>Hleð gögnum...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <div className="admin-header">
                <div className="container">
                    <h1 className="admin-title">Myndskeiđ</h1>
                    <nav className="admin-nav">
                        <Link href="/admin">← Til baka</Link>
                        <Link href="/admin/articles">Greinar</Link>
                        <Link href="/admin/news">Fréttir</Link>
                    </nav>
                </div>
            </div>

            <div className="container">
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2>Öll myndskeiđ</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => showForm ? resetForm() : setShowForm(true)}
                        >
                            {showForm ? 'Hætta viđ' : '+ Nýtt myndskeiđ'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="admin-form" style={{ marginBottom: '32px', padding: '24px', background: 'var(--light)', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Breyta myndskeiđi' : 'Nýtt myndskeiđ'}</h3>
                            <div className="form-group">
                                <label>Titill</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Dagsetning</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>YouTube slóđ</label>
                                <input
                                    type="url"
                                    value={formData.youtubeUrl}
                                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                    placeholder="https://youtube.com/watch?v=..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Smámynd (valfrjálst - slóđ)</label>
                                <input
                                    type="text"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    placeholder="Ef tómt verđur YouTube smámynd notuđ"
                                />
                            </div>
                            <div className="form-group">
                                <label>Lýsing</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Stutt lýsing á myndskeiđinu..."
                                    required
                                    style={{ minHeight: '100px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Uppfæra myndskeiđ' : 'Vista myndskeiđ'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn btn-secondary" onClick={resetForm} style={{ background: 'var(--dark-600)', color: 'white' }}>
                                        Hætta við
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Titill</th>
                                <th>Dagsetning</th>
                                <th>YouTube</th>
                                <th>Ađgerđir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr key={video.id}>
                                    <td>{video.title}</td>
                                    <td>{new Date(video.date).toLocaleDateString('is-IS')}</td>
                                    <td>
                                        {video.youtubeUrl ? (
                                            <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                                Sjá myndband
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--dark-600)' }}>Engin slóđ</span>
                                        )}
                                    </td>
                                    <td className="admin-actions">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleEdit(video)}
                                            style={{ marginRight: '8px' }}
                                        >
                                            Breyta
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(video.id)}
                                        >
                                            Eyđa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
