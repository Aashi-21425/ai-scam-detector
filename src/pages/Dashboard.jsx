// Dashboard.jsx
// First page user sees after login
// Shows welcome message, stats, quick scan button

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalScans: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
  });

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

      {/* ── Welcome Section ── */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#a0c4ff', fontSize: 24 }}>
            👋 Welcome back, {user.name}!
          </h2>
          <p style={{ margin: '6px 0 0', color: '#6677aa', fontSize: 14 }}>
            Stay safe online — scan any suspicious content below
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #ff4444',
            color: '#ff4444',
            padding: '8px 20px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}>
          Logout
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Scans', value: stats.totalScans, color: '#a0c4ff', icon: '🔍' },
          { label: 'High Risk', value: stats.highRisk, color: '#ff4444', icon: '🚨' },
          { label: 'Medium Risk', value: stats.mediumRisk, color: '#ff9900', icon: '⚠️' },
          { label: 'Low Risk', value: stats.lowRisk, color: '#00cc55', icon: '✅' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#6677aa', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: '#a0c4ff' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/scan">
            <button className="btn-primary">🔍 Scan Now</button>
          </Link>
          <Link to="/history">
            <button style={{
              background: 'transparent',
              border: '1px solid #3a6cf4',
              color: '#a0c4ff',
              padding: '12px 28px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}>
              📋 View History
            </button>
          </Link>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="card">
        <h3 style={{ margin: '0 0 16px', color: '#a0c4ff' }}>Recent Scans</h3>
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#6677aa' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ margin: 0 }}>No scans yet — start scanning to see results here!</p>
          <Link to="/scan">
            <button className="btn-primary" style={{ marginTop: 16 }}>
              Start Your First Scan
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}