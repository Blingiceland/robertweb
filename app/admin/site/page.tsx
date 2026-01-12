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

type Locale = 'is' | 'en' | 'pl';

export default function AdminSite() {
    const [content, setContent] = useState<SiteContentRaw | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'about' | 'policy' | 'cards'>('about');
    const [selectedLocale, setSelectedLocale] = useState<Locale>('is');

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
            // Save in raw mode to preserve all languages
            const res = await fetch('/api/content?type=site&mode=raw', {
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
        const newContent = { ...content };
        if (!newContent.about[selectedLocale]) {
            newContent.about[selectedLocale] = { title: '', paragraphs: [] };
        }
        const newParagraphs = [...(newContent.about[selectedLocale]?.paragraphs || [])];
        newParagraphs[index] = value;
        newContent.about[selectedLocale] = { ...newContent.about[selectedLocale], paragraphs: newParagraphs };
        setContent(newContent);
    }

    function addAboutParagraph() {
        if (!content) return;
        const newContent = { ...content };
        if (!newContent.about[selectedLocale]) {
            newContent.about[selectedLocale] = { title: '', paragraphs: [] };
        }
        newContent.about[selectedLocale] = {
            ...newContent.about[selectedLocale],
            paragraphs: [...(newContent.about[selectedLocale]?.paragraphs || []), '']
        };
        setContent(newContent);
    }

    function removeAboutParagraph(index: number) {
        if (!content) return;
        const newContent = { ...content };
        const newParagraphs = (newContent.about[selectedLocale]?.paragraphs || []).filter((_, i) => i !== index);
        newContent.about[selectedLocale] = { ...newContent.about[selectedLocale], paragraphs: newParagraphs };
        setContent(newContent);
    }

    function updatePolicyIntro(index: number, value: string) {
        if (!content) return;
        const newContent = { ...content };
        if (!newContent.policy[selectedLocale]) {
            newContent.policy[selectedLocale] = { title: '', intro: [], highlight: '' };
        }
        const newIntro = [...(newContent.policy[selectedLocale]?.intro || [])];
        newIntro[index] = value;
        newContent.policy[selectedLocale] = { ...newContent.policy[selectedLocale], intro: newIntro };
        setContent(newContent);
    }

    function addPolicyIntro() {
        if (!content) return;
        const newContent = { ...content };
        if (!newContent.policy[selectedLocale]) {
            newContent.policy[selectedLocale] = { title: '', intro: [], highlight: '' };
        }
        newContent.policy[selectedLocale] = {
            ...newContent.policy[selectedLocale],
            intro: [...(newContent.policy[selectedLocale]?.intro || []), '']
        };
        setContent(newContent);
    }

    function removePolicyIntro(index: number) {
        if (!content) return;
        const newContent = { ...content };
        const newIntro = (newContent.policy[selectedLocale]?.intro || []).filter((_, i) => i !== index);
        newContent.policy[selectedLocale] = { ...newContent.policy[selectedLocale], intro: newIntro };
        setContent(newContent);
    }

    function updateVisionCard(index: number, field: keyof VisionCard, value: string) {
        if (!content) return;
        const newContent = { ...content };
        if (!newContent.visionCards[selectedLocale]) {
            newContent.visionCards[selectedLocale] = [];
        }
        const newCards = [...(newContent.visionCards[selectedLocale] || [])];
        newCards[index] = { ...newCards[index], [field]: value };
        newContent.visionCards[selectedLocale] = newCards;
        setContent(newContent);
    }

    function addVisionCard() {
        if (!content) return;
        const newContent = { ...content };
        if (!newContent.visionCards[selectedLocale]) {
            newContent.visionCards[selectedLocale] = [];
        }
        const newCard: VisionCard = {
            id: Date.now().toString(),
            icon: '🎯',
            title: '',
            text: ''
        };
        newContent.visionCards[selectedLocale] = [...(newContent.visionCards[selectedLocale] || []), newCard];
        setContent(newContent);
    }

    function removeVisionCard(index: number) {
        if (!content) return;
        const newContent = { ...content };
        const newCards = (newContent.visionCards[selectedLocale] || []).filter((_, i) => i !== index);
        newContent.visionCards[selectedLocale] = newCards;
        setContent(newContent);
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

    const currentAbout = content.about[selectedLocale] || { title: '', paragraphs: [] };
    const currentPolicy = content.policy[selectedLocale] || { title: '', intro: [], highlight: '' };
    const currentVisionCards = content.visionCards[selectedLocale] || [];

    return (
        <div className="admin-layout">
            <div className="admin-header">
                <div className="container">
                    <h1 className="admin-title">Síðuefni</h1>
                    <nav className="admin-nav">
                        <Link href="/admin">← Til baka</Link>
                        <Link href="/admin/articles">Greinar</Link>
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
                    {/* Language Selector */}
                    <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--light)' }}>
                        <h3 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--dark-600)' }}>Tungumál / Language</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setSelectedLocale('is')}
                                style={{
                                    padding: '10px 20px',
                                    background: selectedLocale === 'is' ? 'var(--primary)' : 'transparent',
                                    color: selectedLocale === 'is' ? 'white' : 'var(--dark)',
                                    border: selectedLocale === 'is' ? 'none' : '1px solid var(--light)',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                🇮🇸 Íslenska
                            </button>
                            <button
                                onClick={() => setSelectedLocale('en')}
                                style={{
                                    padding: '10px 20px',
                                    background: selectedLocale === 'en' ? 'var(--primary)' : 'transparent',
                                    color: selectedLocale === 'en' ? 'white' : 'var(--dark)',
                                    border: selectedLocale === 'en' ? 'none' : '1px solid var(--light)',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                🇬🇧 English
                            </button>
                            <button
                                onClick={() => setSelectedLocale('pl')}
                                style={{
                                    padding: '10px 20px',
                                    background: selectedLocale === 'pl' ? 'var(--primary)' : 'transparent',
                                    color: selectedLocale === 'pl' ? 'white' : 'var(--dark)',
                                    border: selectedLocale === 'pl' ? 'none' : '1px solid var(--light)',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                🇵🇱 Polski
                            </button>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--light)' }}>
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
                                    value={currentAbout.title}
                                    onChange={(e) => {
                                        const newContent = { ...content };
                                        newContent.about[selectedLocale] = { ...currentAbout, title: e.target.value };
                                        setContent(newContent);
                                    }}
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
                            <h2 style={{ marginBottom: '20px' }}>Stefnuyfirlýsing - Texti</h2>
                            <div className="form-group">
                                <label>Fyrirsögn</label>
                                <input
                                    type="text"
                                    value={currentPolicy.title}
                                    onChange={(e) => {
                                        const newContent = { ...content };
                                        newContent.policy[selectedLocale] = { ...currentPolicy, title: e.target.value };
                                        setContent(newContent);
                                    }}
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
                                    onChange={(e) => {
                                        const newContent = { ...content };
                                        newContent.policy[selectedLocale] = { ...currentPolicy, highlight: e.target.value };
                                        setContent(newContent);
                                    }}
                                    style={{ minHeight: '60px' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Vision Cards Tab */}
                    {activeTab === 'cards' && (
                        <div>
                            <h2 style={{ marginBottom: '20px' }}>Stefnukort</h2>
                            {currentVisionCards.map((card, index) => (
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
