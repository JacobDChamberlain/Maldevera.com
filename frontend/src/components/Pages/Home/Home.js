import React from 'react';
import YouTubeEmbed from '../../YouTubeEmbed/YouTubeEmbed';
import './Home.css';

import getStripe from '../../../lib/getStripe';

export default function Home() {

    async function handleCheckout() {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    price: process.env.REACT_APP_NEXT_PUBLIC_STRIPE_PRICE_ID,
                    quantity: 1
                }
            ],
            mode: 'payment',
            successUrl: `http://localhost:3000/successful-purchase`,
            cancelUrl: `http://localhost:3000/sad-yeet`,
            customerEmail: 'customer@email.com'
        });
        console.warn(error.message);
        console.log("price id: " + process.env.REACT_APP_NEXT_PUBLIC_STRIPE_PRICE_ID)
        console.log("publishable key: " + process.env.REACT_APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    }

    return (
        <div className="home-wrapper">
            <button onClick={handleCheckout}>Test Checkout</button>

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