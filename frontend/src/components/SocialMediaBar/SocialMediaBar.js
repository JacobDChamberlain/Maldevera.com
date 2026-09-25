import React from 'react';
import './SocialMediaBar.css';

import instagramLogo from '../../images/social_media-icons/icons8-instagram.svg';
import facebookLogo from '../../images/social_media-icons/icons8-facebook.svg';
import xLogo from '../../images/social_media-icons/icons8-x.svg';
import spotifyLogo from '../../images/social_media-icons/icons8-spotify.svg';
import youtubeLogo from '../../images/social_media-icons/icons8-youtube.svg';
import appleLogo from '../../images/social_media-icons/icons8-music.svg';
import bandcampLogo from '../../images/social_media-icons/icons8-bandcamp.svg';


// Bandcamp leads: it's where the records and the money actually are.
// Every link opens in a new tab so the site isn't abandoned on the way out.
const socialMediaLinks = [
    {
        name: 'bandcamp',
        label: 'Maldevera on Bandcamp',
        url: 'https://maldevera.bandcamp.com/',
        imagePath: bandcampLogo
    },
    {
        name: 'spotify',
        label: 'Maldevera on Spotify',
        url: 'https://open.spotify.com/artist/0CP5nqR6lT3g3StExsINGG',
        imagePath: spotifyLogo
    },
    {
        name: 'appleMusic',
        label: 'Maldevera on Apple Music',
        url: 'https://music.apple.com/us/artist/maldevera/546342013',
        imagePath: appleLogo
    },
    {
        name: 'youtube',
        label: 'Maldevera on YouTube',
        url: 'https://www.youtube.com/@MALDEVERA',
        imagePath: youtubeLogo
    },
    {
        name: 'instagram',
        label: 'Maldevera on Instagram',
        url: 'https://www.instagram.com/maldevera',
        imagePath: instagramLogo
    },
    {
        name: 'facebook',
        label: 'Maldevera on Facebook',
        url: 'https://www.facebook.com/Maldevera',
        imagePath: facebookLogo
    },
    {
        name: 'twitter',
        label: 'Maldevera on X',
        url: 'https://twitter.com/maldevera',
        imagePath: xLogo
    }
];


export default function SocialMediaBar() {
    return (
        <ul className='social-media-lonks-ul'>
            { socialMediaLinks.map( link => (
                <li className='social-media-lonks-li' key={ link.name }>
                    <a
                        href={ link.url }
                        target='_blank'
                        rel='noopener noreferrer me'
                        aria-label={ link.label }
                        title={ link.label }
                    >
                        <img
                            className='social-media-icoon'
                            src={ link.imagePath }
                            alt={ link.label }
                        />
                    </a>
                </li>
            ) ) }
        </ul>
    )
}
