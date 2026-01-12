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
                    </Link>
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li><Link href={`/${locale}#um-mig`} className="nav-link">{t.nav.about}</Link></li>
                        <li><Link href={`/${locale}#stefna`} className="nav-link">{t.nav.policy}</Link></li>
                        <li><Link href={`/${locale}#frettir`} className="nav-link">{t.nav.news}</Link></li>
                        <li>
                            <a
                                href="https://vidreisn.is/malefni/vertu-med-i-vidreisn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-link"
                                style={{ fontWeight: '600', color: 'var(--primary)' }}
                            >
                                Skráðu þig í Viðreisn
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__QeyBslUNUtNRDVZVUNERUJNR0JRMUEyR09LVUpRTy4u"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-link"
                                style={{ fontWeight: '600' }}
                            >
                                Viltu styðja?
                            </a>
                        </li>
                        <li className="social-icons" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '8px' }}>
                            <a href="https://www.facebook.com/robert.ragnarsson.5" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'color 0.2s' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="https://www.instagram.com/robbi.ragnars/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'color 0.2s' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                            </a>
                            <a href="mailto:robbiragnars@gmail.com" aria-label="Email">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'color 0.2s' }}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                            </a>
                        </li>
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
