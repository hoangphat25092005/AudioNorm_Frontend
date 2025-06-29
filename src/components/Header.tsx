// filepath: src/components/Header/Header.tsx
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    return (
        <header className="absolute top-0 right-0 flex items-center p-4 z-50">
            <div className="flex gap-2 items-center">
                <button 
                    className="px-4 py-2 rounded-md border border-primary bg-transparent text-primary hover:bg-primary hover:text-white transition-all duration-200 text-sm mr-2"
                    onClick={onLoginClick}
                >
                    Log in
                </button>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;