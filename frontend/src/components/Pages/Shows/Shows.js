import React from 'react';
import Show from './Show/Show';
import './Shows.css';

import fm2m from './Flyers/from-man2mist-version2.png';
// import may28th from './Flyers/may28thDWshow.jpg';
// import may31st from './Flyers/may31RGshow.png';
// import june4th from './Flyers/june4thSunshineBar.jpg'
// import june22nd from './Flyers/june22ndDWshow.jpg'
// import june27th from './Flyers/june27th.PNG';
// import june30th from './Flyers/june30thCharliesShow.PNG';
// import august16h from './Flyers/august16th.jpg';
// import sept14th from './Flyers/growlRecordsShowFlyer.jpeg'
// import sept27th from './Flyers/sept-27-flyer.jpeg';
// import oct4 from './Flyers/oct4-renos.PNG';
// import oct13 from './Flyers/oct13-growl.PNG'
import mar27_2025 from './Flyers/march27-2025-3L.png';
import may17_2025 from './Flyers/may17thRGFlyer.jpg'
import may24_2025 from './Flyers/may24-2025-DW.png';
import july23_2025 from './Flyers/july23_2025.jpeg';
import aug8_2025 from './Flyers/aug8thzounds.jpeg';
import aug25_2025 from './Flyers/aug25_txtearoom.jpeg';
import sept4th_2025 from './Flyers/sept4_haltomTheater.jpeg';
import oct11th_2025 from './Flyers/oct_11-DW.jpg';
import nov8th_renos from './Flyers/nov8_renos.jpg';
import nov9th_2025_dustys from './Flyers/nov9th_2025_dustys.png';
import april3rd_2026_renos from './Flyers/april3rd_2026_renos.png';

export default function Shows() {

    const shows = [
        // { flyer: '.'+may28th, alt: 'may_28th_2024_DoubleWide', date: 'May 28th, 2024', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Ascended Dead', 'Cognizant', 'Psychiatric Regurgitation'] },
        // { flyer: '.'+may31st, alt: 'may_31st_2024_RubberGloves', date: 'May 31st, 2024', venue: 'Rubber Gloves', address: '411 E Sycamore St, Denton, TX 76205', bands: ['HERAKLEION', 'Morgue Meat', 'Kudu'] },
        // { flyer: '.'+june4th, alt: 'june_4th_2024_SunshineBar', date: 'June 4th, 2024', venue: 'Sunshine Bar', address: '902 W Division St, Arlington, TX 76012', bands: ['Viogression', 'Yotuma'] },
        // { flyer: '.'+june22nd, alt: 'june_22nd_2024_DoubleWide', date: 'June 22nd, 2024', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Spiter', 'Desolus', 'Nocturnal Wolf', 'Hofaker'] },
        // { flyer: '.'+june27th, alt: 'june_27th_2024_HaltomTheater', date: 'June 27th, 2024', venue: 'Haltom Theater', address: '5601 E Belknap St, Haltom City, TX 76117', bands: ['Distain', 'Void', 'Odius', 'Kudu'] },
        // { flyer: '.'+june30th, alt: 'june_30th_2024_CharliesStarLounge', date: 'June 30th, 2024', venue: 'Charlie\'s Star Lounge', address: '4319 Main St, Dallas, TX 75226', bands: ['Festival'] },
        // { flyer: '.'+august16h, alt: 'august_16th_2024_DoubleWide', date: 'August 16th, 2024', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Oxygen Destroyer', 'Morgue Meat'] },
        // { flyer: '.'+sept14th, alt: 'sept_14th_2024_GrowlRecords', date: 'September 14th, 2024', venue: 'Growl Records', address: '09 E Abram St, Arlington, TX 76010', bands: ['Festival'] },
        // { flyer: '.'+sept27th, alt: 'sept_27th_2024_ZoundsBSide', date: 'September 27th, 2024', venue: 'Zounds B-Side', address: '10050 Shoreview Rd, Dallas, TX 75238', bands: ['AKA', 'Solly'] },
        // { flyer: '.'+oct4, alt: 'october_4th_2024_Renos', date: 'October 4th, 2024', venue: 'Renos', address: '210 N Crowdus St, Dallas, TX 75226', bands: ['In Human Form', 'Mouth of Cronus', 'Norman Invasion'] },
        // { flyer: '.'+oct13, alt: 'october_13th_2024_GrowlRecords', date: 'October 13th, 2024', venue: 'Growl Records', address: '09 E Abram St, Arlington, TX 76010', bands: ['Civil Serpents', 'Negative Influence', 'Bliss Fields'] },
        // { flyer: '.'+fm2m, alt: 'october_25th_2024_CheapSteaks', date: 'October 25th, 2024', venue: 'Cheap Steaks', address: '2613 Elm St, Dallas, TX 75226', bands: ['Festival'] },
        // { flyer: '.'+fm2m, alt: 'december_7th_2024_RenosChopShop', date: 'December 7th, 2024', venue: 'Reno\'s Chop Shop', address: '210 N Crowdus St, Dallas, TX 75226', bands: ['Festival'] }
        { flyer: '.' + mar27_2025, alt: 'march_27th_2025_ThreeLinks', date: 'March 27th, 2025', venue: 'Three Links', address: '2704 Elm St, Dallas, TX 75226', bands: ['Void', 'Odious', 'Carnist'] },
        { flyer: '.' + may17_2025, alt: 'may_17th_2025_RubberGloves', date: 'May 17th, 2025', venue: 'Rubber Gloves', address: '411 E Sycamore St, Denton, TX 76205', bands: ['Pale Misery', 'Tsuris', 'Nocturnal Spawn'] },
        { flyer: '.' + may24_2025, alt: 'may_24th_2025_DoubleWide', date: 'May 24th, 2025', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Volcandra', 'Saidan', 'Inverted Candles'] },
        { flyer: '.' + july23_2025, alt: 'july_23_2025_RubberGloves', date: 'July 23rd, 2025', venue: 'Rubber Gloves', address: '411 E Sycamore St, Denton, TX 76205', bands: ['Eternal', 'Nocturnal Spawn', 'Repulse'] },
        { flyer: '.' + aug8_2025, alt: 'aug_8th_2025_ZoundsBSide', date: 'Aug 8th, 2025', venue: 'Zounds B-Side', address: '10050 Shoreview Rd, Dallas, TX 75238', bands: ['Throat Locust', 'Animus', 'No Gimmicks'] },
        { flyer: '.' + aug25_2025, alt: 'aug_25th_TXTeaRoom', date: 'August 25th, 2025', venue: 'TX Tea Room', address: '2815 Main St Suite B, Dallas, TX 75226', bands: ['Panpsychism', 'Psychiatric Regurgitation', 'Cynical'] },
        { flyer: '.' + sept4th_2025, alt: 'sept_4th_HaltomTheater', date: 'September 4th, 2025', venue: 'Haltom Theater', address: '5601 E Belknap St, Haltom City, TX 76117', bands: ['Labyrinth', 'Warhog', 'Skull Archer', 'Odious'] },
        { flyer: '.' + oct11th_2025, alt: 'oct_11th_DoubleWide', date: 'October 11th, 2025', venue: 'DoubleWide', address: '3510 Commerce St, Dallas, TX', bands: ['Tencher', 'Sadistic Force', 'Accuser', 'Narcissist'] },
        { flyer: '.' + nov8th_renos, alt: 'nov_8th_RenosChopShop', date: 'November 8th, 2025', venue: 'Reno\'s Chop Shop', address: '210 N Crowdus St, Dallas, TX 75226', bands: ['Evil Army', 'Silver Tongue Devil', 'Accuser', 'Odious'] },
        { flyer: '.' + nov9th_2025_dustys, alt: 'nov_9th_Dustys', date: 'November 9th, 2025', venue: 'Dusty\'s', address: '2613 Elm St, Dallas, TX 75226', bands: ['Satanik Heavy Drinker', 'Chemical Spell', 'Carnist'] },
        { flyer: '.' + april3rd_2026_renos, alt: 'april_3rd_2026_RenosChopShop', date: 'April 3rd, 2026', venue: 'Reno\'s Chop Shop', address: '210 N Crowdus St, Dallas, TX 75226', bands: ['Void', 'Phantom', 'Accuser'] },
    ];

    return (
        <div className="shows-wrapper">
            <h2 className='shows-page-header'>Upcoming Shows:</h2>
            <h4 className='shows-page-header'>(click or tap the venue name for directions)</h4>
            <ul className='show-dates-ul'>
                {shows.map((show, idx) => (
                    <Show show={show} key={idx} />
                ))}
            </ul>

            {/* <h2 className='shows-page-header'>
                No upcoming shows, check back soon!
            </h2> */}
        </div>
    )
}