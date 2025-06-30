
import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './ThemePopup.css';

const ThemePopup = ({ isOpen, onClose }) => {
  const { themes, currentTheme, changeTheme, syncWithOS, toggleSyncWithOS } = useTheme();
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Close popup when pressing Escape
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyNavigation = (e) => {
      if (!isOpen) return;

      const themeCards = document.querySelectorAll('.theme-card');
      if (!themeCards.length) return;

      const currentIndex = Array.from(themeCards).findIndex(
        card => card.getAttribute('data-theme') === currentTheme
      );

      let newIndex;
      switch (e.key) {
        case 'ArrowRight':
          newIndex = (currentIndex + 1) % themeCards.length;
          break;
        case 'ArrowLeft':
          newIndex = (currentIndex - 1 + themeCards.length) % themeCards.length;
          break;
        case 'ArrowUp':
          newIndex = (currentIndex - 4 + themeCards.length) % themeCards.length;
          break;
        case 'ArrowDown':
          newIndex = (currentIndex + 4) % themeCards.length;
          break;
        case 'Enter':
          const theme = themeCards[currentIndex]?.getAttribute('data-theme');
          if (theme) changeTheme(theme);
          break;
        default:
          return;
      }

      if (newIndex !== undefined && themeCards[newIndex]) {
        themeCards[newIndex].focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyNavigation);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyNavigation);
    };
  }, [isOpen, currentTheme, changeTheme]);

  if (!isOpen) return null;

  // Group themes by type
  const groupThemes = () => {
    const primaryThemes = ['default', 'dark', 'aubergine', 'modern', 'oceanic'];
    const colorThemes = ['clementine', 'banana', 'lagoon', 'forest', 'raspberry', 'mintChip', 'blueberry', 'midnight'];
    
    return {
      primaryThemes: primaryThemes.filter(name => themes[name]),
      colorThemes: colorThemes.filter(name => themes[name])
    };
  };

  const { primaryThemes, colorThemes } = groupThemes();

  const renderThemePreview = (themeName) => {
    const theme = themes[themeName];
    return (
      <div className="theme-preview">
        <div 
          className="theme-sidebar-preview" 
          style={{ backgroundColor: theme.colors.sidebarBg }}
        />
        <div 
          className="theme-chat-preview" 
          style={{ backgroundColor: theme.colors.chatBg }}
        />
      </div>
    );
  };

  return (
    <div className="theme-popup-overlay">
      <div 
        ref={popupRef} 
        className="theme-popup"
        style={{ width: '360px', maxHeight: '420px' }}
      >
        <div className="theme-popup-header">
          <h2>Change Appearance</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="theme-popup-content">
          <h3>Default Themes</h3>
          <div className="theme-grid">
            {primaryThemes.map((themeName) => (
              <div 
                key={themeName}
                className={`theme-card ${currentTheme === themeName ? 'active' : ''}`}
                data-theme={themeName}
                onClick={() => changeTheme(themeName)}
                tabIndex={0}
              >
                {renderThemePreview(themeName)}
                <div className="theme-name">{themes[themeName].name}</div>
                {currentTheme === themeName && (
                  <div className="theme-checkmark">
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <h3>Color Themes</h3>
          <div className="theme-grid">
            {colorThemes.map((themeName) => (
              <div 
                key={themeName}
                className={`theme-card ${currentTheme === themeName ? 'active' : ''}`}
                data-theme={themeName}
                onClick={() => changeTheme(themeName)}
                tabIndex={0}
              >
                {renderThemePreview(themeName)}
                <div className="theme-name">{themes[themeName].name}</div>
                {currentTheme === themeName && (
                  <div className="theme-checkmark">
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <h3>Custom Colors</h3>
          <div className="theme-grid">
            <div 
              className={`theme-card ${currentTheme === 'custom' ? 'active' : ''}`}
              data-theme="custom"
              onClick={() => changeTheme('custom')}
              tabIndex={0}
            >
              {renderThemePreview('custom')}
              <div className="theme-name">{themes.custom.name}</div>
              {currentTheme === 'custom' && (
                <div className="theme-checkmark">
                  <Check size={16} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="theme-popup-footer">
          <label className="sync-os-toggle">
            <input 
              type="checkbox" 
              checked={syncWithOS} 
              onChange={(e) => toggleSyncWithOS(e.target.checked)} 
            />
            <span>Sync with OS theme</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ThemePopup;
