import { useState, useRef, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { BsBarChart, BsGear, BsInfoCircle, BsPersonCircle } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.scss';

const Header = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
}) => {
  const { user, login, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          login({
            name: data.name,
            email: data.email,
            imageUrl: data.picture,
          });
          setShowDropdown(false);
        })
        .catch((error) => console.error('Login failed:', error));
    },
    onError: () => console.log('Login Failed'),
  });

  const handleLogout = () => {
    googleLogout();
    logout();
    setShowDropdown(false);
  };

  return (
    <header className={styles.header}>
      <button 
        className={styles['icon-button']} 
        onClick={() => setIsInfoModalOpen(true)}
      >
        <BsInfoCircle size="1.6rem" color="var(--color-icon)" />
      </button>

      <h1 className={styles.title}>WORDLE</h1>

      <div className={styles['controls-container']}>
        <button 
          className={styles['icon-button']} 
          onClick={() => setIsStatsModalOpen(true)}
        >
          <BsBarChart size="1.6rem" color="var(--color-icon)" />
        </button>
        <button 
          className={styles['icon-button']} 
          onClick={() => setIsSettingsModalOpen(true)}
        >
          <BsGear size="1.6rem" color="var(--color-icon)" />
        </button>

        <div className={styles['profile-container']} ref={dropdownRef}>
          <button 
            className={styles['profile-button']}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user ? (
              <img
                src={user.imageUrl}
                alt="profile"
                className={styles['profile-image']}
              />
            ) : (
              <BsPersonCircle size="1.6rem" color="var(--color-icon)" />
            )}
          </button>

          {showDropdown && (
            <div className={styles['profile-dropdown']}>
              {user ? (
                <>
                  <div className={styles['user-info']}>
                    <span className={styles['user-name']}>{user.name}</span>
                    <span className={styles['user-email']}>{user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className={styles['auth-button']}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button 
                  onClick={googleLogin}
                  className={styles['auth-button']}
                >
                  Sign in
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
