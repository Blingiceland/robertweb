'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface LocalizedContent {
    title: string;
    excerpt: string;
    content: string;
}

interface NewsItem {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image: string;
    // Multilingual fields
    is?: LocalizedContent;
    en?: LocalizedContent;
    pl?: LocalizedContent;
}

const emptyLocalizedContent: LocalizedContent = {
    title: '',
    excerpt: '',
    content: ''
};

const emptyForm = {
    date: new Date().toISOString().split('T')[0],
    image: '/images/Frame 14687.png',
    is: { ...emptyLocalizedContent },
    en: { ...emptyLocalizedContent },
    pl: { ...emptyLocalizedContent }
};

type Locale = 'is' | 'en' | 'pl';

export default function AdminNews() {
    const { logout } = useAuth();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [activeLocale, setActiveLocale] = useState<Locale>('is');
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    async function fetchNews() {
        try {
            const res = await fetch('/api/content?type=news', { cache: 'no-store' });
            const data = await res.json();
            setNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            });

            const result = await res.json();
            if (result.success) {
                setFormData({ ...formData, image: result.url });
            } else {
                alert('Villa við að hlaða upp mynd: ' + result.error);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Villa við að hlaða upp mynd');
        } finally {
            setUploading(false);
        }
    }

    function updateLocaleField(locale: Locale, field: keyof LocalizedContent, value: string) {
        setFormData({
            ...formData,
            [locale]: {
                ...formData[locale],
                [field]: value
            }
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage('');

        // Use Icelandic as the main/fallback content
        const payload = {
            title: formData.is.title || formData.en.title || formData.pl.title,
            excerpt: formData.is.excerpt || formData.en.excerpt || formData.pl.excerpt,
            content: formData.is.content || formData.en.content || formData.pl.content,
            date: formData.date,
            image: formData.image,
            is: formData.is,
            en: formData.en,
            pl: formData.pl
        };

        try {
            if (editingId) {
                const res = await fetch(`/api/content?type=news&id=${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    setSuccessMessage('Frétt uppfærð!');
                    resetForm();
                    await fetchNews();
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    alert('Villa við að uppfæra frétt');
                }
            } else {
                const res = await fetch('/api/content?type=news', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    setSuccessMessage('Frétt vistuð!');
                    resetForm();
                    await fetchNews();
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    alert('Villa við að vista frétt');
                }
            }
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Villa við að vista frétt');
        } finally {
            setSaving(false);
        }
    }

    function resetForm() {
        setFormData(emptyForm);
        setShowForm(false);
        setEditingId(null);
        setActiveLocale('is');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function handleEdit(item: NewsItem) {
        setFormData({
            date: item.date,
            image: item.image,
            is: item.is || { title: item.title, excerpt: item.excerpt, content: item.content },
            en: item.en || { title: '', excerpt: '', content: '' },
            pl: item.pl || { title: '', excerpt: '', content: '' }
        });
        setEditingId(item.id);
        setShowForm(true);
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/content?type=news&id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setLoading(true);
                await fetchNews();
            } else {
                alert('Villa við að eyða frétt');
            }
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Villa við að eyða frétt');
        }
    }

    const localeLabels: Record<Locale, string> = {
        is: '🇮🇸 Íslenska',
        en: '🇬🇧 English',
        pl: '🇵🇱 Polski'
    };

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
                    <h1 className="admin-title">Fréttir</h1>
                    <nav className="admin-nav">
                        <Link href="/admin">← Til baka</Link>
                        <Link href="/admin/articles">Greinar</Link>
                        <Link href="/admin/videos">Myndskeiđ</Link>
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
                {successMessage && (
                    <div style={{
                        background: '#4CAF50',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontWeight: 'bold'
                    }}>
                        ✓ {successMessage}
                    </div>
                )}
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2>Allar fréttir</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => showForm ? resetForm() : setShowForm(true)}
                        >
                            {showForm ? 'Hætta viđ' : '+ Ný frétt'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="admin-form" style={{ marginBottom: '32px', padding: '24px', background: 'var(--light)', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Breyta frétt' : 'Ný frétt'}</h3>

                            {/* Language Tabs */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                {(['is', 'en', 'pl'] as Locale[]).map((locale) => (
                                    <button
                                        key={locale}
                                        type="button"
                                        onClick={() => setActiveLocale(locale)}
                                        style={{
                                            padding: '10px 20px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            background: activeLocale === locale ? 'var(--primary)' : 'white',
                                            color: activeLocale === locale ? 'white' : 'var(--dark)',
                                            boxShadow: activeLocale === locale ? '0 2px 8px rgba(224, 112, 32, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {localeLabels[locale]}
                                    </button>
                                ))}
                            </div>

                            {/* Localized Fields */}
                            <div className="form-group">
                                <label>Titill ({localeLabels[activeLocale]})</label>
                                <input
                                    type="text"
                                    value={formData[activeLocale].title}
                                    onChange={(e) => updateLocaleField(activeLocale, 'title', e.target.value)}
                                    placeholder={activeLocale === 'is' ? 'Titill á íslensku (skylda)' : 'Valfrjálst'}
                                    required={activeLocale === 'is'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Stutt lýsing ({localeLabels[activeLocale]})</label>
                                <input
                                    type="text"
                                    value={formData[activeLocale].excerpt}
                                    onChange={(e) => updateLocaleField(activeLocale, 'excerpt', e.target.value)}
                                    placeholder={activeLocale === 'is' ? 'Stutt lýsing á íslensku (skylda)' : 'Valfrjálst'}
                                    required={activeLocale === 'is'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Efni ({localeLabels[activeLocale]})</label>
                                <textarea
                                    value={formData[activeLocale].content}
                                    onChange={(e) => updateLocaleField(activeLocale, 'content', e.target.value)}
                                    placeholder={activeLocale === 'is' ? '# Fyrirsögn\n\nTexti hér... (skylda)' : 'Valfrjálst'}
                                    required={activeLocale === 'is'}
                                />
                            </div>

                            {/* Non-localized fields */}
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
                                <label>Mynd</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        style={{ flex: 1 }}
                                    />
                                    {uploading && <span>Hleð upp...</span>}
                                </div>
                                {formData.image && (
                                    <div style={{ marginTop: '8px' }}>
                                        <img src={formData.image} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Vista...' : (editingId ? 'Uppfæra frétt' : 'Vista frétt')}
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
                                <th>Tungumál</th>
                                <th>Dagsetning</th>
                                <th>Ađgerđir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <Link href={`/frettir/${item.slug}`} style={{ color: 'var(--primary)' }}>
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td>
                                        {item.is?.title && '🇮🇸'}
                                        {item.en?.title && ' 🇬🇧'}
                                        {item.pl?.title && ' 🇵🇱'}
                                        {!item.is?.title && !item.en?.title && !item.pl?.title && '🇮🇸'}
                                    </td>
                                    <td>{new Date(item.date).toLocaleDateString('is-IS')}</td>
                                    <td className="admin-actions">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleEdit(item)}
                                            style={{ marginRight: '8px' }}
                                        >
                                            Breyta
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(item.id)}
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
