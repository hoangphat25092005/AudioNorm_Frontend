import React, { ReactNode } from 'react';
import Header from '../Header/Header';
import useTheme from '../../hooks/useTheme'; 

interface LayoutProps {
    children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme } = useTheme();

    return (
        <div className={`layout ${theme}-theme`}>
            <Header />
            <main className="main-content">{children}</main>
        </div>
    );
};

export default Layout;