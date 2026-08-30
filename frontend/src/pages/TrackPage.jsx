import React, { useState } from 'react';
import { Search, ShoppingBag, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { bookingApi } from '../services/api';

export default function TrackPage() {
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setBooking(null);

    try {
      const res = await bookingApi.trackBooking(reference, email);
      setBooking(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'No booking found matching those details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Track Booking Request
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Enter your 16-character reference code (e.g. `MK-A1B2C3D4`) and email address to inspect reservation status.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleTrackSubmit} className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Booking Reference Code *
            </label>
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="MK-A1B2C3D4"
              className="form-input"
              style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ramesh@example.com"
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
        >
          <Search size={18} /> {loading ? 'Searching Reference...' : 'Find Booking Details'}
        </button>
      </form>

      {/* Error display */}
      {errorMsg && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          border: '1px solid rgba(248, 113, 113, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.95rem'
        }}>
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      {/* Result Display */}
      {booking && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reference</span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--accent-gold)' }}>{booking.reference}</h2>
            </div>
            <span className={`badge-status ${booking.status}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              Status: {booking.status}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1.25rem',
            padding: '1.25rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sculpture Name</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{booking.murti_name}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer Name</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{booking.customer_name}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contact Info</span>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{booking.email} | {booking.phone}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Event Date</span>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{booking.event_date || 'Not specified'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
