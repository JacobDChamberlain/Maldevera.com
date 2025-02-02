import React from 'react';
import { Link } from 'react-router-dom';
import './SocialMediaBar.css';

import instagramLogo from '../../images/social_media-icons/icons8-instagram.svg';
import facebookLogo from '../../images/social_media-icons/icons8-facebook.svg';
import xLogo from '../../images/social_media-icons/icons8-x.svg';
import spotifyLogo from '../../images/social_media-icons/icons8-spotify.svg';
import youtubeLogo from '../../images/social_media-icons/icons8-youtube.svg';
import appleLogo from '../../images/social_media-icons/icons8-music.svg';


const socialMediaLinks = [
    {
        name: 'instagram',
        url: 'https://www.instagram.com/maldevera',
        imagePath: instagramLogo
    },
    {
        name: 'facebook',
        url: 'https://www.facebook.com/Maldevera',
        imagePath: facebookLogo
    },
    {
        name: 'twitter',
        url: 'https://twitter.com/maldevera',
        imagePath: xLogo
    },
    {
        name: 'spotify',
        url: 'https://open.spotify.com/artist/0CP5nqR6lT3g3StExsINGG',
        imagePath: spotifyLogo
    },
    {
        name: 'youtube',
        url: 'https://www.youtube.com/watch?v=kkldG6rwKF8&t=21s',
        imagePath: youtubeLogo
    },
    {
        name: 'appleMusic',
        url: 'https://music.apple.com/us/artist/maldevera/546342013',
        imagePath: appleLogo
    }
];


export default function SocialMediaBar() {
    return (
        <ul className='social-media-lonks-ul'>
            { socialMediaLinks.map( link => (
                <Link to={ link.url } key={ link.name }>
                    <img
                        className='social-media-icoon'
                        src={ link.imagePath }
                        alt='social media icon'
                        data-url={ link.url }
                    />
                </Link>
            ) ) }
        </ul>
    )
}