import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import FileUpload from './components/Upload';
import Feedback from './components/Feedback';
import Library from './components/Library';
import { CloudArrowUpIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Routes, Route } from 'react-router-dom';
import VerifyEmail from './components/VerifyEmail';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

// Create a separate component that uses the useAuth hook


import { useNavigate } from 'react-router-dom';

const AppContent: React.FC = () => {
  const { isLoggedIn, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'upload' | 'library' | 'feedback' | 'login' | 'register'>('upload');
  const navigate = useNavigate();

  // Handle Google OAuth redirect with token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('audionorm_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      // Optionally set login state or trigger user fetch here
      navigate('/');
    }
  }, [navigate]);

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };
  const handleLoginSuccess = () => {
    setCurrentView('upload');
  };
  const handleNavClick = (view: 'upload' | 'library' | 'feedback') => {
    setCurrentView(view);
  };
  const handleFilesUploaded = (files: FileList) => {
    console.log('Files uploaded:', Array.from(files).map(file => file.name));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const navItems = [
    { label: 'Upload file', icon: CloudArrowUpIcon, key: 'upload' as const },
    { label: 'Library', icon: BookOpenIcon, key: 'library' as const },
    { label: 'Feedback', icon: ChatBubbleLeftEllipsisIcon, key: 'feedback' as const }
  ];

  return (
    <Routes>
      <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="*"
        element={
          <Layout>
            <div className="flex flex-col min-h-screen">
              <div className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200 dark:bg-dark-sidebar dark:border-gray-700">
                <h1 className="text-2xl font-semibold text-primary">
                  Audio<span className="text-gray-900 dark:text-white">Norm</span>
                </h1>
                <Header onLoginClick={handleLoginClick} />
              </div>
              <div className="flex flex-1">
                {isLoggedIn && (
                  <div className="flex flex-col min-h-full bg-white border-r border-gray-200 w-52 dark:bg-dark-sidebar dark:border-gray-700">
                    <nav className="flex-1 pb-4">
                      {navItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const isActive = currentView === item.key;
                        return (
                          <div
                            key={index}
                            onClick={() => handleNavClick(item.key)}
                            className={
                              `flex items-center px-4 py-3 mx-0 cursor-pointer transition-colors duration-200 \
                              border-b border-transparent dark:border-gray-600 \
                              hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-l-4 hover:border-l-primary\n+                              ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary' : ''}`
                            }
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
                )}
                <div className="flex-1 min-h-full bg-gray-50 dark:bg-dark-bg">
                  <div className="w-full">
                    {/* Main content logic */}
                    {!isLoggedIn ? (
                      currentView === 'register' ? (
                        <Register onLoginClick={handleLoginClick} />
                      ) : (
                        <Login onRegisterClick={handleRegisterClick} onLoginSuccess={handleLoginSuccess} />
                      )
                    ) : (
                      (() => {
                        switch (currentView) {
                          case 'upload':
                            return <FileUpload onFilesUploaded={handleFilesUploaded} />;
                          case 'library':
                            return <Library />;
                          case 'feedback':
                            return <Feedback />;
                          default:
                            return <FileUpload onFilesUploaded={handleFilesUploaded} />;
                        }
                      })()
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

// Main App component that wraps everything with providers
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;