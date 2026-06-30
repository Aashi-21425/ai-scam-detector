// Navbar.jsx
// Shows at top of every page
// Has logo + navigation links

import { Link } from 'react-router-dom';

export default function Navbar() {
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
        <Link to="/login" style={{ color: '#8899cc', textDecoration: 'none', fontSize: 14 }}>Login</Link>
        <Link to="/register">
          <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
            Register
          </button>
        </Link>
      </div>
    </nav>
  );
}