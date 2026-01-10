import { translations } from '@/lib/i18n';

interface ContactProps {
    t: typeof translations['is'];
}

export default function Contact({ t }: ContactProps) {
    return (
        <section className="section contact-section" id="hafa-samband">
            <div className="container">
                <div className="contact-content">
                    <h2 className="section-title">{t.contact.title}</h2>
                    <p className="contact-text">{t.contact.text}</p>
                    <div className="contact-methods">
                        <a href="mailto:robbiragnars@gmail.com" className="contact-btn">
                            <span className="contact-icon">✉</span>
                            <span>{t.contact.button}</span>
                        </a>
                        <div className="social-links">
                            {/* Social media links will be added */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
