import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import tinovationLogo from '../assets/tinovation-logo.png';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <nav className="bg-[#ebebeb] shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <img className="h-8 w-auto" src={tinovationLogo} alt="Tinovation" />
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/wordle" className="text-gray-700 hover:text-gray-900">
              Wordle
            </Link>
            <Link to="/connections" className="text-gray-700 hover:text-gray-900">
              Connection
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.picture}
                  alt="Profile"
                />
                <button
                  onClick={() => {
                    setUser(null);
                  }}
                  className="text-gray-700 hover:text-gray-900"
                >
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
              >
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
