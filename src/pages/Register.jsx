// Register.jsx
// New user creates an account here

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Simple password strength checker
  function getPasswordStrength(pwd) {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: 'Weak', color: '#ff4444' };
    if (pwd.length < 10) return { label: 'Medium', color: '#ff9900' };
    return { label: 'Strong', color: '#00cc55' };
  }

  const strength = getPasswordStrength(password);

  async function handleSubmit(e) {
    e.preventDefault(); // stops page from refreshing
    setError('');

    if (!name || !email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      login(data.user, data.token); // save user globally
      navigate('/dashboard'); // go to dashboard after register
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', color: '#a0c4ff', marginBottom: 8 }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: '#6677aa', fontSize: 13, marginBottom: 24 }}>
          Join ScamShield to start detecting scams
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label style={{ fontSize: 13, color: '#8899cc' }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Doe"
            style={inputStyle}
          />

          {/* Email */}
          <label style={{ fontSize: 13, color: '#8899cc' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            style={inputStyle}
          />

          {/* Password */}
          <label style={{ fontSize: 13, color: '#8899cc' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />

          {/* Password strength indicator */}
          {strength && (
            <div style={{ fontSize: 12, color: strength.color, marginTop: -8, marginBottom: 16 }}>
              Password strength: {strength.label}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{ background: '#2a0a0a', color: '#ff8888', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#6677aa', marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: '#a0c4ff' }}>Login</Link>
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