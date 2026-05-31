import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid credentials. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #060913;
          overflow: hidden;
          position: relative;
        }

        /* Animated mesh background */
        .mesh-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .mesh-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.55;
          animation: orbFloat 12s ease-in-out infinite;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #1a3cff 0%, #0b1a6b 60%, transparent 100%);
          top: -150px; left: -100px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #00d4ff 0%, #0050a0 60%, transparent 100%);
          bottom: -100px; right: -80px;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, #7c3aed 0%, #3b0764 60%, transparent 100%);
          top: 40%; left: 30%;
          animation-delay: -8s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.97); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 1;
        }

        /* Left panel — branding */
        .brand-panel {
          display: none;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          position: relative;
          z-index: 2;
        }
        @media (min-width: 1024px) {
          .brand-panel { display: flex; }
        }

        .brand-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: #fff;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
        }

        .brand-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0;
        }
        .brand-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(37,99,235,0.18);
          border: 1px solid rgba(37,99,235,0.35);
          color: #93c5fd;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 28px;
          width: fit-content;
        }
        .brand-tag::before {
          content: '';
          width: 6px; height: 6px;
          background: #3b82f6;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .brand-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          line-height: 1.05;
          color: #fff;
          margin-bottom: 20px;
          letter-spacing: -1.5px;
        }
        .brand-title-accent {
          background: linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-desc {
          color: rgba(255,255,255,0.5);
          font-size: 1.0rem;
          line-height: 1.7;
          max-width: 380px;
          font-weight: 300;
        }

        .stats-row {
          display: flex;
          gap: 32px;
          margin-top: 48px;
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.6rem;
          color: #fff;
          letter-spacing: -1px;
        }
        .stat-label {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.1);
          align-self: stretch;
        }

        .brand-footer {
          color: rgba(255,255,255,0.2);
          font-size: 0.78rem;
        }

        /* Right panel — form */
        .form-panel {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 32px 20px;
        }
        @media (min-width: 1024px) {
          .form-panel {
            width: 480px;
            min-width: 480px;
            padding: 48px 56px;
          }
        }

        .form-card {
          width: 100%;
          max-width: 420px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .form-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .form-eyebrow {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 10px;
        }

        .form-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 2rem;
          color: #fff;
          letter-spacing: -0.8px;
          margin-bottom: 8px;
        }

        .form-subtext {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin-bottom: 36px;
          font-weight: 300;
        }

        /* Glass card */
        .glass-form {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .field-group {
          margin-bottom: 20px;
        }
        .field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.04em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .field-wrap {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          font-size: 0.95rem;
          pointer-events: none;
          transition: color 0.2s;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 14px 13px 40px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(59,130,246,0.6);
          background: rgba(59,130,246,0.07);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .field-input:focus + .field-focus-ring,
        .field-wrap:focus-within .field-icon { color: #3b82f6; }

        .pwd-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 0.85rem;
          padding: 4px 6px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .pwd-toggle:hover {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 20px;
          color: #fca5a5;
          font-size: 0.875rem;
          animation: slideIn 0.3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.03em;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(37,99,235,0.4);
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(37,99,235,0.5);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-footer {
          text-align: center;
          margin-top: 24px;
          color: rgba(255,255,255,0.35);
          font-size: 0.875rem;
        }
        .form-footer a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .form-footer a:hover { color: #93c5fd; }

        /* Mobile brand strip */
        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          margin-bottom: 32px;
        }
        @media (min-width: 1024px) { .mobile-brand { display: none; } }
        .mobile-brand-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
        }
        .mobile-brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: #fff;
          letter-spacing: -0.3px;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: rgba(255,255,255,0.15);
          font-size: 0.75rem;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }
      `}</style>

      <div className='login-root'>
        {/* Animated Background */}
        <div className='mesh-bg'>
          <div className='mesh-orb orb-1' />
          <div className='mesh-orb orb-2' />
          <div className='mesh-orb orb-3' />
        </div>
        <div className='grid-overlay' />

        {/* Left Brand Panel */}
        <div className='brand-panel'>
          <div className='brand-logo'>
            <div className='brand-logo-icon'>📦</div>
            SupplyChain
          </div>

          <div className='brand-hero'>
            <div className='brand-tag'>Inventory Management System</div>
            <h1 className='brand-title'>
              Control your
              <br />
              <span className='brand-title-accent'>supply chain</span>
              <br />
              with precision.
            </h1>
            <p className='brand-desc'>
              Real-time inventory tracking, purchase order management, and
              supplier oversight — all in one intelligent platform.
            </p>
            <div className='stats-row'>
              <div className='stat-item'>
                <span className='stat-num'>99.9%</span>
                <span className='stat-label'>Uptime</span>
              </div>
              <div className='stat-divider' />
              <div className='stat-item'>
                <span className='stat-num'>Real-time</span>
                <span className='stat-label'>Stock Updates</span>
              </div>
              <div className='stat-divider' />
              <div className='stat-item'>
                <span className='stat-num'>3-tier</span>
                <span className='stat-label'>Role Access</span>
              </div>
            </div>
          </div>

          <div className='brand-footer'>
            © 2025 SupplyChain Tracker · All rights reserved
          </div>
        </div>

        {/* Right Form Panel */}
        <div className='form-panel'>
          <div className={`form-card ${mounted ? 'visible' : ''}`}>
            {/* Mobile brand */}
            <div className='mobile-brand'>
              <div className='mobile-brand-icon'>📦</div>
              <span className='mobile-brand-name'>SupplyChain</span>
            </div>

            <div className='form-eyebrow'>Welcome back</div>
            <h2 className='form-heading'>Sign in to your account</h2>
            <p className='form-subtext'>
              Enter your credentials to access the dashboard
            </p>

            <div className='glass-form'>
              {error && (
                <div className='error-box'>
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='field-group'>
                  <label className='field-label'>Email Address</label>
                  <div className='field-wrap'>
                    <span className='field-icon'>✉</span>
                    <input
                      type='email'
                      placeholder='you@company.com'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className='field-input'
                      required
                      autoComplete='email'
                    />
                  </div>
                </div>

                <div className='field-group'>
                  <label className='field-label'>Password</label>
                  <div className='field-wrap'>
                    <span className='field-icon'>🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className='field-input'
                      required
                      autoComplete='current-password'
                    />
                    <button
                      type='button'
                      className='pwd-toggle'
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <button
                  type='submit'
                  className='submit-btn'
                  disabled={isLoading}
                >
                  <div className='btn-inner'>
                    {isLoading ? (
                      <>
                        <div className='spinner' />
                        Signing in…
                      </>
                    ) : (
                      <>Sign In →</>
                    )}
                  </div>
                </button>
              </form>
            </div>

            <div className='divider'>or</div>

            <p className='form-footer'>
              Don't have an account? <Link to='/register'>Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
