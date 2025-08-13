// filepath: src/components/Header/Header.tsx
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    const { isLoggedIn, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        // Optionally redirect to login page
        onLoginClick();
    };

    return (
        <div className="flex items-center gap-4">
            <ThemeToggle />
            {isLoggedIn ? (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                        Welcome, {user?.username}
                    </span>
                    <button 
                        className="px-4 py-2 rounded-md border border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button 
                    className="px-4 py-2 rounded-md border border-primary bg-transparent text-primary hover:bg-primary hover:text-white transition-all duration-200 text-sm"
                    onClick={onLoginClick}
                >
                    Log in
                </button>
            )}
        </div>
    );
};

export default Header;