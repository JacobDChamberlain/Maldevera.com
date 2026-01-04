import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { toggleTheme, isLovecraftian, showLights, toggleLights, flashlightMode, toggleFlashlight, logoCycling, toggleLogoCycling } = useTheme();

    return (
        <div className="theme-controls">
            <button
                className={`theme-toggle ${isLovecraftian ? 'lovecraftian' : ''}`}
                onClick={toggleTheme}
                aria-label={`Switch to ${isLovecraftian ? 'metal' : 'eldritch'} theme`}
                title={`Switch to ${isLovecraftian ? 'Metal' : 'Cosmic Horror'} theme`}
            >
                <span className="theme-label">{isLovecraftian ? 'NEW' : 'OG'}</span>
            </button>
            <button
                className={`lights-toggle ${showLights ? 'on' : 'off'}`}
                onClick={toggleLights}
                aria-label={`Turn lights ${showLights ? 'off' : 'on'}`}
                title={`Turn lights ${showLights ? 'off' : 'on'}`}
            >
                <span className="lights-icon">💡</span>
            </button>
            <button
                className={`flashlight-toggle ${flashlightMode ? 'on' : 'off'}`}
                onClick={toggleFlashlight}
                aria-label={`Turn flashlight ${flashlightMode ? 'off' : 'on'}`}
                title={`Turn flashlight ${flashlightMode ? 'off' : 'on'}`}
            >
                <span className="flashlight-icon">🔦</span>
            </button>
            <button
                className={`logo-toggle ${logoCycling ? 'cycling' : 'off'}`}
                onClick={toggleLogoCycling}
                aria-label={`Turn storm mode ${logoCycling ? 'off' : 'on'}`}
                title={`Storm mode: ${logoCycling ? 'on' : 'off'}`}
            >
                <span className="logo-icon">⚡</span>
            </button>
        </div>
    );
}
