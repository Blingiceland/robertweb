'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VisionCard {
    id: string;
    icon: string;
    title: string;
    text: string;
}

interface LocalizedAbout {
    title: string;
    paragraphs: string[];
}

interface LocalizedPolicy {
    title: string;
    intro: string[];
    highlight: string;
}

interface SiteContentRaw {
    about: Record<string, LocalizedAbout>;
    policy: Record<string, LocalizedPolicy>;
    visionCards: Record<string, VisionCard[]>;
}

const locales = [
    { code: 'is', name: 'Íslenska' },
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polski' }
];

export default function AdminSite() {
    const [content, setContent] = useState<SiteContentRaw | null>(null);
    const [selectedLocale, setSelectedLocale] = useState<string>('is');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'about' | 'policy' | 'cards'>('about');

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        try {
            // Fetch raw mode to get all languages
            const res = await fetch('/api/content?type=site&mode=raw', { cache: 'no-store' });
            const data = await res.json();
            setContent(data);
        } catch (error) {
            console.error('Error fetching site content:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!content) return;
        setSaving(true);
        try {
            const res = await fetch('/api/content?type=site&mode=raw', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });

            if (res.ok) {
                setSuccessMessage('Vistað!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                alert('Villa við að vista');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Villa við að vista');
        } finally {
            setSaving(false);
        }
    }

    // Helper to ensure locale object exists
    function ensureLocale(section: 'about' | 'policy' | 'visionCards') {
        if (!content) return null;
        if (!content[section][selectedLocale]) {
            // Return empty structure based on section
            if (section === 'about') return { title: '', paragraphs: [] };
            if (section === 'policy') return { title: '', intro: [], highlight: '' };
            if (section === 'visionCards') return [];
        }
        return content[section][selectedLocale];
    }

    // --- About Helpers ---

    function getAbout() {
        return (content?.about[selectedLocale] || { title: '', paragraphs: [] }) as LocalizedAbout;
    }

    function updateAbout(updates: Partial<LocalizedAbout>) {
        if (!content) return;
        const current = getAbout();
        setContent({
            ...content,
            about: {
                ...content.about,
                [selectedLocale]: { ...current, ...updates }
            }
        });
    }

    function updateAboutParagraph(index: number, value: string) {
        const current = getAbout();
        const newParagraphs = [...current.paragraphs];
        newParagraphs[index] = value;
        updateAbout({ paragraphs: newParagraphs });
    }

    function addAboutParagraph() {
        const current = getAbout();
        updateAbout({ paragraphs: [...current.paragraphs, ''] });
    }

    function removeAboutParagraph(index: number) {
        const current = getAbout();
        const newParagraphs = current.paragraphs.filter((_, i) => i !== index);
        updateAbout({ paragraphs: newParagraphs });
    }

    // --- Policy Helpers ---

    function getPolicy() {
        return (content?.policy[selectedLocale] || { title: '', intro: [], highlight: '' }) as LocalizedPolicy;
    }

    function updatePolicy(updates: Partial<LocalizedPolicy>) {
        if (!content) return;
        const current = getPolicy();
        setContent({
            ...content,
            policy: {
                ...content.policy,
                [selectedLocale]: { ...current, ...updates }
            }
        });
    }

    function updatePolicyIntro(index: number, value: string) {
        const current = getPolicy();
        const newIntro = [...current.intro];
        newIntro[index] = value;
        updatePolicy({ intro: newIntro });
    }

    function addPolicyIntro() {
        const current = getPolicy();
        updatePolicy({ intro: [...current.intro, ''] });
    }

    function removePolicyIntro(index: number) {
        const current = getPolicy();
        const newIntro = current.intro.filter((_, i) => i !== index);
        updatePolicy({ intro: newIntro });
    }

    // --- Vision Cards Helpers ---

    function getCards() {
        return (content?.visionCards[selectedLocale] || []) as VisionCard[];
    }

    function updateCards(newCards: VisionCard[]) {
        if (!content) return;
        setContent({
            ...content,
            visionCards: {
                ...content.visionCards,
                [selectedLocale]: newCards
            }
        });
    }

    function updateVisionCard(index: number, field: keyof VisionCard, value: string) {
        const current = getCards();
        const newCards = [...current];
        newCards[index] = { ...newCards[index], [field]: value };
        updateCards(newCards);
    }

    function addVisionCard() {
        const current = getCards();
        const newCard: VisionCard = {
            id: Date.now().toString(),
            icon: '🎯',
            title: '',
            text: ''
        };
        updateCards([...current, newCard]);
    }

    function removeVisionCard(index: number) {
        const current = getCards();
        const newCards = current.filter((_, i) => i !== index);
        updateCards(newCards);
    }

    if (loading || !content) {
        return (
            <div className="admin-layout">
                <div className="container">
                    <p>Hleð gögnum...</p>
                </div>
            </div>
        );
    }

    const currentAbout = getAbout();
    const currentPolicy = getPolicy();
    const currentCards = getCards();

    return (
        <div className="admin-layout">
            <div className="admin-header">
                <div className="container">
                    <h1 className="admin-title">Síðuefni</h1>
                    <nav className="admin-nav">
                        <Link href="/admin">← Til baka</Link>
                        <Link href="/admin/articles">Greinar</Link>
                        <Link href="/admin/news">Fréttir</Link>
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
                    {/* Language Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f0f0f0', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
                        {locales.map(locale => (
                            <button
                                key={locale.code}
                                onClick={() => setSelectedLocale(locale.code)}
                                style={{
                                    padding: '8px 16px',
                                    background: selectedLocale === locale.code ? 'white' : 'transparent',
                                    color: selectedLocale === locale.code ? 'var(--primary)' : '#666',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: selectedLocale === locale.code ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {locale.name}
                            </button>
                        ))}
                    </div>

                    {/* Section Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--light)', paddingBottom: '16px' }}>
                        <button
                            onClick={() => setActiveTab('about')}
                            style={{
                                padding: '10px 20px',
                                background: activeTab === 'about' ? 'var(--primary)' : 'transparent',
                                color: activeTab === 'about' ? 'white' : 'var(--dark)',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Um mig
                        </button>
                        <button
                            onClick={() => setActiveTab('policy')}
                            style={{
                                padding: '10px 20px',
                                background: activeTab === 'policy' ? 'var(--primary)' : 'transparent',
                                color: activeTab === 'policy' ? 'white' : 'var(--dark)',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Stefnuyfirlýsing
                        </button>
                        <button
                            onClick={() => setActiveTab('cards')}
                            style={{
                                padding: '10px 20px',
                                background: activeTab === 'cards' ? 'var(--primary)' : 'transparent',
                                color: activeTab === 'cards' ? 'white' : 'var(--dark)',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Stefnukort
                        </button>
                    </div>

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div>
                            <h2 style={{ marginBottom: '20px' }}>Um mig - Texti ({locales.find(l => l.code === selectedLocale)?.name})</h2>
                            <div className="form-group">
                                <label>Fyrirsögn</label>
                                <input
                                    type="text"
                                    value={currentAbout.title}
                                    onChange={(e) => updateAbout({ title: e.target.value })}
                                />
                            </div>
                            {currentAbout.paragraphs.map((para, index) => (
                                <div key={index} className="form-group" style={{ position: 'relative' }}>
                                    <label>Málsgrein {index + 1}</label>
                                    <textarea
                                        value={para}
                                        onChange={(e) => updateAboutParagraph(index, e.target.value)}
                                        style={{ minHeight: '100px' }}
                                    />
                                    {currentAbout.paragraphs.length > 1 && (
                                        <button
                                            onClick={() => removeAboutParagraph(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '0',
                                                background: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Eyða
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addAboutParagraph}
                                className="btn btn-secondary"
                                style={{ marginTop: '12px' }}
                            >
                                + Bæta við málsgrein
                            </button>
                        </div>
                    )}

                    {/* Policy Tab */}
                    {activeTab === 'policy' && (
                        <div>
                            <h2 style={{ marginBottom: '20px' }}>Stefnuyfirlýsing - Texti ({locales.find(l => l.code === selectedLocale)?.name})</h2>
                            <div className="form-group">
                                <label>Fyrirsögn</label>
                                <input
                                    type="text"
                                    value={currentPolicy.title}
                                    onChange={(e) => updatePolicy({ title: e.target.value })}
                                />
                            </div>
                            {currentPolicy.intro.map((para, index) => (
                                <div key={index} className="form-group" style={{ position: 'relative' }}>
                                    <label>Inngangur {index + 1}</label>
                                    <textarea
                                        value={para}
                                        onChange={(e) => updatePolicyIntro(index, e.target.value)}
                                        style={{ minHeight: '80px' }}
                                    />
                                    {currentPolicy.intro.length > 1 && (
                                        <button
                                            onClick={() => removePolicyIntro(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '0',
                                                background: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Eyða
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addPolicyIntro}
                                className="btn btn-secondary"
                                style={{ marginTop: '12px', marginBottom: '24px' }}
                            >
                                + Bæta við málsgrein
                            </button>
                            <div className="form-group">
                                <label>Áherslusetning (highlight)</label>
                                <textarea
                                    value={currentPolicy.highlight}
                                    onChange={(e) => updatePolicy({ highlight: e.target.value })}
                                    style={{ minHeight: '60px' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Vision Cards Tab */}
                    {activeTab === 'cards' && (
                        <div>
                            <h2 style={{ marginBottom: '20px' }}>Stefnukort ({locales.find(l => l.code === selectedLocale)?.name})</h2>
                            {currentCards.map((card, index) => (
                                <div key={card.id} style={{
                                    background: 'var(--light)',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    marginBottom: '16px',
                                    position: 'relative'
                                }}>
                                    <button
                                        onClick={() => removeVisionCard(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Eyđa korti
                                    </button>
                                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px' }}>
                                        <div className="form-group">
                                            <label>Tákn</label>
                                            <input
                                                type="text"
                                                value={card.icon}
                                                onChange={(e) => updateVisionCard(index, 'icon', e.target.value)}
                                                style={{ fontSize: '24px', textAlign: 'center' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Titill</label>
                                            <input
                                                type="text"
                                                value={card.title}
                                                onChange={(e) => updateVisionCard(index, 'title', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Texti</label>
                                        <textarea
                                            value={card.text}
                                            onChange={(e) => updateVisionCard(index, 'text', e.target.value)}
                                            style={{ minHeight: '60px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addVisionCard}
                                className="btn btn-secondary"
                            >
                                + Bæta við korti
                            </button>
                        </div>
                    )}

                    {/* Save Button */}
                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid var(--light)' }}>
                        <button
                            onClick={handleSave}
                            className="btn btn-primary"
                            disabled={saving}
                            style={{ fontSize: '18px', padding: '16px 40px' }}
                        >
                            {saving ? 'Vista...' : 'Vista breytingar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
