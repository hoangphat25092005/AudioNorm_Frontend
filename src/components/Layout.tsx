import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout w-full min-h-screen bg-gray-50 dark:bg-dark-bg">
            {children}
        </div>
    );
};

export default Layout;