import Image from 'next/image';
import { translations } from '@/lib/i18n';

interface Video {
    id: string;
    title: string;
    description: string;
    youtubeUrl: string;
    thumbnail: string;
    showOnHomepage?: boolean;
}

interface VideosProps {
    videos: Video[];
    t: typeof translations['is'];
}

function getYouTubeId(url: string) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
}

export default function Videos({ videos, t }: VideosProps) {
    return (
        <section className="section videos-section" id="myndskeio">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{t.videos.title}</h2>
                </div>
                <div className="videos-grid">
                    {videos.filter(v => v.showOnHomepage !== false).map((video) => {
                        const videoId = getYouTubeId(video.youtubeUrl);
                        const thumbnailUrl = video.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');

                        return (
                            <a
                                href={video.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={video.id}
                                className="video-card"
                            >
                                <div className="video-thumbnail">
                                    {thumbnailUrl && (
                                        <Image
                                            src={thumbnailUrl}
                                            alt={video.title}
                                            width={400}
                                            height={240}
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        />
                                    )}
                                    <div className="play-button">▶</div>
                                </div>
                                <div className="video-info">
                                    <h3 className="video-title">{video.title}</h3>
                                    <p className="video-description">{video.description}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
