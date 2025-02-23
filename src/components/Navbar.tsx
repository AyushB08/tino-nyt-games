import { useState, useEffect, useRef, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import tinovationLogo from "../assets/tinovation-logo.png";
import guestProfile from "../assets/guest.jpg";

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userData = await res.json();

        await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userData.id,   
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          }),
        });
        
        setUser({ ...userData, picture: userData.picture });
        setDropdownOpen(false);
      } catch (error) {
        console.error("Fetching user info or backend call failed:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login();
  };

  const logout = () => {
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <img className="h-8 w-auto" src={tinovationLogo} alt="Tinovation" />
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-gray-900 text-sm">
              Home
            </Link>
            <Link to="/wordle" className="text-gray-700 hover:text-gray-900 text-sm">
              Wordle
            </Link>
            <Link to="/connections" className="text-gray-700 hover:text-gray-900 text-sm">
              Connections
            </Link>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="rounded-full hover:ring-2 hover:ring-gray-200 transition-all duration-200 p-0.5"
            >
              <img
                className="h-8 w-8 rounded-full"
                src={user?.picture || guestProfile}
                alt="Profile"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 border border-gray-100 transform transition-all duration-200 ease-out scale-95 origin-top-right">
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-150"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-150"
                  >
                    Sign In with Google
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
