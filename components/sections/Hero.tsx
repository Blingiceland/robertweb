import Link from 'next/link';
import Image from 'next/image';
import { Locale, translations } from '@/lib/i18n';

interface HeroProps {
    locale: Locale;
    t: typeof translations['is'];
}

export default function Hero({ locale, t }: HeroProps) {
    return (
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
            <div className="hero-content">
                <div className="hero-text">
                    <span className="hero-name">Róbert Ragnarsson</span>
                    <p className="hero-subtitle">{t.hero.subtitle}</p>
                </div>
            </div>
            <div className="hero-bottom-quote">
                <p>{t.hero.slogan}</p>
            </div>
        </section>
    );
}
