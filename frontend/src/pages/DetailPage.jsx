import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, ArrowRight, ShieldCheck, Ruler, Weight } from 'lucide-react';
import { murtiApi } from '../services/api';

export default function DetailPage({ murtiId, setActivePage, setBookingMurtiId, currentUser }) {
  const [murti, setMurti] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (!murtiId) return;
    setLoading(true);
    murtiApi.getMurtiById(murtiId)
      .then((res) => {
        setMurti(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImg(res.data.images[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [murtiId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading sculpture details...</div>;
  }

  if (!murti) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center' }}>
        <h2>Murti not found</h2>
        <button onClick={() => setActivePage('gallery')} className="btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Gallery
        </button>
      </div>
    );
  }

  const mainImgUrl = selectedImg
    ? (selectedImg.startsWith('http') || selectedImg.startsWith('data:') ? selectedImg : `/uploads/${selectedImg}`)
    : 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="section-padding" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => setActivePage('gallery')}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
      >
        <ArrowLeft size={16} /> Back to Gallery
      </button>

      <div className="glass-card animate-fade-in" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '2.5rem',
        padding: '2.5rem'
      }}>
        {/* Left: Gallery Images */}
        <div>
          <div style={{
            height: '380px',
            borderRadius: '14px',
            overflow: 'hidden',
            marginBottom: '1rem',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--glass-border)'
          }}>
            <img
              src={mainImgUrl}
              alt={murti.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {murti.images && murti.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {murti.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImg === img ? '2px solid var(--accent-gold)' : '1px solid var(--glass-border)',
                    opacity: selectedImg === img ? 1 : 0.6
                  }}
                >
                  <img src={img.startsWith('http') || img.startsWith('data:') ? img : `/uploads/${img}`} alt={`${murti.name} – view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Booking action */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge-gold">{murti.deity}</span>
            {murti.available_quantity > 0 && (
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
                {murti.available_quantity} available in stock
              </span>
            )}
            <span className={`badge-status ${murti.available_quantity > 0 ? murti.availability : 'Unavailable'}`}>
              {murti.available_quantity > 0 ? murti.availability : 'Sold Out'}
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {murti.name}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            {murti.description}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem',
            padding: '1.2rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            marginBottom: '2rem'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Material</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{murti.material}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Height</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{murti.height_cm} cm</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Width</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{murti.width_cm ? `${murti.width_cm} cm` : 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weight</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{murti.weight_kg ? `${murti.weight_kg} kg` : 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock Available</span>
              <div style={{ fontWeight: 700, color: murti.available_quantity > 0 ? '#15803d' : '#b91c1c', fontSize: '1rem' }}>
                {murti.available_quantity !== undefined ? `${murti.available_quantity} / ${murti.total_quantity || 1}` : 'Available'}
              </div>
            </div>
          </div>

          {murti.availability === 'Available' && (murti.available_quantity === undefined || murti.available_quantity > 0) ? (
            currentUser ? (
              <button
                onClick={() => { setBookingMurtiId(murti.id); setActivePage('book'); }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem' }}
              >
                Book This Murti Now <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => { setBookingMurtiId(murti.id); setActivePage('auth'); }}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.9rem',
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #ea580c, #c2410c)'
                }}
              >
                Login to Book This Murti <ArrowRight size={18} />
              </button>
            )
          ) : (
            <button disabled className="btn-secondary" style={{ width: '100%', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed', padding: '0.9rem' }}>
              Currently Unavailable / Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
