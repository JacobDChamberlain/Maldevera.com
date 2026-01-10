import React, { useState, useMemo } from 'react';
import Show from './Show/Show';
import './Shows.css';

// Flyer imports - Current/Upcoming
import mar27_2025 from './Flyers/march27-2025-3L.png';
import may17_2025 from './Flyers/may17thRGFlyer.jpg';
import may24_2025 from './Flyers/may24-2025-DW.png';
import july23_2025 from './Flyers/july23_2025.jpeg';
import aug8_2025 from './Flyers/aug8thzounds.jpeg';
import aug25_2025 from './Flyers/aug25_txtearoom.jpeg';
import sept4th_2025 from './Flyers/sept4_haltomTheater.jpeg';
import oct11th_2025 from './Flyers/oct_11-DW.jpg';
import nov8th_renos from './Flyers/nov8_renos.jpg';
import nov9th_2025_dustys from './Flyers/nov9th_2025_dustys.png';
import jan31st_2026 from './Flyers/jan31-2026_Sunshine.png';
import april3rd_2026_renos from './Flyers/april3rd_2026_renos.png';

// Flyer imports - Past shows
import may28th from './Flyers/may28thDWshow.jpg';
import may31st from './Flyers/may31RGshow.png';
import june4th from './Flyers/june4thSunshineBar.jpg';
import june22nd from './Flyers/june22ndDWshow.jpg';
import june27th from './Flyers/june27th.PNG';
import june30th from './Flyers/june30thCharliesShow.PNG';
import august16th from './Flyers/august16th.jpg';
import sept14th from './Flyers/growlRecordsShowFlyer.jpeg';
import sept27th from './Flyers/sept-27-flyer.jpeg';
import oct4 from './Flyers/oct4-renos.PNG';
import oct13 from './Flyers/oct13-growl.PNG';
import fm2m from './Flyers/from-man2mist-version2.png';

export default function Shows() {
    const [pastShowsExpanded, setPastShowsExpanded] = useState(false);

    // Helper to parse dates with ordinal suffixes (1st, 2nd, 3rd, 4th, etc.)
    const parseShowDate = (dateStr) => {
        const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
        return new Date(cleaned);
    };

    const shows = [
        // 2024 Shows (Past)
        { flyer: '.' + may28th, alt: 'may_28th_2024_DoubleWide', date: 'May 28th, 2024', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Ascended Dead', 'Cognizant', 'Psychiatric Regurgitation'] },
        { flyer: '.' + may31st, alt: 'may_31st_2024_RubberGloves', date: 'May 31st, 2024', venue: 'Rubber Gloves', address: '411 E Sycamore St, Denton, TX 76205', bands: ['HERAKLEION', 'Morgue Meat', 'Kudu'] },
        { flyer: '.' + june4th, alt: 'june_4th_2024_SunshineBar', date: 'June 4th, 2024', venue: 'Sunshine Bar', address: '902 W Division St, Arlington, TX 76012', bands: ['Viogression', 'Yotuma'] },
        { flyer: '.' + june22nd, alt: 'june_22nd_2024_DoubleWide', date: 'June 22nd, 2024', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Spiter', 'Desolus', 'Nocturnal Wolf', 'Hofaker'] },
        { flyer: '.' + june27th, alt: 'june_27th_2024_HaltomTheater', date: 'June 27th, 2024', venue: 'Haltom Theater', address: '5601 E Belknap St, Haltom City, TX 76117', bands: ['Distain', 'Void', 'Odius', 'Kudu'] },
        { flyer: '.' + june30th, alt: 'june_30th_2024_CharliesStarLounge', date: 'June 30th, 2024', venue: "Charlie's Star Lounge", address: '4319 Main St, Dallas, TX 75226', bands: ['Festival'] },
        { flyer: '.' + august16th, alt: 'august_16th_2024_DoubleWide', date: 'August 16th, 2024', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Oxygen Destroyer', 'Morgue Meat'] },
        { flyer: '.' + sept14th, alt: 'sept_14th_2024_GrowlRecords', date: 'September 14th, 2024', venue: 'Growl Records', address: '09 E Abram St, Arlington, TX 76010', bands: ['Festival'] },
        { flyer: '.' + sept27th, alt: 'sept_27th_2024_ZoundsBSide', date: 'September 27th, 2024', venue: 'Zounds B-Side', address: '10050 Shoreview Rd, Dallas, TX 75238', bands: ['AKA', 'Solly'] },
        { flyer: '.' + oct4, alt: 'october_4th_2024_Renos', date: 'October 4th, 2024', venue: 'Renos', address: '210 N Crowdus St, Dallas, TX 75226', bands: ['In Human Form', 'Mouth of Cronus', 'Norman Invasion'] },
        { flyer: '.' + oct13, alt: 'october_13th_2024_GrowlRecords', date: 'October 13th, 2024', venue: 'Growl Records', address: '09 E Abram St, Arlington, TX 76010', bands: ['Civil Serpents', 'Negative Influence', 'Bliss Fields'] },
        { flyer: '.' + fm2m, alt: 'october_25th_2024_CheapSteaks', date: 'October 25th, 2024', venue: 'Cheap Steaks', address: '2613 Elm St, Dallas, TX 75226', bands: ['Festival'] },
        { flyer: '.' + fm2m, alt: 'december_7th_2024_RenosChopShop', date: 'December 7th, 2024', venue: "Reno's Chop Shop", address: '210 N Crowdus St, Dallas, TX 75226', bands: ['Festival'] },
        // 2025 Shows
        { flyer: '.' + mar27_2025, alt: 'march_27th_2025_ThreeLinks', date: 'March 27th, 2025', venue: 'Three Links', address: '2704 Elm St, Dallas, TX 75226', bands: ['Void', 'Odious', 'Carnist'] },
        { flyer: '.' + may17_2025, alt: 'may_17th_2025_RubberGloves', date: 'May 17th, 2025', venue: 'Rubber Gloves', address: '411 E Sycamore St, Denton, TX 76205', bands: ['Pale Misery', 'Tsuris', 'Nocturnal Spawn'] },
        { flyer: '.' + may24_2025, alt: 'may_24th_2025_DoubleWide', date: 'May 24th, 2025', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Volcandra', 'Saidan', 'Inverted Candles'] },
        { flyer: '.' + july23_2025, alt: 'july_23_2025_RubberGloves', date: 'July 23rd, 2025', venue: 'Rubber Gloves', address: '411 E Sycamore St, Denton, TX 76205', bands: ['Eternal', 'Nocturnal Spawn', 'Repulse'] },
        { flyer: '.' + aug8_2025, alt: 'aug_8th_2025_ZoundsBSide', date: 'August 8th, 2025', venue: 'Zounds B-Side', address: '10050 Shoreview Rd, Dallas, TX 75238', bands: ['Throat Locust', 'Animus', 'No Gimmicks'] },
        { flyer: '.' + aug25_2025, alt: 'aug_25th_TXTeaRoom', date: 'August 25th, 2025', venue: 'TX Tea Room', address: '2815 Main St Suite B, Dallas, TX 75226', bands: ['Panpsychism', 'Psychiatric Regurgitation', 'Cynical'] },
        { flyer: '.' + sept4th_2025, alt: 'sept_4th_HaltomTheater', date: 'September 4th, 2025', venue: 'Haltom Theater', address: '5601 E Belknap St, Haltom City, TX 76117', bands: ['Labyrinth', 'Warhog', 'Skull Archer', 'Odious'] },
        { flyer: '.' + oct11th_2025, alt: 'oct_11th_DoubleWide', date: 'October 11th, 2025', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Tencher', 'Sadistic Force', 'Accuser', 'Narcissist'] },
        { flyer: '.' + nov8th_renos, alt: 'nov_8th_RenosChopShop', date: 'November 8th, 2025', venue: "Reno's Chop Shop", address: '210 N Crowdus St, Dallas, TX 75226', bands: ['Evil Army', 'Silver Tongue Devil', 'Accuser', 'Odious'] },
        { flyer: '.' + nov9th_2025_dustys, alt: 'nov_9th_Dustys', date: 'November 9th, 2025', venue: "Dusty's", address: '2613 Elm St, Dallas, TX 75226', bands: ['Satanik Heavy Drinker', 'Chemical Spell', 'Carnist'] },
        // 2026 Shows
        { flyer: '.' + jan31st_2026, alt: 'jan_31st_2026_SunshineBar', date: 'January 31st, 2026', venue: 'Sunshine Bar', address: '902 W Division St, Arlington, TX 76012', bands: ['Real Life Ugly', 'Bladda', 'S.H.I.V.'] },
        { flyer: '.' + april3rd_2026_renos, alt: 'april_3rd_2026_RenosChopShop', date: 'April 3rd, 2026', venue: "Reno's Chop Shop", address: '210 N Crowdus St, Dallas, TX 75226', bands: ['Void', 'Phantom', 'Accuser'] },
    ];

    // Parse dates and separate upcoming vs past
    const { upcoming, past } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingShows = shows
            .filter(s => parseShowDate(s.date) >= today)
            .sort((a, b) => parseShowDate(a.date) - parseShowDate(b.date));

        const pastShows = shows
            .filter(s => parseShowDate(s.date) < today)
            .sort((a, b) => parseShowDate(b.date) - parseShowDate(a.date)); // Most recent first

        return { upcoming: upcomingShows, past: pastShows };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nextShow = upcoming[0];
    const otherUpcoming = upcoming.slice(1);

    // Generate random rotation for poster wall effect
    const getRandomRotation = (index) => {
        const seed = index * 7919;
        return ((seed % 7) - 3); // Range: -3 to 3 degrees
    };

    // Generate Google Calendar URL
    const generateCalendarUrl = (show) => {
        const date = parseShowDate(show.date);
        date.setHours(20, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 0, 0, 0);

        const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `Maldevera @ ${show.venue}`,
            dates: `${formatDate(date)}/${formatDate(endDate)}`,
            location: show.address,
            details: `Maldevera live at ${show.venue}\n\nWith: ${show.bands.join(', ')}`
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    // Generate Google Maps directions URL
    const generateDirectionsUrl = (address) => {
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    };

    return (
        <div className="shows-wrapper">
            {/* Hero Section - Next Show */}
            {nextShow && (
                <section className="hero-show">
                    <div className="hero-flyer-container">
                        <Show show={nextShow} mode="hero" />
                    </div>
                    <div className="hero-details">
                        <span className="hero-label">Next Show</span>
                        <h2 className="hero-date">{nextShow.date}</h2>
                        <h3 className="hero-venue">
                            @ {nextShow.venue}
                        </h3>
                        <div className="hero-bands">
                            {nextShow.bands.map((band, idx) => (
                                <span key={idx} className="hero-band">
                                    {band.toUpperCase()}
                                </span>
                            ))}
                        </div>
                        <div className="hero-actions">
                            <a
                                href={generateDirectionsUrl(nextShow.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hero-btn hero-btn-directions"
                            >
                                Directions
                            </a>
                            <a
                                href={generateCalendarUrl(nextShow)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hero-btn hero-btn-calendar"
                            >
                                Add to Calendar
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* Upcoming Shows - Poster Wall */}
            {otherUpcoming.length > 0 && (
                <section className="upcoming-section">
                    <h2 className="section-header">Upcoming Shows</h2>
                    <div className="poster-wall">
                        {otherUpcoming.map((show, idx) => (
                            <div
                                key={idx}
                                className="poster-card"
                                style={{ '--rotation': `${getRandomRotation(idx)}deg` }}
                            >
                                <Show
                                    show={show}
                                    mode="poster"
                                    calendarUrl={generateCalendarUrl(show)}
                                    directionsUrl={generateDirectionsUrl(show.address)}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Past Shows - Collapsible */}
            {past.length > 0 && (
                <section className="past-section">
                    <button
                        className={`past-header ${pastShowsExpanded ? 'expanded' : ''}`}
                        onClick={() => setPastShowsExpanded(!pastShowsExpanded)}
                    >
                        <span>Past Shows ({past.length})</span>
                        <span className="past-toggle-arrow">
                            {pastShowsExpanded ? '▲' : '▼'}
                        </span>
                    </button>
                    {pastShowsExpanded && (
                        <div className="poster-wall poster-wall-past">
                            {past.map((show, idx) => (
                                <div
                                    key={idx}
                                    className="poster-card poster-card-past"
                                    style={{ '--rotation': `${getRandomRotation(idx + 100)}deg` }}
                                >
                                    <Show show={show} mode="poster" isPast={true} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Fallback if no shows */}
            {upcoming.length === 0 && (
                <h2 className="no-shows-message">
                    No upcoming shows, check back soon!
                </h2>
            )}
        </div>
    );
}
