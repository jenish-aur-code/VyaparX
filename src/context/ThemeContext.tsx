import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'orange' | 'green' | 'blue' | 'purple' | 'red';

export interface ThemeColorConfig {
  name: string;
  label: string;
  primary: string;
  hover: string;
  light: string;
  text: string;
  accent: string;
  navy: string;
  cyan: string;
}

export const APP_THEME: ThemeColorConfig = {
  name: 'blue',
  label: 'Vyapar Blue',
  primary: '#1E74BD',
  hover: '#1662A0',
  light: '#EDF6FD',
  text: '#165A94',
  accent: 'from-[#272264] via-[#1E74BD] to-[#00ADEF]',
  navy: '#272264',
  cyan: '#00ADEF',
};

export const THEME_PALETTES: Record<ThemeColor, ThemeColorConfig> = {
  orange: APP_THEME,
  green: APP_THEME,
  blue: APP_THEME,
  purple: APP_THEME,
  red: APP_THEME,
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  palette: ThemeColorConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('vyaparx_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [themeColor] = useState<ThemeColor>('blue');

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vyaparx_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Apply CSS color variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', APP_THEME.primary);
    root.style.setProperty('--primary-hover', APP_THEME.hover);
    root.style.setProperty('--primary-light', APP_THEME.light);
    root.style.setProperty('--primary-text', APP_THEME.text);
    root.style.setProperty('--primary-navy', APP_THEME.navy);
    root.style.setProperty('--primary-cyan', APP_THEME.cyan);
    localStorage.setItem('vyaparx_theme_color', 'blue');
  }, []);

  const toggleDarkMode = () => setIsDarkModeState(prev => !prev);
  const setDarkMode = (val: boolean) => setIsDarkModeState(val);
  const setThemeColor = () => { /* Theme is locked to brand blue palette */ };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        themeColor,
        setThemeColor,
        palette: APP_THEME,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
