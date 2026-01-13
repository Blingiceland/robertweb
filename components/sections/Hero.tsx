import Link from 'next/link';
import Image from 'next/image';
import { Locale, translations } from '@/lib/i18n';

interface HeroProps {
    locale: Locale;
    t: typeof translations['is'];
}

export default function Hero({ locale, t }: HeroProps) {
    return (
        <>
            <section className="hero">
                <div className="hero-background">
                    <Image
                        src="/images/Frame 14690.png"
                        alt="Róbert Ragnarsson"
                        fill
                        style={{ objectFit: 'contain', objectPosition: 'center' }}
                        priority
                    />
                </div>
                <div className="hero-overlay"></div>
            </section>
            <section className="quote-section">
                <div className="container">
                    <h1 className="hero-intro-text">{t.hero.subtitle}</h1>
                    <p className="quote-text">{t.hero.slogan}</p>
                </div>
            </section>
        </>
    );
}
