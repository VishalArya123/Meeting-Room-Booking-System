import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import './index.css';

const App = () => {
  return (
    <Auth0Provider
      domain="dev-ijgror6h4kgau83q.us.auth0.com" 
      clientId="WsKHR12CJskTF3aTdfWnakxuFAAsZ7ul"
      redirectUri={window.location.origin}
    >
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;