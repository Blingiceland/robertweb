'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VisionCard {
    id: string;
    icon: string;
    title: string;
    text: string;
}

interface SiteContent {
    about: {
        title: string;
        paragraphs: string[];
    };
    policy: {
        title: string;
        intro: string[];
        highlight: string;
    };
    visionCards: VisionCard[];
}

export default function AdminSite() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'about' | 'policy' | 'cards'>('about');

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        try {
            // Fetch standard mode (defaults to 'is' or simplified structure)
            const res = await fetch('/api/content?type=site', { cache: 'no-store' });
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
            // Save in standard mode - API will merge this into 'is' locale
            const res = await fetch('/api/content?type=site', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });

            if (res.ok) {
                setSuccessMessage('Vistað!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Save failed:', errorData);
                alert(`Villa við að vista: ${errorData.error || res.statusText}`);
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert(`Villa við að vista: ${String(error)}`);
        } finally {
            setSaving(false);
        }
    }

    function updateAboutParagraph(index: number, value: string) {
        if (!content) return;
        const newParagraphs = [...content.about.paragraphs];
        newParagraphs[index] = value;
        setContent({ ...content, about: { ...content.about, paragraphs: newParagraphs } });
    }

    function addAboutParagraph() {
        if (!content) return;
        setContent({
            ...content,
            about: { ...content.about, paragraphs: [...content.about.paragraphs, ''] }
        });
    }

    function removeAboutParagraph(index: number) {
        if (!content) return;
        const newParagraphs = content.about.paragraphs.filter((_, i) => i !== index);
        setContent({ ...content, about: { ...content.about, paragraphs: newParagraphs } });
    }

    function updatePolicyIntro(index: number, value: string) {
        if (!content) return;
        const newIntro = [...content.policy.intro];
        newIntro[index] = value;
        setContent({ ...content, policy: { ...content.policy, intro: newIntro } });
    }

    function addPolicyIntro() {
        if (!content) return;
        setContent({
            ...content,
            policy: { ...content.policy, intro: [...content.policy.intro, ''] }
        });
    }

    function removePolicyIntro(index: number) {
        if (!content) return;
        const newIntro = content.policy.intro.filter((_, i) => i !== index);
        setContent({ ...content, policy: { ...content.policy, intro: newIntro } });
    }

    function updateVisionCard(index: number, field: keyof VisionCard, value: string) {
        if (!content) return;
        const newCards = [...content.visionCards];
        newCards[index] = { ...newCards[index], [field]: value };
        setContent({ ...content, visionCards: newCards });
    }

    function addVisionCard() {
        if (!content) return;
        const newCard: VisionCard = {
            id: Date.now().toString(),
            icon: '🎯',
            title: '',
            text: ''
        };
        setContent({ ...content, visionCards: [...content.visionCards, newCard] });
    }

    function removeVisionCard(index: number) {
        if (!content) return;
        const newCards = content.visionCards.filter((_, i) => i !== index);
        setContent({ ...content, visionCards: newCards });
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
                    {/* Tabs */}
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
                            <h2 style={{ marginBottom: '20px' }}>Um mig - Texti</h2>
                            <div className="form-group">
                                <label>Fyrirsögn</label>
                                <input
                                    type="text"
                                    value={content.about.title}
                                    onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
                                />
                            </div>
                            {content.about.paragraphs.map((para, index) => (
                                <div key={index} className="form-group" style={{ position: 'relative' }}>
                                    <label>Málsgrein {index + 1}</label>
                                    <textarea
                                        value={para}
                                        onChange={(e) => updateAboutParagraph(index, e.target.value)}
                                        style={{ minHeight: '100px' }}
                                    />
                                    {content.about.paragraphs.length > 1 && (
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
                            <h2 style={{ marginBottom: '20px' }}>Stefnuyfirlýsing - Texti</h2>
                            <div className="form-group">
                                <label>Fyrirsögn</label>
                                <input
                                    type="text"
                                    value={content.policy.title}
                                    onChange={(e) => setContent({ ...content, policy: { ...content.policy, title: e.target.value } })}
                                />
                            </div>
                            {content.policy.intro.map((para, index) => (
                                <div key={index} className="form-group" style={{ position: 'relative' }}>
                                    <label>Inngangur {index + 1}</label>
                                    <textarea
                                        value={para}
                                        onChange={(e) => updatePolicyIntro(index, e.target.value)}
                                        style={{ minHeight: '80px' }}
                                    />
                                    {content.policy.intro.length > 1 && (
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
                                    value={content.policy.highlight}
                                    onChange={(e) => setContent({ ...content, policy: { ...content.policy, highlight: e.target.value } })}
                                    style={{ minHeight: '60px' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Vision Cards Tab */}
                    {activeTab === 'cards' && (
                        <div>
                            <h2 style={{ marginBottom: '20px' }}>Stefnukort</h2>
                            {content.visionCards.map((card, index) => (
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
