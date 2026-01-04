import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage("maldevera-theme", "default");
    const [showLights, setShowLights] = useLocalStorage("maldevera-lights", true);
    const [flashlightMode, setFlashlightMode] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-lights', showLights ? 'on' : 'off');
    }, [showLights]);

    // Flashlight mouse tracking
    const handleMouseMove = useCallback((e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    }, []);

    useEffect(() => {
        if (flashlightMode) {
            document.documentElement.setAttribute('data-flashlight', 'on');
            window.addEventListener('mousemove', handleMouseMove);
            // Set initial position to center
            document.documentElement.style.setProperty('--mouse-x', `${window.innerWidth / 2}px`);
            document.documentElement.style.setProperty('--mouse-y', `${window.innerHeight / 2}px`);
        } else {
            document.documentElement.setAttribute('data-flashlight', 'off');
            window.removeEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [flashlightMode, handleMouseMove]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'default' ? 'lovecraftian' : 'default');
    };

    const toggleLights = () => {
        setShowLights(prev => !prev);
    };

    const toggleFlashlight = () => {
        setFlashlightMode(prev => !prev);
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isLovecraftian: theme === 'lovecraftian',
        showLights,
        toggleLights,
        flashlightMode,
        toggleFlashlight
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
