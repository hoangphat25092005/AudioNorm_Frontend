import React from 'react';
import useTheme from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        // change to a slider
        <button 
            onClick={toggleTheme} 
            className="w-8 h-8 rounded-full border-none bg-black dark:bg-white text-white cursor-pointer flex items-center justify-center text-xs"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? '☀' : '🌙'}
        </button>
    );
};

export default ThemeToggle;