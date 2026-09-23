import React from 'react';
import './Press.css';

// The page you send when someone asks for a press kit: a promoter booking the
// room, a band offering a tour swap, a zine writing a blurb, a curator deciding
// whether to bother. Everything they need, in one link, nothing to dig for.

const SHORT_BIO = `Maldevera is a four-piece death-thrash band out of Dallas–Fort Worth and New Orleans, playing since 2011. Groove, blunt force, and titles like "Mouthful of Concrete" that tell you most of what you need to know.`;

const LONG_BIO = `Maldevera has been playing death-thrash in Dallas–Fort Worth since 2011. The songs run on groove and blunt force — riffs that move, tempos that refuse to sit still, and a sense of humor buried somewhere under the weight of it.

The current record is Guts / Winter Palace, with music videos for "Jukai," "Icon of Sin," and "From Man to Mist." Since 2024 the band has played more than forty shows across Texas and the South, sharing bills with Terminal Nation, Evil Army, Ascended Dead, Oxygen Destroyer, Volcandra and Sadistic Force, and ran the East Coast in June 2026 through Houston, Birmingham, Atlanta, Richmond, Baltimore and New York.

Taste the corners of your mind.`;

const MEMBERS = ['Parker Turney', 'Jacob Chamberlain', 'Shannon Paine-Jesam', 'Keith Brown'];

const FACTS = [
    ['Formed', '2011'],
    ['Based', 'Dallas–Fort Worth, TX / New Orleans, LA'],
    ['Genre', 'Death metal / thrash / groove'],
    ['Latest release', 'Guts / Winter Palace'],
    ['For fans of', 'Terminal Nation, Evil Army, Oxygen Destroyer'],
    ['Booking', 'MaldeveraTX@gmail.com']
];

const LISTEN = [
    ['Bandcamp', 'https://maldevera.bandcamp.com/'],
    ['Spotify', 'https://open.spotify.com/artist/0CP5nqR6lT3g3StExsINGG'],
    ['Apple Music', 'https://music.apple.com/us/artist/maldevera/546342013'],
    ['YouTube', 'https://www.youtube.com/@MALDEVERA'],
    ['Instagram', 'https://www.instagram.com/maldevera'],
    ['Facebook', 'https://www.facebook.com/Maldevera']
];

// Named because promoters and other bands read these as credentials.
const SHARED_BILLS = [
    'Terminal Nation', 'Evil Army', 'Ascended Dead', 'Oxygen Destroyer',
    'Volcandra', 'Sadistic Force', 'Saidan', 'In Human Form', 'Tencher',
    'Satanik Heavy Drinker', 'Viogression', 'Accuser'
];

export default function Press() {
    return (
        <div className="press-wrapper">
            <h1 className="press-title">Press Kit</h1>
            <p className="press-subtitle">
                Everything a promoter, zine or booking agent needs. Copy anything here freely.
            </p>

            <section className="press-section">
                <h2 className="press-heading">The short version</h2>
                <blockquote className="press-bio">{ SHORT_BIO }</blockquote>
            </section>

            <section className="press-section">
                <h2 className="press-heading">The long version</h2>
                { LONG_BIO.split('\n\n').map((para, i) => (
                    <blockquote className="press-bio" key={ i }>{ para }</blockquote>
                )) }
            </section>

            <section className="press-section">
                <h2 className="press-heading">Facts</h2>
                <dl className="press-facts">
                    { FACTS.map(([label, value]) => (
                        <div className="press-fact-row" key={ label }>
                            <dt>{ label }</dt>
                            <dd>
                                { label === 'Booking'
                                    ? <a className="press-link" href={ `mailto:${value}` }>{ value }</a>
                                    : value }
                            </dd>
                        </div>
                    )) }
                </dl>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Members</h2>
                <p className="press-members">{ MEMBERS.join(' · ') }</p>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Shared stages with</h2>
                <p className="press-members">{ SHARED_BILLS.join(' · ') }</p>
                <p className="press-note">
                    Full show history, back to 2024, on the <a className="press-link" href="/shows">shows page</a>.
                </p>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Listen</h2>
                <ul className="press-links-ul">
                    { LISTEN.map(([name, url]) => (
                        <li key={ name }>
                            <a className="press-link" href={ url } target="_blank" rel="noopener noreferrer">
                                { name }
                            </a>
                        </li>
                    )) }
                </ul>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Photos &amp; logo</h2>
                <p className="press-note">Right-click to save, or open and download. Free to use in listings and articles.</p>
                <ul className="press-links-ul">
                    <li>
                        <a className="press-link" href="/press-assets/maldevera-band-photo.jpg" target="_blank" rel="noopener noreferrer">
                            Band photo — 3130 × 2075 JPG
                        </a>
                    </li>
                    <li>
                        <a className="press-link" href="/press-assets/maldevera-logo.png" target="_blank" rel="noopener noreferrer">
                            Logo — 2400 × 1055 PNG
                        </a>
                    </li>
                </ul>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Booking</h2>
                <a className="press-email" href="mailto:MaldeveraTX@gmail.com">MaldeveraTX@gmail.com</a>
            </section>
        </div>
    );
}
