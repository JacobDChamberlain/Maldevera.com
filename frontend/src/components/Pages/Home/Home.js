import React from 'react';
import YouTubeEmbed from '../../YouTubeEmbed/YouTubeEmbed';
import './Home.css';

export default function Home() {

    return (
        <div className="home-wrapper">
            <div className='bandcamp-embed-wrapper'>
                <iframe
                    style={{ border: 0, width: '350px', height: '522px' }}
                    src="https://bandcamp.com/EmbeddedPlayer/album=2627076239/size=large/bgcol=333333/linkcol=9a64ff/transparent=true/"
                    seamless
                    title="Guts / Winter Palace by Maldevera"
                >
                    <a href="https://maldevera.bandcamp.com/album/guts-winter-palace">Guts / Winter Palace by Maldevera</a>
                </iframe>
            </div>
            <div className='yt-embed-wrapper'>
                <YouTubeEmbed className='music-video-youtube-embed' embedId='Lq7NMF8ZXJg?si=EMYYbxr63aFeqDZ6' />
                <YouTubeEmbed className='music-video-youtube-embed' embedId='4ED07rhu3jg?si=Ft4T8YRWoER6YBW8' />
                {/* <YouTubeEmbed className='music-video-youtube-embed' embedId='kkldG6rwKF8?si=lKwV5JJKX3dArdou' /> */}
            </div>
        </div>
    )
}

// embedIds
// Jukai Music Video: Lq7NMF8ZXJg?si=EMYYbxr63aFeqDZ6
// Icon Music Video: 4ED07rhu3jg?si=Ft4T8YRWoER6YBW8
// From Man To Mist: kkldG6rwKF8?si=lKwV5JJKX3dArdou