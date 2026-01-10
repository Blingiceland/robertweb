'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Locale, locales, localeFlags, translations } from '@/lib/i18n';

interface HeaderProps {
    locale: Locale;
    t: typeof translations['is'];
}

export default function Header({ locale, t }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <Link href={`/${locale}`} className="logo" style={{ gap: '12px' }}>
                        <Image
                            src="/images/Vidreisn-logo_regular_rgb-1024x765.png"
                            alt="Viðreisn"
                            width={180}
                            height={135}
                            className="logo-image"
                        />
                        <div className="logo-text">
                            <span className="logo-name">Róbert Ragnarsson</span>
                        </div>
                    </Link>
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li><Link href={`/${locale}#um-mig`} className="nav-link">{t.nav.about}</Link></li>
                        <li><Link href={`/${locale}#stefna`} className="nav-link">{t.nav.policy}</Link></li>
                        <li><Link href={`/${locale}#frettir`} className="nav-link">{t.nav.news}</Link></li>
                        <li><Link href={`/${locale}#myndskeio`} className="nav-link">{t.nav.videos}</Link></li>
                        <li><a href="mailto:robbiragnars@gmail.com" className="nav-link cta-link">{t.nav.contact}</a></li>
                        <li className="lang-switcher">
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {locales.map((l) => (
                                    <Link
                                        key={l}
                                        href={`/${l}`}
                                        title={l === 'is' ? 'Íslenska' : l === 'en' ? 'English' : 'Polski'}
                                        style={{
                                            fontSize: '24px',
                                            textDecoration: 'none',
                                            opacity: l === locale ? 1 : 0.5,
                                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                                            display: 'inline-block'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = l === locale ? '1' : '0.5'}
                                    >
                                        {localeFlags[l]}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    </ul>
                    <button
                        className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </div>
        </header>
    );
}
