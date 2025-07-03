import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, Home, Clock, Building } from 'lucide-react';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-white text-xl font-bold">
          <Building className="w-6 h-6" />
          <span>Meeting Room Booking</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white hover:text-gray-200 flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/history" className="text-white hover:text-gray-200 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Booking History</span>
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-white flex items-center space-x-2">
                <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full" />
                <span>{user.name}</span>
              </span>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="text-white hover:text-gray-200 flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="text-white hover:text-gray-200 flex items-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;