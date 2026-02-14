import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Library from './pages/Library';
import BrandVoice from './pages/BrandVoice';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="sidebar">
      <div className="logo">
        <h1>✨ ContentFlow AI</h1>
        <p>Intelligent Content Platform</p>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          <span className="icon">📊</span>
          Dashboard
        </Link>
        <Link to="/generate" className={isActive('/generate') ? 'active' : ''}>
          <span className="icon">✍️</span>
          Generate Content
        </Link>
        <Link to="/library" className={isActive('/library') ? 'active' : ''}>
          <span className="icon">📚</span>
          Content Library
        </Link>
        <Link to="/brand-voice" className={isActive('/brand-voice') ? 'active' : ''}>
          <span className="icon">🎯</span>
          Brand Voice
        </Link>
      </div>
      
      <div className="sidebar-footer">
        <p>Powered by Claude</p>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/library" element={<Library />} />
            <Route path="/brand-voice" element={<BrandVoice />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
