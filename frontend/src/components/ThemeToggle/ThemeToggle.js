import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { toggleTheme, isAlien, showLights, toggleLights, flashlightMode, toggleFlashlight, logoCycling, toggleLogoCycling } = useTheme();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="theme-controls" ref={dropdownRef}>
            <button
                className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle effects menu"
                title="Effects"
            >
                <span className="dropdown-arrow">▼</span>
            </button>

            {isOpen && (
                <div className="effects-dropdown">
                    <button
                        className={`effect-btn ${isAlien ? 'on' : 'off'}`}
                        onClick={toggleTheme}
                        title={isAlien ? 'Turn off Xeno mode' : 'Turn on Xeno mode'}
                    >
                        👽
                    </button>

                    <button
                        className={`effect-btn ${showLights ? 'on' : 'off'}`}
                        onClick={toggleLights}
                        title={`Turn lights ${showLights ? 'off' : 'on'}`}
                    >
                        💡
                    </button>

                    <button
                        className={`effect-btn flashlight-btn ${flashlightMode ? 'on' : 'off'}`}
                        onClick={toggleFlashlight}
                        title={`Turn flashlight ${flashlightMode ? 'off' : 'on'}`}
                    >
                        🔦
                    </button>

                    <button
                        className={`effect-btn storm-btn ${logoCycling ? 'on' : 'off'}`}
                        onClick={toggleLogoCycling}
                        title={`Storm mode: ${logoCycling ? 'on' : 'off'}`}
                    >
                        ⚡
                    </button>
                </div>
            )}
        </div>
    );
}
