import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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

    // Track mouse position globally so flashlight knows where to start
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    useEffect(() => {
        const trackMouse = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', trackMouse);
        return () => window.removeEventListener('mousemove', trackMouse);
    }, []);

    // Flashlight mouse tracking
    const handleMouseMove = useCallback((e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    }, []);

    useEffect(() => {
        if (flashlightMode) {
            document.documentElement.setAttribute('data-flashlight', 'on');
            // Set initial position to current mouse position
            document.documentElement.style.setProperty('--mouse-x', `${mousePos.current.x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${mousePos.current.y}px`);
            window.addEventListener('mousemove', handleMouseMove);
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
