import React from 'react';
import './Press.css';

// The web version of the band's actual EPK (design-assets/maldeveraEPK.pdf).
// Same content, laid out to read on a phone and to be copied from - a promoter
// or zine shouldn't have to open a 65 MB PDF to get a paragraph and a photo.
// Text here is transcribed from that EPK; if the PDF changes, change this too.
// Three deliberate divergences from the PDF. It says "Forged in 2010",
// corrected to 2011 per Jacob; it lists no members at all, so the lineup below
// is added here rather than transcribed; and it calls the band Dallas and New
// Orleans, which stopped being true when the drummer who lived there left. The
// PDF still says 2010, names nobody and claims both cities - fix it at source.

const BIO = `Maldevera is a blistering death thrash metal band based out of Dallas, Texas. Forged in 2011, the band established itself early on as a force to be reckoned with by combining elements of thrash and groove metal. After several EPs and demos, more mature avenues were explored within the technical arenas of the genre. Old school death metal, grindcore and progressive metal found their way into Maldevera's arsenal of inspirations.

Their music formula became recognizable upon the release of the band's full length debut album "From Man to Mist" in April of 2023. It was finally time for Maldevera to grow its audience outside of the local Dallas scene. In October of 2023 the band embarked on their first multi state tour, playing to several responsive crowds in eight different states. This grass roots approach solidified Maldevera's status as a band willing to take things to the next level.`;

const REVIEW = `I will not play the suspense any longer, MALDEVERA put a big skullcap on me, and made me travel inside for thirty minutes. A journey to a not so lost youth, spent scouring magazines to find bands of the caliber of CORONER, ATHEIST, NOCTURNUS, MORBID ANGEL, WATCHTOWER and other SADUS.`;

const MEMBERS = [
    ['Parker Turney', 'Guitars / Vocals'],
    ['Jacob Chamberlain', 'Guitars / Vocals'],
    ['Keith Brown', 'Bass'],
    ['Stephan Cohen', 'Drums']
];

// A credit, not a farewell: dates and the recordings, stated the way a liner
// note would. Long enough to be accurate about eleven years, short enough that
// the lineup above stays the thing a promoter reads.
const DRUM_CREDIT = 'Shannon Paine-Jesam played drums from 2014 to 2025 and appears on every Maldevera recording to date.';

const SHARED_BILLS = [
    'Vektor', 'Spineshank (Grammy nominated)', 'Hellwitch', 'PLF',
    'Steel Bearing Hand', 'Tolar', 'Weaponizer', 'Putridity', 'Desolus',
    'Spiter', 'Oxygen Destroyer', 'Nuclear Remains', 'Evil Army', 'Void',
    'Katagory V', 'Black Horse of Famine', 'Ascended Dead', 'Kontusion',
    'Nuclear Tomb'
];

const LIVE_SHOTS = [
    ['/press-assets/epk-live-1.jpg', 'Maldevera live - guitarist mid-riff'],
    ['/press-assets/epk-live-2.jpg', 'Maldevera live - vocalist and guitarist onstage'],
    ['/press-assets/epk-live-3.jpg', 'Maldevera live - bassist onstage'],
    ['/press-assets/epk-live-4.jpg', 'Maldevera live - drummer behind the kit']
];

const VIDEOS = [
    ['Icon of Sin', 'https://www.youtube.com/watch?v=4ED07rhu3jg'],
    ['Jukai', 'https://www.youtube.com/watch?v=Lq7NMF8ZXJg']
];

const LINKS = [
    ['Bandcamp', 'https://maldevera.bandcamp.com/'],
    ['YouTube', 'https://www.youtube.com/@MALDEVERA'],
    ['Instagram', 'https://www.instagram.com/maldevera'],
    ['Facebook', 'https://www.facebook.com/Maldevera'],
    ['Spotify', 'https://open.spotify.com/artist/0CP5nqR6lT3g3StExsINGG'],
    ['Apple Music', 'https://music.apple.com/us/artist/maldevera/546342013']
];

const DOWNLOADS = [
    ['/press-assets/maldevera-epk.pdf', 'Full EPK', 'PDF'],
    ['/press-assets/maldevera-band-photo.jpg', 'Band photo', '3130 × 2075 JPG'],
    ['/press-assets/maldevera-logo.png', 'Logo', '2400 × 1055 PNG'],
    ['/press-assets/epk-spread.jpg', 'EPK spread', 'JPG']
];

export default function Press() {
    return (
        <div className="press-wrapper">
            <h1 className="press-title">Press Kit</h1>
            <p className="press-subtitle">
                Death thrash metal &middot; Dallas, TX. Copy anything here freely.
            </p>

            <ul className="press-shots">
                { LIVE_SHOTS.map(([src, alt]) => (
                    <li key={ src }>
                        <img className="press-shot" src={ src } alt={ alt } loading="lazy" />
                    </li>
                )) }
            </ul>

            <section className="press-section">
                <h2 className="press-heading">Biography</h2>
                { BIO.split('\n\n').map((para, i) => (
                    <blockquote className="press-bio" key={ i }>{ para }</blockquote>
                )) }
            </section>

            <section className="press-section">
                <h2 className="press-heading">Lineup</h2>
                <ul className="press-lineup">
                    { MEMBERS.map(([name, role]) => (
                        <li key={ name }>
                            { name }<span className="press-meta"> — { role }</span>
                        </li>
                    )) }
                </ul>
                <p className="press-note">{ DRUM_CREDIT }</p>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Album review</h2>
                <div className="press-review">
                    <img
                        className="press-cover"
                        src="/press-assets/epk-album-cover.jpg"
                        alt="From Man to Mist album cover"
                        loading="lazy"
                    />
                    <div className="press-review-text">
                        <blockquote className="press-quote">&ldquo;{ REVIEW }&rdquo;</blockquote>
                        <p className="press-note">
                            &mdash; Metal News (translated from French), on <em>From Man to Mist</em>
                        </p>
                    </div>
                </div>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Shared stages with</h2>
                <p className="press-members">{ SHARED_BILLS.join(' · ') }</p>
                <p className="press-note">
                    Full show history on the <a className="press-link" href="/shows">shows page</a>.
                </p>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Music videos</h2>
                <ul className="press-links-ul">
                    { VIDEOS.map(([name, url]) => (
                        <li key={ name }>
                            <a className="press-link" href={ url } target="_blank" rel="noopener noreferrer">
                                { name }
                            </a>
                        </li>
                    )) }
                </ul>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Listen &amp; follow</h2>
                <ul className="press-links-ul">
                    { LINKS.map(([name, url]) => (
                        <li key={ name }>
                            <a className="press-link" href={ url } target="_blank" rel="noopener noreferrer">
                                { name }
                            </a>
                        </li>
                    )) }
                </ul>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Downloads</h2>
                <p className="press-note">Free to use in listings and articles.</p>
                <ul className="press-downloads">
                    { DOWNLOADS.map(([href, label, meta]) => (
                        <li key={ href }>
                            <a className="press-link" href={ href } target="_blank" rel="noopener noreferrer">
                                { label }
                            </a>
                            <span className="press-meta"> — { meta }</span>
                        </li>
                    )) }
                </ul>
            </section>

            <section className="press-section">
                <h2 className="press-heading">Booking</h2>
                <a className="press-email" href="mailto:maldeveratx@gmail.com">maldeveratx@gmail.com</a>
                <p className="press-note">
                    or call <a className="press-link" href="tel:+14694066340">(469) 406-6340</a>
                </p>
            </section>
        </div>
    );
}
