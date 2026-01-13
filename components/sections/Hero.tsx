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
            <section className="hero-banner">
                <Image
                    src="/images/Frame 14690.png"
                    alt="Róbert Ragnarsson"
                    width={1920}
                    height={600}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    priority
                />
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
