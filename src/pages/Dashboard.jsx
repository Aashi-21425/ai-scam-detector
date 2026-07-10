// Dashboard.jsx
// First page user sees after login
// Shows welcome message, stats, quick scan button
// Dashboard.jsx - Updated with charts and real data
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getScanHistory } from '../utils/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0,
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await getScanHistory(user?.id);
      const data = res.data.scans || [];
      setScans(data);
      setStats({
        totalScans: data.length,
        highRisk: data.filter(s => s.riskLevel === 'HIGH').length,
        mediumRisk: data.filter(s => s.riskLevel === 'MEDIUM').length,
        lowRisk: data.filter(s => s.riskLevel === 'LOW').length,
      });
    } catch (err) {
      console.error('Failed to fetch data');
    }
    setLoading(false);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!user) return null;

  const total = stats.totalScans || 1;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

      {/* Welcome */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#a0c4ff', fontSize: 24 }}>
            👋 Welcome back, {user.name}!
          </h2>
          <p style={{ margin: '6px 0 0', color: '#6677aa', fontSize: 14 }}>
            Stay safe online — scan any suspicious content below
          </p>
        </div>
        <button onClick={handleLogout} style={{
          background: 'transparent', border: '1px solid #ff4444',
          color: '#ff4444', padding: '8px 20px', borderRadius: 8,
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>Logout</button>
      </div>

      {/* Stats Cards */}
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

      {/* Simple Chart — Risk Distribution */}
      {stats.totalScans > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', color: '#a0c4ff', fontSize: 15 }}>📊 Risk Distribution</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#ff4444', width: 80 }}>🚨 High</span>
            <div style={{ flex: 1, background: '#1a1a3e', borderRadius: 20, height: 20, overflow: 'hidden' }}>
              <div style={{ width: `${(stats.highRisk / total) * 100}%`, background: '#ff4444', height: '100%', borderRadius: 20, transition: 'width 1s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#ff4444', width: 30 }}>{stats.highRisk}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#ff9900', width: 80 }}>⚠️ Medium</span>
            <div style={{ flex: 1, background: '#1a1a3e', borderRadius: 20, height: 20, overflow: 'hidden' }}>
              <div style={{ width: `${(stats.mediumRisk / total) * 100}%`, background: '#ff9900', height: '100%', borderRadius: 20, transition: 'width 1s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#ff9900', width: 30 }}>{stats.mediumRisk}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#00cc55', width: 80 }}>✅ Low</span>
            <div style={{ flex: 1, background: '#1a1a3e', borderRadius: 20, height: 20, overflow: 'hidden' }}>
              <div style={{ width: `${(stats.lowRisk / total) * 100}%`, background: '#00cc55', height: '100%', borderRadius: 20, transition: 'width 1s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#00cc55', width: 30 }}>{stats.lowRisk}</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: '#a0c4ff' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/scan">
            <button className="btn-primary">🔍 Scan Now</button>
          </Link>
          <Link to="/history">
            <button style={{
              background: 'transparent', border: '1px solid #3a6cf4',
              color: '#a0c4ff', padding: '12px 28px', borderRadius: 8,
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}>📋 View History</button>
          </Link>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="card">
        <h3 style={{ margin: '0 0 16px', color: '#a0c4ff' }}>🕐 Recent Scans</h3>
        {loading ? (
          <p style={{ color: '#6677aa' }}>Loading...</p>
        ) : scans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#6677aa' }}>
            <p>No scans yet!</p>
            <Link to="/scan">
              <button className="btn-primary" style={{ marginTop: 10 }}>Start Scanning</button>
            </Link>
          </div>
        ) : (
          scans.slice(0, 5).map((scan, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: i < 4 ? '1px solid #1e1e4e' : 'none',
            }}>
              <div>
                <span style={{ fontSize: 12, color: '#a0c4ff' }}>{scan.type?.toUpperCase()}</span>
                <span style={{ fontSize: 12, color: '#6677aa', marginLeft: 8 }}>{scan.scamCategory}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 20,
                  background: scan.riskLevel === 'HIGH' ? '#ff4444' : scan.riskLevel === 'MEDIUM' ? '#ff9900' : '#00cc55',
                  color: '#fff', fontWeight: 700,
                }}>{scan.riskLevel}</span>
                <span style={{ fontSize: 11, color: '#445' }}>
                  {new Date(scan.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}