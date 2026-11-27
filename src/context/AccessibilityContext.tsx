import React, { createContext, useContext, useState, useEffect } from 'react';

export type TextScale = 'normal' | 'large' | 'huge';

interface AccessibilityContextType {
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  increaseTextScale: () => void;
  decreaseTextScale: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textScale, setTextScale] = useState<TextScale>('large'); // default to 'large' for elder-friendliness
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Load preferences from localStorage if available
  useEffect(() => {
    const savedScale = localStorage.getItem('sriyam_text_scale') as TextScale;
    const savedContrast = localStorage.getItem('sriyam_high_contrast');
    if (savedScale && ['normal', 'large', 'huge'].includes(savedScale)) {
      setTextScale(savedScale);
    }
    if (savedContrast === 'true') {
      setHighContrast(true);
    }
  }, []);

  const handleSetTextScale = (scale: TextScale) => {
    setTextScale(scale);
    localStorage.setItem('sriyam_text_scale', scale);
  };

  const increaseTextScale = () => {
    if (textScale === 'normal') handleSetTextScale('large');
    else if (textScale === 'large') handleSetTextScale('huge');
  };

  const decreaseTextScale = () => {
    if (textScale === 'huge') handleSetTextScale('large');
    else if (textScale === 'large') handleSetTextScale('normal');
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      localStorage.setItem('sriyam_high_contrast', String(next));
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textScale,
        setTextScale: handleSetTextScale,
        increaseTextScale,
        decreaseTextScale,
        highContrast,
        toggleHighContrast
      }}
    >
      <div 
        className={`min-h-screen ${
          highContrast ? 'high-contrast-mode' : ''
        } ${
          textScale === 'huge' ? 'text-scale-huge' : textScale === 'large' ? 'text-scale-large' : 'text-scale-normal'
        }`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
