import Image from 'next/image';

interface AboutProps {
    content: {
        title: string;
        paragraphs: string[];
    };
}

export default function About({ content }: AboutProps) {
    return (
        <section className="section about-section" id="um-mig">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{content.title}</h2>
                </div>
                <div className="about-content">
                    <div className="about-text-column">
                        {content.paragraphs.map((paragraph, index) => (
                            <p key={index} className="about-text">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className="about-image">
                        <Image
                            src="/images/robert3.jpg"
                            alt="Róbert Ragnarsson"
                            width={400}
                            height={533}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
