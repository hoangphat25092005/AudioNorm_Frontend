import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-actions">
                <button className="login-button">Log in</button>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;