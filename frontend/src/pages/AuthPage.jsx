import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, User, Phone, KeyRound } from 'lucide-react';
import { registerUser, loginUser, loginWithGoogle } from '../services/firebaseAuth';

export default function AuthPage({ onLoginSuccess, setActivePage }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [adminInviteCode, setAdminInviteCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      let user;
      if (mode === 'login') {
        user = await loginUser({ email, password });
        setInfoMsg('Successfully authenticated with Firebase Auth!');
      } else {
        user = await registerUser({
          email,
          password,
          fullName,
          phone,
          role,
          adminInviteCode
        });
        setInfoMsg('Account registered successfully!');
      }

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      if (user.role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('gallery');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const user = await loginWithGoogle();
      setInfoMsg('Successfully authenticated with Google!');
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      if (user.role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('gallery');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem' }}>

        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--accent-gradient)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <ShieldCheck size={30} />
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.3rem', fontWeight: 800 }}>
            {mode === 'login' ? 'Sign In to MurtiKala' : 'Create New Account'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Firebase Authentication & Role-Based Access (User & Admin)
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          padding: '0.3rem',
          borderRadius: '9999px',
          marginBottom: '1.8rem',
          border: '1px solid var(--glass-border)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg(''); }}
            style={{
              flex: 1,
              background: mode === 'login' ? 'var(--accent-gradient)' : 'none',
              color: mode === 'login' ? '#000' : 'var(--text-secondary)',
              fontWeight: 700,
              border: 'none',
              padding: '0.6rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setInfoMsg(''); }}
            style={{
              flex: 1,
              background: mode === 'register' ? 'var(--accent-gradient)' : 'none',
              color: mode === 'register' ? '#000' : 'var(--text-secondary)',
              fontWeight: 700,
              border: 'none',
              padding: '0.6rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Register Account
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            lineHeight: 1.4
          }}>
            {errorMsg}
            {mode === 'login' && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#fef08a' }}>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 700,
                    padding: 0
                  }}
                >
                  Click here to Register
                </button>
              </div>
            )}
          </div>
        )}

        {/* Info Notification */}
        {infoMsg && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '0.88rem'
          }}>
            {infoMsg}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>

          {/* Registration Extra Fields */}
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ramesh More"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@murtikala.local"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          {/* Registration Role & Contact Selection */}
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                >
                  <option value="user">User / Buyer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {role === 'admin' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Admin Invite Code *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      required
                      value={adminInviteCode}
                      onChange={(e) => setAdminInviteCode(e.target.value)}
                      placeholder="MURTIKALA_ADMIN_2026"
                      className="form-input"
                      style={{ paddingLeft: '2.5rem', borderColor: 'rgba(243, 176, 54, 0.5)' }}
                    />
                    <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>
                    Default invite code: <code>MURTIKALA_ADMIN_2026</code>
                  </span>
                </div>
              )}
            </>
          )}

          {/* Submit Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                'Sign In with Email'
              ) : (
                'Register Account'
              )}
            </button>

            {mode === 'login' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                  <span style={{ padding: '0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                </div>
                
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                  Sign In with Google
                </button>
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
