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

    // Flashlight mouse tracking with fade-out timer and shake detection
    const fadeTimeoutRef = useRef(null);
    const fadeIntervalRef = useRef(null);
    const isDead = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const shakeDistance = useRef(0);
    const shakeResetTimeout = useRef(null);

    const hintRef = useRef(null);

    const showHint = useCallback(() => {
        if (!hintRef.current) {
            const hint = document.createElement('div');
            hint.id = 'flashlight-hint';
            hint.textContent = 'jiggle to recharge';
            hint.style.cssText = `
                position: fixed;
                left: ${lastMousePos.current.x + 20}px;
                top: ${lastMousePos.current.y + 20}px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 12px;
                font-family: var(--font-primary);
                pointer-events: none;
                z-index: 9999;
                text-shadow: 0 0 5px black;
            `;
            document.body.appendChild(hint);
            hintRef.current = hint;
        }
    }, []);

    const hideHint = useCallback(() => {
        if (hintRef.current) {
            hintRef.current.remove();
            hintRef.current = null;
        }
    }, []);

    const startFadeOut = useCallback(() => {
        let opacity = 0;
        fadeIntervalRef.current = setInterval(() => {
            opacity += 0.05;
            if (opacity >= 1) {
                opacity = 1;
                clearInterval(fadeIntervalRef.current);
                isDead.current = true;
                showHint();
            }
            document.documentElement.style.setProperty('--flashlight-fade', opacity);
        }, 50);
    }, [showHint]);

    const startFadeTimer = useCallback(() => {
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = setTimeout(() => {
            startFadeOut();
        }, 10000);
    }, [startFadeOut]);

    const recharge = useCallback(() => {
        // Clear any existing fade
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        isDead.current = false;
        shakeDistance.current = 0;
        hideHint();

        // Reset to full brightness
        document.documentElement.style.setProperty('--flashlight-fade', 0);

        // Start new 10 second timer
        startFadeTimer();
    }, [startFadeTimer, hideHint]);

    const handleMouseMove = useCallback((e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

        // Calculate distance moved
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        // Update hint position if visible
        if (hintRef.current) {
            hintRef.current.style.left = `${e.clientX + 20}px`;
            hintRef.current.style.top = `${e.clientY + 20}px`;
        }

        // If flashlight is dead, accumulate shake distance
        if (isDead.current) {
            shakeDistance.current += distance;

            // Reset shake distance after 500ms of no movement
            if (shakeResetTimeout.current) clearTimeout(shakeResetTimeout.current);
            shakeResetTimeout.current = setTimeout(() => {
                shakeDistance.current = 0;
            }, 500);

            // Require 300px of movement to recharge
            if (shakeDistance.current > 300) {
                recharge();
            }
        }
    }, [recharge]);

    useEffect(() => {
        if (flashlightMode) {
            document.documentElement.setAttribute('data-flashlight', 'on');
            document.documentElement.style.setProperty('--flashlight-fade', 0);
            isDead.current = false;
            shakeDistance.current = 0;
            // Set initial position to current mouse position
            document.documentElement.style.setProperty('--mouse-x', `${mousePos.current.x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${mousePos.current.y}px`);
            lastMousePos.current = { x: mousePos.current.x, y: mousePos.current.y };
            window.addEventListener('mousemove', handleMouseMove);
            // Start the fade timer
            startFadeTimer();
        } else {
            document.documentElement.setAttribute('data-flashlight', 'off');
            window.removeEventListener('mousemove', handleMouseMove);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            if (shakeResetTimeout.current) clearTimeout(shakeResetTimeout.current);
            hideHint();
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            if (shakeResetTimeout.current) clearTimeout(shakeResetTimeout.current);
            hideHint();
        };
    }, [flashlightMode, handleMouseMove, startFadeTimer, hideHint]);

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
