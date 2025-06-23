import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    return (
        <header className="header">
            <div className="header-actions">
                <button className="login-button" onClick={onLoginClick}>Log in</button>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;