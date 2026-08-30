import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, CheckCircle2, Copy } from 'lucide-react';
import { murtiApi, bookingApi } from '../services/api';

export default function BookingPage({ murtiId, setActivePage, currentUser }) {
  const [murti, setMurti] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customer_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    event_date: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!murtiId) return;
    setLoading(true);
    murtiApi.getMurtiById(murtiId)
      .then((res) => setMurti(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [murtiId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await bookingApi.createBooking({
        murti_id: murtiId,
        ...formData
      });
      setBookingSuccess(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading booking details...</div>;
  }

  if (bookingSuccess) {
    return (
      <div className="section-padding" style={{ maxWidth: '650px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <div className="glass-card animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} color="#4ade80" style={{ margin: '0 auto 1.5rem auto' }} />
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Booking Request Received!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
            Thank you for booking <strong>{murti?.name}</strong>. Please save your reference code below to track your booking status.
          </p>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(243, 176, 54, 0.12)',
            borderRadius: '12px',
            border: '1px dashed var(--accent-gold)',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Booking Reference Code
            </span>
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--accent-gold)',
              letterSpacing: '0.08em',
              marginTop: '0.2rem'
            }}>
              {bookingSuccess.reference}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setActivePage('track')}
              className="btn-primary"
            >
              Track Booking Status
            </button>
            <button
              onClick={() => setActivePage('gallery')}
              className="btn-secondary"
            >
              Return to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => setActivePage('detail')}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
      >
        <ArrowLeft size={16} /> Back to Murti Details
      </button>

      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Book Sculpture: {murti?.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Submit your contact details and preferred event date. No advance payment required for reservation.
        </p>

        {errorMsg && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="form-input"
              placeholder="e.g. Ramesh More"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                placeholder="ramesh@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Preferred Festival / Event Date
            </label>
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Special Notes / Mandap Specifications
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="form-textarea"
              placeholder="Any specific delivery instructions or custom request details..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '1rem', fontSize: '1rem' }}
          >
            {submitting ? 'Submitting Booking Request...' : 'Confirm Booking Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
}
