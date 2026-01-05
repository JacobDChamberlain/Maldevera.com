import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { toggleTheme, theme, isLovecraftian, isAlien, showLights, toggleLights, flashlightMode, toggleFlashlight, logoCycling, toggleLogoCycling } = useTheme();

    const getThemeLabel = () => {
        if (isAlien) return 'XENO';
        if (isLovecraftian) return 'NEW';
        return 'OG';
    };

    const getNextThemeName = () => {
        if (theme === 'default') return 'Cosmic Horror';
        if (theme === 'lovecraftian') return 'Xeno';
        return 'Metal';
    };

    return (
        <div className="theme-controls">
            <button
                className={`theme-toggle ${isLovecraftian ? 'lovecraftian' : ''} ${isAlien ? 'alien' : ''}`}
                onClick={toggleTheme}
                aria-label={`Switch to ${getNextThemeName()} theme`}
                title={`Switch to ${getNextThemeName()} theme`}
            >
                <span className="theme-label">{getThemeLabel()}</span>
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
