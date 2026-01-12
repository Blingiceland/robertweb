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
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">

                        <span className="hero-name">Róbert Ragnarsson</span>
                        <p className="hero-subtitle">{t.hero.subtitle}</p>
                        <p className="hero-slogan">
                            &ldquo;{t.hero.slogan}&rdquo;
                        </p>
                        <div className="hero-cta">
                            <Link href={`/${locale}#stefna`} className="btn btn-primary">
                                {t.hero.cta1}
                            </Link>
                            <a href="mailto:robbiragnars@gmail.com" className="btn btn-secondary">
                                {t.hero.cta2}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
