// Login.jsx
// Existing user logs in here

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', color: '#a0c4ff', marginBottom: 8 }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#6677aa', fontSize: 13, marginBottom: 24 }}>
          Login to continue detecting scams
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, color: '#8899cc' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            style={inputStyle}
          />

          <label style={{ fontSize: 13, color: '#8899cc' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />

          {error && (
            <div style={{ background: '#2a0a0a', color: '#ff8888', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#6677aa', marginTop: 20 }}>
          Don't have an account? <Link to="/register" style={{ color: '#a0c4ff' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  marginTop: 6,
  marginBottom: 16,
  background: '#080818',
  border: '1px solid #1e1e4e',
  borderRadius: 8,
  color: '#e0e0f0',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};