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
}

export const THEME_PALETTES: Record<ThemeColor, ThemeColorConfig> = {
  orange: {
    name: 'orange',
    label: 'Vyapar Orange',
    primary: '#FF9800',
    hover: '#F57C00',
    light: '#FFF3E0',
    text: '#E65100',
    accent: 'from-orange-500 to-amber-500',
  },
  green: {
    name: 'green',
    label: 'Emerald Green',
    primary: '#10B981',
    hover: '#059669',
    light: '#ECFDF5',
    text: '#065F46',
    accent: 'from-emerald-500 to-teal-500',
  },
  blue: {
    name: 'blue',
    label: 'Royal Blue',
    primary: '#2563EB',
    hover: '#1D4ED8',
    light: '#EFF6FF',
    text: '#1E40AF',
    accent: 'from-blue-600 to-cyan-500',
  },
  purple: {
    name: 'purple',
    label: 'Imperial Purple',
    primary: '#7C3AED',
    hover: '#6D28D9',
    light: '#F5F3FF',
    text: '#5B21B6',
    accent: 'from-purple-600 to-indigo-500',
  },
  red: {
    name: 'red',
    label: 'Crimson Red',
    primary: '#DC2626',
    hover: '#B91C1C',
    light: '#FEF2F2',
    text: '#991B1B',
    accent: 'from-red-600 to-rose-500',
  },
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

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('vyaparx_theme_color') as ThemeColor;
    return saved && THEME_PALETTES[saved] ? saved : 'orange';
  });

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
    const p = THEME_PALETTES[themeColor];
    root.style.setProperty('--primary', p.primary);
    root.style.setProperty('--primary-hover', p.hover);
    root.style.setProperty('--primary-light', p.light);
    root.style.setProperty('--primary-text', p.text);
    localStorage.setItem('vyaparx_theme_color', themeColor);
  }, [themeColor]);

  const toggleDarkMode = () => setIsDarkModeState(prev => !prev);
  const setDarkMode = (val: boolean) => setIsDarkModeState(val);
  const setThemeColor = (color: ThemeColor) => setThemeColorState(color);

  const palette = THEME_PALETTES[themeColor] || THEME_PALETTES.orange;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        themeColor,
        setThemeColor,
        palette,
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
