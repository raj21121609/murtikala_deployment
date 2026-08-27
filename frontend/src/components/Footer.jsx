import React from 'react';
import { Phone, Instagram, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '2px solid rgba(217, 119, 6, 0.35)',
      background: '#fff7ed',
      padding: '3rem 1.5rem 1.5rem 1.5rem',
      marginTop: '4rem',
      boxShadow: '0 -4px 20px rgba(180, 83, 9, 0.05)'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              color: '#fef08a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.95rem'
            }}>
              ॐ
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#b91c1c', fontWeight: 900 }}>
              श्री गणेश मूर्तिकला
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1rem', fontWeight: 600 }}>
            ऑर्डर प्रमाणे शाडू मातीच्या तसेच मार्बल, फायबर व पी. ओ. पी. च्या मूर्त्या बनवून मिळतील.
          </p>
          <div style={{ fontSize: '0.88rem', color: '#78350f', fontWeight: 700 }}>
            मूर्तीकार: <strong>गणेश किसन आरेकर / चरित गणेश आरेकर</strong>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#78350f', marginBottom: '0.8rem', fontSize: '1.05rem', fontWeight: 800 }}>Contact & Location</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '2', fontWeight: 600 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={15} color="#ea580c" /> उच्छेळी (Uchheli)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="#ea580c" /> 7276703163 / 8329377161
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="#ea580c" /> 8421577161
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <a
                href="https://www.instagram.com/gart.135/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}
              >
                <Instagram size={15} color="#e11d48" /> Id - gart.135
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#78350f', marginBottom: '0.8rem', fontSize: '1.05rem', fontWeight: 800 }}>Materials Offered</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '2', fontWeight: 600 }}>
            <li>• शाडू माती (Shadu Mati - Eco Friendly)</li>
            <li>• मार्बल (Marble Finish)</li>
            <li>• फायबर (Fiber Sculptures)</li>
            <li>• पी. ओ. पी. (Plaster of Paris)</li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(217, 119, 6, 0.2)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.88rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem'
      }}>
        श्री गणेश मूर्तिकला — Uchheli © 2026. Powered by React, Node.js REST API & Python AI Service.
      </div>
    </footer>
  );
}
