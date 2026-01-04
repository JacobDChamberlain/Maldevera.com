import React from 'react';
import './FancyBorder.css';

/**
 * FancyBorder - Triple-border design with decorative flourishes
 *
 * Usage:
 *   import FancyBorder from '../Templates/FancyBorder';
 *   <FancyBorder title="Your Title" items={['Item 1', 'Item 2']} />
 *
 * Or with custom children:
 *   <FancyBorder title="Your Title">
 *     <p>Custom content here</p>
 *   </FancyBorder>
 *
 * To preview: Add route in App.js:
 *   import FancyBorderPreview from './components/Templates/FancyBorder';
 *   <Route path='/preview/fancy-border' Component={ FancyBorderPreview } />
 */

const DECORATION_IMAGE = "https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png";

// Example tour dates template
const EXAMPLE_TOUR_DATES = [
    "11/1    Abilene, TX",
    "11/2    Albuquerque, NM",
    "11/3    Denver, CO",
    "11/5    Salt Lake City, UT",
    "11/6    Boise, ID",
    "11/7    Seattle, WA",
    "11/8    Portland, OR",
    "11/9    Eureka, CA",
    "11/10   Oakland, CA",
    "11/12   Los Angeles, CA",
    "11/13   Anaheim, CA",
    "11/14   Las Vegas, NV",
    "11/15   Phoenix, AZ",
    "11/16   El Paso, TX"
];

export function FancyBorder({ title, items, children }) {
    return (
        <div className="fancy-outer-border">
            <div className="fancy-mid-border">
                <div className="fancy-inner-border">
                    <img
                        className="fancy-vertical-decoration top"
                        src={DECORATION_IMAGE}
                        alt="decoration"
                    />

                    {title && <h2 className="fancy-border-title">{title}</h2>}

                    {items && (
                        <ul className="fancy-border-list">
                            {items.map((item, idx) => (
                                <li key={idx} className="fancy-border-li">{item}</li>
                            ))}
                        </ul>
                    )}

                    {children}

                    <img
                        className="fancy-vertical-decoration bottom"
                        src={DECORATION_IMAGE}
                        alt="decoration"
                    />
                </div>
            </div>
        </div>
    );
}

// Default export is a preview page showing the component in action
export default function FancyBorderPreview() {
    return (
        <div style={{
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px'
        }}>
            <h1 style={{ color: 'white', fontFamily: 'serif' }}>FancyBorder Component Preview</h1>

            <h3 style={{ color: '#888' }}>Example: Tour Dates</h3>
            <FancyBorder title="Fall 2024 Tour" items={EXAMPLE_TOUR_DATES} />

            <h3 style={{ color: '#888' }}>Example: Custom Content</h3>
            <FancyBorder title="Maldevera">
                <p style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
                    Taste the corners of your mind.
                </p>
            </FancyBorder>
        </div>
    );
}
