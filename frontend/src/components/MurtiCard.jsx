import React from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

export default function MurtiCard({ murti, onSelect, onBook }) {
  const imageUrl = murti.primary_image
    ? (murti.primary_image.startsWith('http') || murti.primary_image.startsWith('data:') ? murti.primary_image : `/uploads/${murti.primary_image}`)
    : 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="glass-card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Similarity Score Badge if present */}
      {murti.similarity_score > 0 && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
          <span className="badge-ai">
            <Sparkles size={12} /> {Math.round(murti.similarity_score * 100)}% AI Match
          </span>
        </div>
      )}

      {/* Murti Image */}
      <div
        onClick={() => onSelect(murti.id)}
        style={{
          height: '240px',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          background: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        <img
          src={imageUrl}
          alt={murti.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(13, 14, 18, 0.9), transparent)'
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span className="badge-gold">{murti.deity}</span>
          <span className={`badge-status ${murti.availability}`}>
            {murti.availability}
          </span>
        </div>

        <h3
          onClick={() => onSelect(murti.id)}
          style={{
            fontSize: '1.25rem',
            color: '#78350f',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}
        >
          {murti.name}
        </h3>

        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '1rem',
          flex: 1
        }}>
          {murti.description}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          padding: '0.6rem 0.8rem',
          background: '#fff7ed',
          borderRadius: '10px',
          border: '1px solid rgba(217, 119, 6, 0.2)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem'
        }}>
          <div>Material: <strong style={{ color: '#78350f' }}>{murti.material}</strong></div>
          <div>Height: <strong style={{ color: '#78350f' }}>{murti.height_cm} cm</strong></div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <button
            onClick={() => onSelect(murti.id)}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem' }}
          >
            Details
          </button>

          {murti.availability === 'Available' ? (
            <button
              onClick={() => onBook(murti.id)}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem' }}
            >
              Book Murti <ArrowRight size={14} />
            </button>
          ) : (
            <button
              disabled
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed', padding: '0.6rem', fontSize: '0.85rem' }}
            >
              Booked
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
