import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage("maldevera-theme", "default");
    const [showLights, setShowLights] = useLocalStorage("maldevera-lights", true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-lights', showLights ? 'on' : 'off');
    }, [showLights]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'default' ? 'lovecraftian' : 'default');
    };

    const toggleLights = () => {
        setShowLights(prev => !prev);
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isLovecraftian: theme === 'lovecraftian',
        showLights,
        toggleLights
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
