import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Header from './components/Header/Header';
import './styles/globals.css';
import './styles/themes.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Layout>
        <div className="app-layout">
          <div className="sidebar">
            <div className="brand-section">
              <h1 className="brand-title">AudioNorm</h1>
              <Header />
            </div>
            <nav className="sidebar-nav">
              <div className="nav-item">Upload file</div>
              <div className="nav-item">Library</div>
              <div className="nav-item">Feedback</div>
            </nav>
          </div>
          <div className="main-area">
            {/* Main content area - currently empty like in the target design */}
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default App;