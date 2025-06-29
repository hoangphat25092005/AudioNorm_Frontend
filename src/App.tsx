import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import { CloudArrowUpIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register'>('home');

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'login':
        return <Login onRegisterClick={handleRegisterClick} />;
      case 'register':
        return <Register onLoginClick={handleLoginClick} />;
      default:
        return (
          <div className="p-5">
            <h2 className="text-2xl font-semibold">Welcome to AudioNorm</h2>
          </div>
        );
    }
  };

  const navItems = [
    { label: 'Upload file', icon: CloudArrowUpIcon },
    { label: 'Library', icon: BookOpenIcon },
    { label: 'Feedback', icon: ChatBubbleLeftEllipsisIcon }
  ];

  return (
    <ThemeProvider>
      <Layout>
        <div className="flex h-screen relative">
          <div className="w-52 bg-white dark:bg-dark-sidebar border-r border-gray-200 dark:border-gray-700 flex flex-col relative">
            <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white dark:bg-dark-sidebar border-b border-gray-200 dark:border-gray-700 px-4 py-6 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-primary">
                Audio<span className="text-gray-900 dark:text-white">Norm</span>
              </h1>
              <Header onLoginClick={handleLoginClick} />
            </div>
            <nav className="flex-1 pt-20 pb-4">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center px-4 py-3 mx-0 cursor-pointer transition-colors duration-200 border-b border-transparent dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-l-4 hover:border-l-primary"
                  >
                    <IconComponent className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
                  </div>
                );
              })}
            </nav>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-dark-bg relative mt-20">
            {renderMainContent()}
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default App;