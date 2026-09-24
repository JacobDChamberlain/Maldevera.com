import React from 'react';

// Structured data for upcoming shows. This is what lets a search engine list a
// date, venue and city directly in results instead of showing a blue link to a
// page it can't read. Google renders JavaScript when it indexes, so emitting
// this from the component works - but only for Google. Other crawlers need the
// page prerendered, which is still on the backlog.

const SITE = 'https://maldevera.com';

// Not bands: placeholders and stage notes that live in the same array.
const NOT_A_BAND = /^festival$/i;
const IS_A_NOTE = /^\(/;

// '3510 Commerce St, Dallas, TX 75226' -> its parts. Falls back gracefully:
// a malformed address yields fewer fields rather than wrong ones.
function parseAddress(address) {
    const parts = String(address).split(',').map(p => p.trim()).filter(Boolean);
    const streetAddress = parts[0];
    const addressLocality = parts[1];
    const regionAndZip = (parts[2] || '').split(/\s+/);

    const postal = {
        '@type': 'PostalAddress',
        addressCountry: 'US'
    };
    if (streetAddress) postal.streetAddress = streetAddress;
    if (addressLocality) postal.addressLocality = addressLocality;
    if (regionAndZip[0]) postal.addressRegion = regionAndZip[0];
    if (regionAndZip[1]) postal.postalCode = regionAndZip[1];

    return postal;
}

// Local date parts, not toISOString - that shifts across midnight in US zones
// and would publish the wrong day for evening shows.
function toIsoDate(date) {
    const pad = n => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// '8:00 PM' -> '20:00'. Returns null on anything it doesn't recognise, so a
// malformed time degrades to a date-only event rather than a wrong one.
function to24Hour(time) {
    const m = /^\s*(\d{1,2}):(\d{2})\s*([AaPp])\.?[Mm]\.?\s*$/.exec(String(time || ''));
    if (!m) return null;

    let hour = parseInt(m[1], 10);
    const minute = m[2];
    if (hour < 1 || hour > 12) return null;

    const isPm = m[3].toLowerCase() === 'p';
    if (isPm && hour !== 12) hour += 12;
    if (!isPm && hour === 12) hour = 0;

    return `${String(hour).padStart(2, '0')}:${minute}`;
}

// Deliberately no timezone offset. These shows run from Texas to New York, and
// a fixed offset would be wrong for half of them; schema.org reads a local
// datetime as local to the venue, which is exactly what's meant.
function dateTime(isoDate, time) {
    const hhmm = to24Hour(time);
    return hhmm ? `${isoDate}T${hhmm}` : null;
}

// '$15' -> '15'. Free shows say so; anything unparseable is left out entirely.
function toPrice(price) {
    const m = /(\d+(?:\.\d{1,2})?)/.exec(String(price || ''));
    if (m) return m[1];
    return /free/i.test(String(price || '')) ? '0' : null;
}

export function buildShowsJsonLd(upcoming, parseShowDate) {
    return upcoming.map(show => {
        const others = (show.bands || [])
            .filter(b => typeof b === 'string' && !NOT_A_BAND.test(b) && !IS_A_NOTE.test(b));

        const isoDate = toIsoDate(parseShowDate(show.date));
        const startDate = dateTime(isoDate, show.showTime) || isoDate;
        const doorTime = dateTime(isoDate, show.doors);
        const price = toPrice(show.price);

        return {
            '@context': 'https://schema.org',
            '@type': 'MusicEvent',
            name: `Maldevera at ${show.venue}`,
            startDate,
            ...(doorTime ? { doorTime } : {}),
            ...(price !== null ? {
                offers: {
                    '@type': 'Offer',
                    price,
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: `${SITE}/shows`
                }
            } : {}),
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            url: `${SITE}/shows`,
            image: `${SITE}/images/og-maldevera.jpg`,
            location: {
                '@type': 'MusicVenue',
                name: show.venue,
                address: parseAddress(show.address)
            },
            performer: [
                { '@type': 'MusicGroup', name: 'Maldevera', sameAs: `${SITE}/` },
                ...others.map(name => ({ '@type': 'MusicGroup', name }))
            ],
            organizer: { '@type': 'MusicGroup', name: 'Maldevera', url: `${SITE}/` }
        };
    });
}

export default function ShowsJsonLd({ upcoming, parseShowDate }) {
    if (!upcoming || upcoming.length === 0) return null;

    const events = buildShowsJsonLd(upcoming, parseShowDate);

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(events) }}
        />
    );
}
