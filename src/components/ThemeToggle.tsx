import React from 'react';
import useTheme from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme} 
            className="w-8 h-8 rounded-full border-none bg-primary text-white cursor-pointer flex items-center justify-center text-xs transition-colors duration-200 hover:bg-primary-hover"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? '☀' : '🌙'}
        </button>
    );
};

export default ThemeToggle;