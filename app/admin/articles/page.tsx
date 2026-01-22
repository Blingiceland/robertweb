'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface LocalizedContent {
    title: string;
    excerpt: string;
    content: string;
}

interface Article {
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
    showOnHomepage?: boolean;
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
    pl: { ...emptyLocalizedContent },
    showOnHomepage: true
};

type Locale = 'is' | 'en' | 'pl';

export default function AdminArticles() {
    const { logout } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [activeLocale, setActiveLocale] = useState<Locale>('is');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    async function fetchArticles() {
        try {
            const res = await fetch('/api/content?type=articles', { cache: 'no-store' });
            const data = await res.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
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

    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
            pl: formData.pl,
            showOnHomepage: formData.showOnHomepage
        };

        try {
            if (editingId) {
                const res = await fetch(`/api/content?type=articles&id=${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    setSuccessMessage('Grein uppfærð!');
                    resetForm();
                    await fetchArticles();
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    alert('Villa við að uppfæra grein');
                }
            } else {
                const res = await fetch('/api/content?type=articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    setSuccessMessage('Grein vistuð!');
                    resetForm();
                    await fetchArticles();
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    alert('Villa við að vista grein');
                }
            }
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Villa við að vista grein');
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

    function handleEdit(article: Article) {
        setFormData({
            date: article.date,
            image: article.image,
            is: article.is || { title: article.title, excerpt: article.excerpt, content: article.content },
            en: article.en || { title: '', excerpt: '', content: '' },
            pl: article.pl || { title: '', excerpt: '', content: '' },
            showOnHomepage: article.showOnHomepage ?? true
        });
        setEditingId(article.id);
        setShowForm(true);
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/content?type=articles&id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setLoading(true);
                await fetchArticles();
            } else {
                alert('Villa við að eyða grein');
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Villa við að eyða grein');
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
                    <h1 className="admin-title">Greinar</h1>
                    <nav className="admin-nav">
                        <Link href="/admin">← Til baka</Link>
                        <Link href="/admin/news">Fréttir</Link>
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
                        <h2>Allar greinar</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }
                            }}
                        >
                            {showForm ? 'Hætta viđ' : '+ Ný grein'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="admin-form" style={{ marginBottom: '32px', padding: '24px', background: 'var(--light)', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Breyta grein' : 'Ný grein'}</h3>

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
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="showOnHomepage"
                                    checked={formData.showOnHomepage}
                                    onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                                    style={{ width: 'auto', margin: 0 }}
                                />
                                <label htmlFor="showOnHomepage" style={{ marginBottom: 0 }}>Sýna á forsíðu</label>
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
                                        <p style={{ fontSize: '12px', color: 'var(--dark-600)', marginTop: '4px' }}>{formData.image}</p>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Vista...' : (editingId ? 'Uppfæra grein' : 'Vista grein')}
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
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        <Link href={`/greinar/${article.slug}`} style={{ color: 'var(--primary)' }}>
                                            {article.title}
                                        </Link>
                                    </td>
                                    <td>
                                        {article.is?.title && '🇮🇸'}
                                        {article.en?.title && ' 🇬🇧'}
                                        {article.pl?.title && ' 🇵🇱'}
                                        {!article.is?.title && !article.en?.title && !article.pl?.title && '🇮🇸'}
                                    </td>
                                    <td>{new Date(article.date).toLocaleDateString('is-IS')}</td>
                                    <td className="admin-actions">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleEdit(article)}
                                            style={{ marginRight: '8px' }}
                                        >
                                            Breyta
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(article.id)}
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
