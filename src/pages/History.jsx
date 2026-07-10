// History.jsx
// Shows all past scans of logged in user

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getScanHistory } from '../utils/api';

const RISK_COLORS = {
  HIGH:   { color: '#ff4444', bg: '#2a0a0a' },
  MEDIUM: { color: '#ff9900', bg: '#2a1a00' },
  LOW:    { color: '#00cc55', bg: '#0a2a14' },
};

export default function History() {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await getScanHistory();
      setScans(res.data.scans || []);
    } catch (err) {
      console.error('Failed to fetch history');
    }
    setLoading(false);
  }

  // Filter scans
  const filtered = scans.filter(scan => {
    const matchFilter = filter === 'ALL' || scan.riskLevel === filter;
    const matchSearch = scan.scamCategory?.toLowerCase().includes(search.toLowerCase()) ||
                       scan.type?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <h2 style={{ color: '#a0c4ff', marginBottom: 24, fontSize: 24 }}>📋 Scan History</h2>

      {/* ── Filter + Search ── */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by type or category..."
          style={{
            flex: 1, padding: '9px 14px', background: '#080818',
            border: '1px solid #1e1e4e', borderRadius: 8, color: '#dde',
            fontSize: 13, outline: 'none', minWidth: 200,
          }}
        />

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: 8, border: 'none',
                cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: filter === f ? '#3a6cf4' : '#1a1a3e',
                color: filter === f ? '#fff' : '#8899cc',
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#6677aa' }}>
          Loading your scan history...
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ color: '#6677aa', margin: '0 0 16px' }}>No scans found!</p>
          <Link to="/scan">
            <button className="btn-primary">Start Scanning</button>
          </Link>
        </div>
      )}

      {/* ── Scan List ── */}
      {!loading && filtered.map((scan, i) => {
        const risk = RISK_COLORS[scan.riskLevel] || RISK_COLORS.LOW;
        return (
          <div key={scan._id || i} className="card" style={{
            marginBottom: 12, display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `4px solid ${risk.color}`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <span style={{
                  fontSize: 11, padding: '2px 10px', borderRadius: 20,
                  background: risk.color, color: '#fff', fontWeight: 700,
                }}>
                  {scan.riskLevel}
                </span>
                <span style={{ fontSize: 12, color: '#6677aa' }}>
                  {scan.type?.toUpperCase()} • {scan.scamCategory}
                </span>
                <span style={{ fontSize: 11, color: '#445' }}>
                  {new Date(scan.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#bbc', lineHeight: 1.5 }}>
                {scan.summary || 'No summary available'}
              </p>
            </div>

            {/* Score */}
            <div style={{ textAlign: 'center', marginLeft: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: risk.color }}>
                {scan.scamScore}%
              </div>
              <div style={{ fontSize: 10, color: '#6677aa' }}>Risk Score</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}