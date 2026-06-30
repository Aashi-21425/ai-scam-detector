// Landing.jsx
// First page user sees
// Has hero section, features, how it works

import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>

      {/* ── Hero Section ── */}
      <section style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'linear-gradient(180deg, #0f0f2a 0%, #080818 100%)',
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🛡️</div>

        <h1 style={{
          fontSize: 42,
          fontWeight: 900,
          background: 'linear-gradient(90deg, #a0c4ff, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>
          Detect Scams Instantly with AI
        </h1>

        <p style={{ fontSize: 18, color: '#8899cc', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Paste any suspicious message, email, link or describe a phone call —
          our AI tells you if it's a scam in seconds!
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/scan">
            <button className="btn-primary">🔍 Scan Now — It's Free</button>
          </Link>
          <Link to="/register">
            <button style={{
              background: 'transparent',
              border: '1px solid #3a6cf4',
              color: '#a0c4ff',
              padding: '12px 28px',
              borderRadius: 8,
              fontSize: 15,
              cursor: 'pointer',
            }}>
              Create Account
            </button>
          </Link>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 48,
        padding: '40px 20px',
        background: '#0a0a1e',
      }}>
        {[
          { number: '10,000+', label: 'Scams Detected' },
          { number: '5,000+', label: 'Users Protected' },
          { number: '99%',    label: 'Accuracy Rate' },
          { number: '6',      label: 'Languages Supported' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#a0c4ff' }}>{stat.number}</div>
            <div style={{ fontSize: 13, color: '#6677aa', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: '60px 20px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, marginBottom: 40, color: '#a0c4ff' }}>
          Why Choose ScamShield?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: '🤖', title: 'AI Powered', desc: 'Claude AI + ML model work together to detect scams with 99% accuracy' },
            { icon: '🗣️', title: 'Voice Output', desc: 'Listen to scam explanation in your preferred Indian language' },
            { icon: '🌍', title: 'Multilingual', desc: 'Supports Hindi, English, Tamil, Telugu and more' },
            { icon: '📊', title: 'Risk Score', desc: 'Get exact risk percentage so you know how dangerous it is' },
            { icon: '⚡', title: 'Instant Results', desc: 'Get scam analysis in under 3 seconds' },
            { icon: '🔒', title: 'Secure', desc: 'Your data is private and protected with JWT authentication' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, marginBottom: 8, color: '#a0c4ff' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6677aa', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '60px 20px', background: '#0a0a1e' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, marginBottom: 40, color: '#a0c4ff' }}>
          How It Works
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, maxWidth: 800, margin: '0 auto' }}>
          {[
            { step: '1', icon: '📋', title: 'Paste Content', desc: 'Paste suspicious message, email or URL' },
            { step: '2', icon: '🤖', title: 'AI Analyzes', desc: 'Our AI scans for scam patterns instantly' },
            { step: '3', icon: '🛡️', title: 'Get Result', desc: 'See risk score and what to do next' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3a6cf4, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 18, fontWeight: 800, color: '#fff',
              }}>{s.step}</div>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, color: '#a0c4ff', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: '#6677aa' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ textAlign: 'center', padding: '24px', color: '#445', fontSize: 13 }}>
        🛡️ ScamShield — Protecting Indians from Scams
      </footer>

    </div>
  );
}