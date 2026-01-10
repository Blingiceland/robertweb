interface VisionCard {
    id: string;
    icon: string;
    title: string;
    text: string;
}

interface PolicyProps {
    content: {
        title: string;
        intro: string[];
        highlight: string;
    };
    visionCards: VisionCard[];
}

export default function Policy({ content, visionCards }: PolicyProps) {
    return (
        <section className="section policy-section" id="stefna">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{content.title}</h2>
                </div>
                <div className="policy-content">
                    <div className="policy-intro">
                        {content.intro.map((paragraph, index) => (
                            <p key={index} className="policy-text">
                                {paragraph}
                            </p>
                        ))}
                        <p className="policy-text highlight">
                            {content.highlight}
                        </p>
                    </div>

                    <div className="vision-grid">
                        {visionCards.map((card) => (
                            <div key={card.id} className="vision-card">
                                <div className="vision-icon">{card.icon}</div>
                                <h3 className="vision-title">{card.title}</h3>
                                <p className="vision-text">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
