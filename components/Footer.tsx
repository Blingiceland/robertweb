import { Locale, translations } from '@/lib/i18n';

interface FooterProps {
    locale: Locale;
    t: typeof translations['is'];
}

export default function Footer({ locale, t }: FooterProps) {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span style={{ fontSize: '24px', fontWeight: '700' }}>Róbert Ragnarsson</span>
                    </div>
                    <p>© 2026 Róbert Ragnarsson. {t.footer.copyright}.</p>
                </div>
            </div>
        </footer>
    );
}
