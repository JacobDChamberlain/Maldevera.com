import React, { useState } from "react";
import ReactModal from 'react-modal';
import './Tours.css'
import tourFlyer from './TourFlyers/Maldevera-East-Coast-Tour-2026-Flyer.png'
import { FancyBorder } from '../../Templates/FancyBorder'

export default function Tours() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="tours-wrapper">
            <FancyBorder>
                <img
                    src={tourFlyer}
                    alt="Maldevera East Coast Tour 2026"
                    className="tour-flyer"
                    onClick={() => setIsOpen(true)}
                />
            </FancyBorder>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                className='flyer-modal'
                overlayClassName='flyer-overlay'
            >
                <img
                    src={tourFlyer}
                    alt='fullscreen flyer'
                    className='modal-flyer-image'
                    onClick={() => setIsOpen(false)}
                />
            </ReactModal>
        </div>
    )
}
