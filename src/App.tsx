import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import FileUpload from './components/Upload';
import Feedback from './components/Feedback';
import Library from './components/Library';
import { CloudArrowUpIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'upload' | 'library' | 'feedback' | 'login' | 'register'>('upload');

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleNavClick = (view: 'upload' | 'library' | 'feedback') => {
    setCurrentView(view);
  };

  const handleFilesUploaded = (files: FileList) => {
    console.log('Files uploaded:', Array.from(files).map(file => file.name));
    // Handle file upload logic here
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'login':
        return <Login onRegisterClick={handleRegisterClick} />;
      case 'register':
        return <Register onLoginClick={handleLoginClick} />;
      case 'upload':
        return <FileUpload onFilesUploaded={handleFilesUploaded} />;
      case 'library':
        return <Library />;
      case 'feedback':
        return <Feedback />;
      default:
        return (
          <div className="p-5">
            <h2 className="text-2xl font-semibold">Welcome to AudioNorm</h2>
          </div>
        );
    }
  };

  // ...existing code...
  const navItems = [
    { label: 'Upload file', icon: CloudArrowUpIcon, key: 'upload' as const },
    { label: 'Library', icon: BookOpenIcon, key: 'library' as const },
    { label: 'Feedback', icon: ChatBubbleLeftEllipsisIcon, key: 'feedback' as const }
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
                const isActive = currentView === item.key;
                return (
                  <div
                    key={index}
                    onClick={() => handleNavClick(item.key)}
                    className={`
                      flex items-center px-4 py-3 mx-0 cursor-pointer transition-colors duration-200 
                      border-b border-transparent dark:border-gray-600 
                      hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-l-4 hover:border-l-primary
                      ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary' : ''}
                    `}
                  >
                    <IconComponent className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`} />
                    <span className={`${isActive ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-200'}`}>
                      {item.label}
                    </span>
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