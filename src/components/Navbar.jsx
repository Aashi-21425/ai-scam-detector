// Navbar.jsx - Updated with login state awareness

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav style={{
      background: '#0f0f2a',
      borderBottom: '1px solid #1e1e4e',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#a0c4ff' }}>
          🛡️ ScamShield
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link to="/" style={{ color: '#8899cc', textDecoration: 'none', fontSize: 14 }}>Home</Link>
        <Link to="/scan" style={{ color: '#8899cc', textDecoration: 'none', fontSize: 14 }}>Scan</Link>

        {user ? (
          // Show these when LOGGED IN
          <>
            <Link to="/dashboard" style={{ color: '#8899cc', textDecoration: 'none', fontSize: 14 }}>
              Dashboard
            </Link>
            <span style={{ color: '#6677aa', fontSize: 13 }}>Hi, {user.name}!</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #ff4444',
                color: '#ff4444',
                padding: '7px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}>
              Logout
            </button>
          </>
        ) : (
          // Show these when NOT logged in
          <>
            <Link to="/login" style={{ color: '#8899cc', textDecoration: 'none', fontSize: 14 }}>Login</Link>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}