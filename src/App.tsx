import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import './styles/globals.css';
import './styles/themes.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register'>('home');

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'login':
        return <Login onRegisterClick={handleRegisterClick} />;
      case 'register':
        return <Register onLoginClick={handleLoginClick} />;
      default:
        return (
          <div style={{ padding: '20px' }}>
            <h2>Welcome to AudioNorm</h2>
            
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="app-layout">
          <div className="sidebar">
            <div className="brand-section">
              <h1 className="brand-title">AudioNorm</h1>
              <Header onLoginClick={handleLoginClick} />
            </div>
            <nav className="sidebar-nav">
              <div className="nav-item">Upload file</div>
              <div className="nav-item">Library</div>
              <div className="nav-item">Feedback</div>
            </nav>
          </div>
          <div className="main-area">
            {renderMainContent()}
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default App;