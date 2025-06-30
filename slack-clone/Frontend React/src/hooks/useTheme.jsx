
import { useState, useEffect, createContext, useContext } from 'react';
import themes from '../config/themeConfig';

// Create a context for the theme
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get the theme from localStorage or use default
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('slackCloneTheme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'default';
  });
  
  const [syncWithOS, setSyncWithOS] = useState(() => {
    const savedSync = localStorage.getItem('syncThemeWithOS');
    return savedSync === 'true';
  });

  // Apply theme to document
  useEffect(() => {
    // If sync with OS is enabled, determine system preference
    if (syncWithOS) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themeToUse = isDarkMode ? 'dark' : 'default';
      applyTheme(themeToUse);
      return;
    }

    // Otherwise use the selected theme
    applyTheme(currentTheme);
  }, [currentTheme, syncWithOS]);

  // Watch for OS theme changes if sync is enabled
  useEffect(() => {
    if (!syncWithOS) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const themeToUse = e.matches ? 'dark' : 'default';
      applyTheme(themeToUse);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [syncWithOS]);

  // Function to apply theme CSS variables
  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    const { colors } = theme;
    
    // Apply all color variables to the root element
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Log theme application for debugging
    console.log(`Applied theme: ${themeName}`);
  };

  // Change the theme and save to localStorage
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('slackCloneTheme', themeName);
    }
  };
  
  // Toggle OS sync setting
  const toggleSyncWithOS = (value) => {
    setSyncWithOS(value);
    localStorage.setItem('syncThemeWithOS', value.toString());
  };

  // Context value
  const value = {
    currentTheme,
    changeTheme,
    themes,
    syncWithOS,
    toggleSyncWithOS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
