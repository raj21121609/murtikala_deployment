import React, { useState, useEffect } from 'react';
import {
  ClipboardList, CheckCircle2, Clock, PackageCheck,
  Copy, Check, Search, CalendarDays, ShoppingBag,
  LogIn, XCircle, RefreshCw, Phone, MessageCircle,
  Sparkles, Layers, Ruler, Tag, AlertCircle, Info, ChevronRight
} from 'lucide-react';
import { bookingApi, murtiApi } from '../services/api';

// ─── Status Configurations ───────────────────────────────────────────────────
const STATUS_STAGES = {
  pending: {
    stage: 1,
    badgeText: 'Awaiting Artisan Approval',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    badgeBorder: 'rgba(217, 119, 6, 0.4)',
    explanation: 'Your booking request is received. The artisans (Ganesh & Charit Arekar) are reviewing workshop schedule.',
    icon: Clock
  },
  confirmed: {
    stage: 2,
    badgeText: 'Booking Approved & Reserved',
    badgeColor: '#15803d',
    badgeBg: '#dcfce7',
    badgeBorder: 'rgba(34, 197, 94, 0.4)',
    explanation: 'Sculpture is confirmed! Your murti will be prepared and reserved for your festival date.',
    icon: CheckCircle2
  },
  completed: {
    stage: 4,
    badgeText: 'Handed Over / Completed',
    badgeColor: '#0369a1',
    badgeBg: '#e0f2fe',
    badgeBorder: 'rgba(14, 165, 233, 0.4)',
    explanation: 'Sculpture has been delivered/collected. Wishing you and your family a blessed festival!',
    icon: PackageCheck
  },
  declined: {
    stage: 0,
    badgeText: 'Request Closed / Sold Out',
    badgeColor: '#b91c1c',
    badgeBg: '#fee2e2',
    badgeBorder: 'rgba(239, 68, 68, 0.4)',
    explanation: 'Unfortunately this sculpture is unavailable for the selected dates. Please explore alternative designs.',
    icon: XCircle
  }
};

function getStatusInfo(raw = '') {
  const key = raw.toLowerCase();
  return STATUS_STAGES[key] || STATUS_STAGES.pending;
}

// ─── Progress Tracking Bar Component ─────────────────────────────────────────
function OrderTrackingStepper({ status }) {
  const info = getStatusInfo(status);
  const currentStage = info.stage;

  if (status?.toLowerCase() === 'declined') {
    return (
      <div style={{
        marginTop: '1.25rem',
        padding: '0.85rem 1.2rem',
        borderRadius: '12px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#991b1b',
        fontSize: '0.85rem'
      }}>
        <XCircle size={18} color="#dc2626" />
        <span><strong>Status:</strong> This booking request was declined or cancelled. Contact workshop at <strong>7276703163</strong> for assistance.</span>
      </div>
    );
  }

  const steps = [
    { label: 'Request Placed', desc: 'Received online' },
    { label: 'Artisan Review', desc: 'Availability check' },
    { label: 'Sculpting & Painting', desc: 'Workshop finishing' },
    { label: 'Ready for Mandap', desc: 'Pickup / Handover' }
  ];

  return (
    <div style={{
      marginTop: '1.25rem',
      padding: '1.2rem 1.25rem',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)',
      borderRadius: '14px',
      border: '1px solid rgba(217, 119, 6, 0.22)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} color="#ea580c" />
          Live Booking Progress
        </div>
        <div style={{ fontSize: '0.8rem', color: '#78350f', fontWeight: 600 }}>
          {info.explanation}
        </div>
      </div>

      {/* Stepper Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        position: 'relative'
      }}>
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStage > stepNum || (currentStage === 4 && stepNum === 4);
          const isCurrent = currentStage === stepNum && currentStage !== 4;
          const isUpcoming = currentStage < stepNum;

          return (
            <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
              {/* Connector line */}
              {idx < 3 && (
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '50%',
                  right: '-50%',
                  height: '3px',
                  background: isDone ? '#22c55e' : (isCurrent ? '#f59e0b' : '#e5e7eb'),
                  zIndex: 1,
                  transition: 'background 0.3s ease'
                }} />
              )}

              {/* Step Icon Badge */}
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                margin: '0 auto 0.4rem',
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                background: isDone ? '#16a34a' : (isCurrent ? '#ea580c' : '#ffffff'),
                color: (isDone || isCurrent) ? '#ffffff' : '#9ca3af',
                border: isDone ? '2px solid #16a34a' : (isCurrent ? '2px solid #fbbf24' : '2px solid #d1d5db'),
                boxShadow: isCurrent ? '0 0 0 4px rgba(234, 88, 12, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {isDone ? <Check size={14} strokeWidth={3} /> : stepNum}
              </div>

              {/* Step Labels */}
              <div style={{
                fontSize: '0.78rem',
                fontWeight: isCurrent ? 800 : (isDone ? 700 : 500),
                color: isCurrent ? '#9a3412' : (isDone ? '#15803d' : '#6b7280'),
                lineHeight: 1.2
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '0.15rem' }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Luxury Booking Card ──────────────────────────────────────────────────────
function ClassicBookingCard({ booking, murtiData }) {
  const [copied, setCopied] = useState(false);
  const statusInfo = getStatusInfo(booking.status);
  const StatusIcon = statusInfo.icon;

  // Resolve best available data (from booking doc or murti cache)
  const murtiName = booking.murti_name && booking.murti_name !== 'Murti Sculpture'
    ? booking.murti_name
    : (murtiData?.name || 'Ganesh Murti Sculpture');

  const murtiImage = booking.primary_image || murtiData?.primary_image || (murtiData?.images && murtiData.images[0]) || null;
  const material = booking.material || murtiData?.material || 'Eco-friendly Shadu Mati';
  const height = booking.height_cm || murtiData?.height_cm || null;
  const deity = murtiData?.deity || 'Ganpati';

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.reference).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Namaskar Shree Ganesh MurtiKala! I am inquiring about my booking:\n• Reference Code: ${booking.reference}\n• Murti: ${murtiName}\n• Event Date: ${booking.event_date || 'N/A'}\n• Name: ${booking.customer_name}`
  );

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        background: '#ffffff',
        border: '1.5px solid rgba(217, 119, 6, 0.28)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px -8px rgba(180, 83, 9, 0.12)',
        marginBottom: '1.5rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* ── Header Strip ── */}
      <div style={{
        background: 'linear-gradient(90deg, #fff7ed 0%, #ffedd5 60%, #fef3c7 100%)',
        borderBottom: '1px solid rgba(217, 119, 6, 0.2)',
        padding: '0.9rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        {/* Left: Ref Code & Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9a3412', fontWeight: 800 }}>
              Order Code:
            </span>
            <span style={{
              fontFamily: 'monospace',
              fontWeight: 900,
              fontSize: '1.05rem',
              color: '#b45309',
              background: '#ffffff',
              border: '1px solid rgba(217, 119, 6, 0.35)',
              borderRadius: '6px',
              padding: '0.15rem 0.55rem',
              letterSpacing: '0.05em'
            }}>
              {booking.reference}
            </span>
            <button
              onClick={handleCopy}
              title="Copy Booking Code"
              style={{
                background: copied ? '#dcfce7' : '#ffffff',
                border: `1px solid ${copied ? '#86efac' : 'rgba(217, 119, 6, 0.3)'}`,
                borderRadius: '6px',
                padding: '0.2rem 0.6rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: copied ? '#15803d' : '#ea580c',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#78350f', fontWeight: 600 }}>
            Booked on: <strong>{formatDate(booking.createdAt)}</strong>
          </div>
        </div>

        {/* Right: Live Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: statusInfo.badgeBg,
          color: statusInfo.badgeColor,
          border: `1.5px solid ${statusInfo.badgeBorder}`,
          padding: '0.35rem 0.95rem',
          borderRadius: '9999px',
          fontWeight: 800,
          fontSize: '0.8rem',
          letterSpacing: '0.02em',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          <StatusIcon size={15} />
          {statusInfo.badgeText}
        </div>
      </div>

      {/* ── Card Main Body ── */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Sculpture Visuals & Handcraft Specs */}
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {/* Thumbnail */}
            <div style={{
              width: '105px',
              height: '115px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
              border: '2px solid #fbbf24',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(180, 83, 9, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {murtiImage ? (
                <img
                  src={murtiImage}
                  alt={murtiName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '0.5rem', color: '#b45309' }}>
                  <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>ॐ</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', marginTop: '0.2rem' }}>G.ART</div>
                  <div style={{ fontSize: '0.55rem', opacity: 0.8 }}>UCHHELI</div>
                </div>
              )}
            </div>

            {/* Title & Specs */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span className="badge-gold" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                  {deity} Sculpture
                </span>
                {height && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Ruler size={13} color="#ea580c" /> {height} cm
                  </span>
                )}
              </div>

              <h2 style={{
                fontSize: '1.28rem',
                fontWeight: 800,
                color: '#78350f',
                margin: '0 0 0.4rem 0',
                lineHeight: 1.2
              }}>
                {murtiName}
              </h2>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.6rem' }}>
                <Layers size={13} color="#ea580c" />
                <span>Crafted in: <strong>{material}</strong></span>
              </div>

              {/* Event Date Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 700
              }}>
                <CalendarDays size={14} color="#d97706" />
                Festival / Event Date: <strong>{formatDate(booking.event_date)}</strong>
              </div>
            </div>
          </div>

          {/* Customer & Mandap Details Box */}
          <div style={{
            background: '#fafaf9',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Reservation Patron Details
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {booking.customer_name || 'Customer'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              📱 {booking.phone} &nbsp;|&nbsp; ✉️ {booking.email}
            </div>

            {booking.message && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                background: '#fff7ed',
                borderLeft: '3px solid #ea580c',
                fontSize: '0.82rem',
                color: '#78350f'
              }}>
                <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#c2410c' }}>
                  Mandap / Custom Notes:
                </strong>
                "{booking.message}"
              </div>
            )}
          </div>
        </div>

        {/* ── Live Visual Progress Tracker ── */}
        <OrderTrackingStepper status={booking.status} />

        {/* ── Bottom Action Strip / Workshop Support ── */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Need any customizations or delivery assistance? Contact workshop artisans directly:
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a
              href="tel:7276703163"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1.5px solid rgba(217, 119, 6, 0.35)',
                color: '#78350f',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <Phone size={14} color="#ea580c" /> Call 7276703163
            </a>

            <a
              href={`https://wa.me/917276703163?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                background: '#22c55e',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
              }}
            >
              <MessageCircle size={14} /> WhatsApp Artisan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Metric Card ────────────────────────────────────────────────────────
function MetricCard({ title, count, subtitle, icon: Icon, color, bg }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid rgba(217, 119, 6, 0.2)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      boxShadow: '0 4px 20px -4px rgba(180, 83, 9, 0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: '1.1rem'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#78350f', lineHeight: 1 }}>{count}</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{title}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{subtitle}</div>
      </div>
    </div>
  );
}

// ─── Main MyBookingsPage ──────────────────────────────────────────────────────
export default function MyBookingsPage({ currentUser, setActivePage }) {
  const [bookings, setBookings] = useState([]);
  const [murtisMap, setMurtisMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    if (!currentUser?.email) return;
    setLoading(true);
    setError('');

    try {
      // Parallel fetch: user bookings & murti catalog for enrichment
      const [bookingsRes, murtisRes] = await Promise.all([
        bookingApi.getMyBookings(currentUser.email),
        murtiApi.getMurtis().catch(() => ({ data: { murtis: [] } }))
      ]);

      const map = {};
      if (murtisRes.data?.murtis) {
        murtisRes.data.murtis.forEach(m => {
          map[m.id] = m;
        });
      }
      setMurtisMap(map);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not fetch bookings. Please click Refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // ─── If not logged in ──────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div style={{ maxWidth: '580px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-card animate-fade-in" style={{
          padding: '3.5rem 2rem',
          background: '#ffffff',
          borderRadius: '20px',
          border: '2px solid rgba(217, 119, 6, 0.3)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LogIn size={30} color="#ea580c" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#78350f', fontWeight: 900, marginBottom: '0.6rem' }}>
            Customer Orders & Bookings
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Please sign in to your Shree Ganesh MurtiKala account to view all your sculpture reservations, tracking status, and artisan approvals.
          </p>
          <button
            onClick={() => setActivePage('auth')}
            className="btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem', justifyContent: 'center' }}
          >
            <LogIn size={18} /> Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // ─── Stat counts ───────────────────────────────────────────────────────────
  const total = bookings.length;
  const pending = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
  const confirmed = bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
  const completed = bookings.filter(b => b.status?.toLowerCase() === 'completed').length;

  // Filter & Search
  const filteredList = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status?.toLowerCase() === filter;
    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const murti = murtisMap[b.murti_id];
    const name = (b.murti_name || murti?.name || '').toLowerCase();
    const ref = (b.reference || '').toLowerCase();
    return name.includes(q) || ref.includes(q);
  });

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* ── Top Devotional Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)',
        border: '2px solid rgba(217, 119, 6, 0.3)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 25px -5px rgba(180, 83, 9, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              ॥ श्री गणेशाय नमः ॥ UCHHELI WORKSHOP COMMISSIONS
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#78350f', fontWeight: 900, margin: '0 0 0.35rem 0' }}>
              My Sculpture Bookings & Tracking
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              Logged in as <strong>{currentUser.full_name || currentUser.email?.split('@')[0]}</strong> ({currentUser.email})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={loadData}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
              disabled={loading}
            >
              <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh Status
            </button>
            <button
              onClick={() => setActivePage('gallery')}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
            >
              <ShoppingBag size={15} /> Book Another Murti
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      {!loading && total > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <MetricCard
            title="Total Bookings"
            count={total}
            subtitle="Sculpture orders placed"
            icon={ClipboardList}
            color="#ea580c"
            bg="#ffedd5"
          />
          <MetricCard
            title="Awaiting Approval"
            count={pending}
            subtitle="Artisans reviewing schedule"
            icon={Clock}
            color="#b45309"
            bg="#fef3c7"
          />
          <MetricCard
            title="Confirmed & Reserved"
            count={confirmed}
            subtitle="Ready for festival"
            icon={CheckCircle2}
            color="#15803d"
            bg="#dcfce7"
          />
        </div>
      )}

      {/* ── Filters & Search Bar ── */}
      {!loading && total > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1.5px solid rgba(217, 119, 6, 0.2)',
          paddingBottom: '1rem'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Orders', count: total },
              { key: 'pending', label: 'Pending Review', count: pending },
              { key: 'confirmed', label: 'Approved / Confirmed', count: confirmed },
              { key: 'completed', label: 'Completed', count: completed }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  background: filter === tab.key ? '#fff7ed' : 'transparent',
                  border: filter === tab.key ? '1.5px solid #ea580c' : '1.5px solid transparent',
                  borderRadius: '9999px',
                  color: filter === tab.key ? '#ea580c' : 'var(--text-secondary)',
                  fontWeight: filter === tab.key ? 800 : 600,
                  fontSize: '0.85rem',
                  padding: '0.45rem 1rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
                <span style={{
                  background: filter === tab.key ? '#ea580c' : '#e5e7eb',
                  color: filter === tab.key ? '#ffffff' : '#4b5563',
                  borderRadius: '9999px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '2.3rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                background: '#ffffff'
              }}
            />
          </div>
        </div>
      )}

      {/* ── Loading Spinner ── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={36} color="var(--accent-saffron)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#78350f' }}>Loading your sculpture bookings...</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Connecting to Uchheli workshop database</div>
        </div>
      )}

      {/* ── Error Notice ── */}
      {!loading && error && (
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '14px',
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          color: '#991b1b',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={22} color="#dc2626" />
          <div style={{ flex: 1 }}>{error}</div>
          <button onClick={loadData} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Try Again
          </button>
        </div>
      )}

      {/* ── Empty State: Zero Bookings ── */}
      {!loading && !error && total === 0 && (
        <div className="glass-card animate-fade-in" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '20px',
          border: '2px dashed rgba(217, 119, 6, 0.4)'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ea580c',
            fontSize: '1.8rem',
            fontWeight: 900
          }}>
            ॐ
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#78350f', fontWeight: 900, marginBottom: '0.5rem' }}>
            No Sculpture Bookings Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
            You haven't placed any murti reservations under <strong>{currentUser.email}</strong> yet. Browse our handcrafted catalog to reserve your idol for the upcoming festival.
          </p>
          <button
            onClick={() => setActivePage('gallery')}
            className="btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem', justifyContent: 'center' }}
          >
            <Search size={18} /> Explore Sculptures in Gallery
          </button>
        </div>
      )}

      {/* ── Filtered Search Results: Empty ── */}
      {!loading && !error && total > 0 && filteredList.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3.5rem 1.5rem',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid rgba(217, 119, 6, 0.2)',
          color: 'var(--text-secondary)'
        }}>
          <Info size={32} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#78350f' }}>No matching bookings</div>
          <div style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
            No bookings found matching filter "<strong>{filter}</strong>"{searchQuery ? ` and search "${searchQuery}"` : ''}.
          </div>
          <button
            onClick={() => { setFilter('all'); setSearchQuery(''); }}
            className="btn-secondary"
            style={{ marginTop: '1rem', fontSize: '0.82rem', padding: '0.45rem 1rem' }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ── List of Classic Cards ── */}
      {!loading && filteredList.length > 0 && (
        <div>
          {filteredList.map(b => (
            <ClassicBookingCard
              key={b.id}
              booking={b}
              murtiData={murtisMap[b.murti_id]}
            />
          ))}
        </div>
      )}

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
