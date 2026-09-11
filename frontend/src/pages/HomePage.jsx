import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Phone, Instagram, MapPin, Award, Layers, CheckCircle } from 'lucide-react';
import { murtiApi } from '../services/api';
import MurtiCard from '../components/MurtiCard';

export default function HomePage({ setActivePage, setSelectedMurtiId, setBookingMurtiId }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    murtiApi.getMurtis({ sort: 'newest' })
      .then((res) => {
        setFeatured((res.data.murtis || []).slice(0, 3));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-padding" style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Main Banner matching Shree Ganesh MurtiKala Shop Style with Ganpati Background */}
      <section className="animate-fade-in hero-padding" style={{
        padding: '3.5rem 2rem',
        borderRadius: '24px',
        textAlign: 'center',
        background: `linear-gradient(rgba(255, 247, 237, 0.85), rgba(254, 243, 199, 0.92)), url('/ganpati-hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '3px solid rgba(217, 119, 6, 0.35)',
        marginBottom: '3rem',
        position: 'relative',
        boxShadow: '0 15px 45px rgba(217, 119, 6, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Glow Overlay */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '250px',
          height: '250px',
          background: 'rgba(251, 191, 36, 0.25)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        {/* Spiritual Invocation */}
        <div className="hero-marathi" style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#9f1239',
          marginBottom: '1rem',
          letterSpacing: '0.08em',
          textShadow: '0 1px 3px rgba(255,255,255,0.8)'
        }}>
          ॥ ॐ श्री गणेशाय नमः ॥
        </div>

        {/* G.ART Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.45rem 1.3rem',
          borderRadius: '9999px',
          background: '#ffffff',
          border: '1.5px solid rgba(234, 88, 12, 0.4)',
          color: '#ea580c',
          fontSize: '0.9rem',
          fontWeight: 800,
          marginBottom: '1.2rem',
          boxShadow: '0 4px 12px rgba(234, 88, 12, 0.15)'
        }}>
          <Sparkles size={16} color="#d97706" /> G.ART Sculpture Studio — उच्छेळी (Uchheli)
        </div>

        {/* Main Title */}
        <h1 className="hero-title" style={{
          fontSize: '3.6rem',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: '1rem',
          color: '#9f1239',
          textShadow: '0 2px 10px rgba(159, 18, 57, 0.2)'
        }}>
          श्री गणेश मूर्तिकला
        </h1>

        <div className="hero-subtitle" style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: '#ea580c',
          marginBottom: '1.8rem',
          letterSpacing: '0.05em'
        }}>
          उच्छेळी | Uchheli Handcrafted Sculpture Gallery
        </div>

        {/* Marathi Offerings Banner */}
        <div style={{
          maxWidth: '850px',
          margin: '0 auto 2.2rem auto',
          padding: '1.4rem 2rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '18px',
          border: '2px solid rgba(217, 119, 6, 0.3)',
          boxShadow: '0 8px 25px rgba(180, 83, 9, 0.12)'
        }}>
          <p style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: '#78350f',
            lineHeight: 1.6,
            marginBottom: '0.5rem'
          }}>
            "ऑर्डर प्रमाणे शाडू मातीच्या तसेच मार्बल, फायबर व पी. ओ. पी. च्या मूर्त्या बनवून मिळतील"
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Custom handcrafted sculptures made to order in <strong>Shadu Mati (Eco-Friendly Clay)</strong>, <strong>Marble</strong>, <strong>Fiber</strong>, and <strong>P.O.P. (Plaster of Paris)</strong>.
          </p>
        </div>

        {/* Master Sculptor Credit Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.8rem 1.8rem',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '1.1rem',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 25px rgba(234, 88, 12, 0.35)'
        }}>
          <Award size={24} color="#fef08a" />
          मूर्तीकार :- गणेश किसन आरेकर / चरित गणेश आरेकर
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePage('gallery')}
            className="btn-primary"
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
          >
            Explore Murti Gallery & AI Search <ArrowRight size={18} />
          </button>

          <button
            onClick={() => setActivePage('mybookings')}
            className="btn-secondary"
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
          >
            My Bookings & Orders
          </button>
        </div>
      </section>

      {/* Materials Offered Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem', color: '#78350f', fontWeight: 900 }}>
          Craftsmanship & Materials (मूर्ती प्रकार)
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem', fontWeight: 600 }}>
          Every murti is meticulously carved by master artisans गणेश आरेकर & चरित आरेकर
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '1.5rem'
        }}>
          <div className="glass-card" style={{ padding: '1.6rem', borderLeft: '5px solid #16a34a' }}>
            <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase' }}>Eco-Friendly</span>
            <h3 style={{ fontSize: '1.35rem', color: '#78350f', margin: '0.3rem 0', fontWeight: 800 }}>शाडू माती (Shadu Mati)</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              100% natural eco-friendly clay sculptures that dissolve easily during Visarjan, crafted with intricate detail.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.6rem', borderLeft: '5px solid #0284c7' }}>
            <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 800, textTransform: 'uppercase' }}>Premium Finish</span>
            <h3 style={{ fontSize: '1.35rem', color: '#78350f', margin: '0.3rem 0', fontWeight: 800 }}>मार्बल (Marble Finish)</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Smooth, polished marble-crafted murtis with glowing traditional hand-painted gold & crimson ornaments.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.6rem', borderLeft: '5px solid #9333ea' }}>
            <span style={{ fontSize: '0.8rem', color: '#7e22ce', fontWeight: 800, textTransform: 'uppercase' }}>Durable & Light</span>
            <h3 style={{ fontSize: '1.35rem', color: '#78350f', margin: '0.3rem 0', fontWeight: 800 }}>फायबर (Fiber Murti)</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Lightweight, highly resilient fiber sculptures built for long-lasting mandap worship and export.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.6rem', borderLeft: '5px solid #ea580c' }}>
            <span style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: 800, textTransform: 'uppercase' }}>Classic Tradition</span>
            <h3 style={{ fontSize: '1.35rem', color: '#78350f', margin: '0.3rem 0', fontWeight: 800 }}>पी. ओ. पी. (P.O.P.)</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Detailed Plaster of Paris traditional Ganesh and Devi murtis in various sizes and postures.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Murtis Gallery Preview */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', color: '#78350f', fontWeight: 900 }}>Featured Masterpieces</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>Recently added sculptures available for custom ordering</p>
          </div>
          <button
            onClick={() => setActivePage('gallery')}
            className="btn-secondary"
            style={{ fontSize: '0.88rem', padding: '0.55rem 1.2rem' }}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading sculptures...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '1.5rem'
          }}>
            {featured.map((m) => (
              <MurtiCard
                key={m.id}
                murti={m}
                onSelect={(id) => { setSelectedMurtiId(id); setActivePage('detail'); }}
                onBook={(id) => { setBookingMurtiId(id); setActivePage('book'); }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Contact & Social Bar matching shop banner */}
      <section className="glass-card" style={{
        padding: '2rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        border: '2px solid rgba(217, 119, 6, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', color: '#78350f', marginBottom: '0.3rem', fontWeight: 900 }}>
            Contact श्री गणेश मूर्तिकला (Shree Ganesh MurtiKala)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
            Location: उच्छेळी (Uchheli) | Order Custom Sculptures Direct from Artisans
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{
            padding: '0.8rem 1.2rem',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid rgba(217, 119, 6, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Phone size={20} color="#ea580c" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Mobile Numbers</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#78350f' }}>
                7276703163 / 8329377161 / 8421577161
              </div>
            </div>
          </div>

          <a
            href="https://www.instagram.com/gart.135/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.8rem 1.2rem',
              background: '#ffffff',
              borderRadius: '14px',
              border: '1.5px solid rgba(217, 119, 6, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <Instagram size={20} color="#e11d48" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Instagram ID</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#78350f' }}>
                gart.135
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
