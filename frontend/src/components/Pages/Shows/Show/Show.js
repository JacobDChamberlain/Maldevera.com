import React, { useState } from "react";
import ReactModal from 'react-modal';
import './Show.css';

export default function Show({ show, mode = "poster", calendarUrl, directionsUrl, isPast = false }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    // Hero mode - large flyer for the featured show
    if (mode === "hero") {
        return (
            <>
                <img
                    className="hero-flyer-image"
                    src={show.flyer}
                    alt={show.alt}
                    onClick={toggleModal}
                />
                <ReactModal
                    isOpen={isOpen}
                    onRequestClose={toggleModal}
                    className='flyer-modal'
                    overlayClassName='flyer-overlay'
                >
                    <img
                        src={show.flyer}
                        alt='fullscreen flyer'
                        className='modal-flyer-image'
                        onClick={toggleModal}
                    />
                </ReactModal>
            </>
        );
    }

    // Poster mode - compact card for the poster wall
    return (
        <div className={`poster-show ${isPast ? 'poster-show-past' : ''}`}>
            <img
                className="poster-flyer-image"
                src={show.flyer}
                alt={show.alt}
                onClick={toggleModal}
            />
            <div className="poster-info">
                <span className="poster-date">{show.date}</span>
                <span className="poster-venue">@ {show.venue}</span>
                {!isPast && (calendarUrl || directionsUrl) && (
                    <div className="poster-actions">
                        {directionsUrl && (
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="poster-btn"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Map
                            </a>
                        )}
                        {calendarUrl && (
                            <a
                                href={calendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="poster-btn"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Cal
                            </a>
                        )}
                    </div>
                )}
            </div>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                className='flyer-modal'
                overlayClassName='flyer-overlay'
            >
                <img
                    src={show.flyer}
                    alt='fullscreen flyer'
                    className='modal-flyer-image'
                    onClick={toggleModal}
                />
            </ReactModal>
        </div>
    );
}
