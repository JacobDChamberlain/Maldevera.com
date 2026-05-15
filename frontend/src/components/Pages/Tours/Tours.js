import React from "react";
import './Tours.css'
import tourFlyer from './TourFlyers/Maldevera-East-Coast-Tour-2026-Flyer.png'

export default function Tours() {
    return (
        <div className="tours-wrapper">
            <img
                src={tourFlyer}
                alt="Maldevera East Coast Tour 2026"
                className="tour-flyer"
            />
        </div>
    )
}
