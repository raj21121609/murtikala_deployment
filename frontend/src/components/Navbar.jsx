import React, { useState } from 'react';
import { Search, ShoppingBag, ShieldCheck, User, LogOut, Phone, Instagram, MapPin, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <button
        onClick={() => handleNavClick('gallery')}
        style={{
          background: activePage === 'gallery' ? '#fef3c7' : 'transparent',
          border: 'none',
          borderRadius: '9999px',
          padding: '0.45rem 0.9rem',
          color: activePage === 'gallery' ? '#ea580c' : 'var(--text-primary)',
          fontWeight: activePage === 'gallery' ? 700 : 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          width: '100%',
          justifyContent: 'flex-start'
        }}
      >
        <Search size={16} /> Gallery & AI Search
      </button>

      <button
        onClick={() => handleNavClick('track')}
        style={{
          background: activePage === 'track' ? '#fef3c7' : 'transparent',
          border: 'none',
          borderRadius: '9999px',
          padding: '0.45rem 0.9rem',
          color: activePage === 'track' ? '#ea580c' : 'var(--text-primary)',
          fontWeight: activePage === 'track' ? 700 : 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          width: '100%',
          justifyContent: 'flex-start'
        }}
      >
        <ShoppingBag size={16} /> Track Booking
      </button>

      {currentUser?.role === 'admin' && (
        <button
          onClick={() => handleNavClick('admin')}
          style={{
            background: '#ffedd5',
            border: '1px solid rgba(234, 88, 12, 0.4)',
            color: '#ea580c',
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            width: '100%',
            justifyContent: 'flex-start'
          }}
        >
          <ShieldCheck size={16} /> Admin Portal
        </button>
      )}

      {currentUser ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Hi, <strong>{currentUser.full_name || currentUser.email?.split('@')[0] || 'User'}</strong>
          </span>
          <button
            onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleNavClick('auth')}
          className="btn-primary"
          style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', width: 'max-content' }}
        >
          <User size={16} /> Account Sign In
        </button>
      )}
    </>
  );

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 252, 245, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '2px solid rgba(217, 119, 6, 0.2)',
      boxShadow: '0 4px 20px rgba(180, 83, 9, 0.08)'
    }}>
      {/* Top Spiritual Invocation & Contact Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #ea580c 0%, #d97706 50%, #dc2626 100%)',
        padding: '0.35rem 1.5rem',
        fontSize: '0.8rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#fef08a', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>॥ ॐ श्री गणेशाय नमः ॥</span>
          <span style={{ opacity: 0.8 }} className="hide-on-mobile">|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap' }}>
            <MapPin size={13} color="#fef08a" /> उच्छेळी (Uchheli)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 600, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
            <Phone size={13} /> 7276703163
          </span>
          <span style={{ opacity: 0.8 }}>|</span>
          <a
            href="https://www.instagram.com/gart.135/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            <Instagram size={13} /> gart.135
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
            border: '2px solid #fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: '0.95rem',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
            flexDirection: 'column',
            lineHeight: 1.1,
            flexShrink: 0
          }}>
            <span style={{ fontSize: '0.65rem', color: '#fef08a' }}>G.ART</span>
            <span>ॐ</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: 'clamp(1.1rem, 4vw, 1.55rem)',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                color: '#b91c1c',
                textShadow: '0 1px 2px rgba(185, 28, 28, 0.15)',
                margin: 0
              }}>
                श्री गणेश मूर्तिकला
              </h1>
              <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 800 }}>
                G.ART
              </span>
            </div>
            <span style={{ fontSize: 'clamp(0.6rem, 2vw, 0.75rem)', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>
              Shree Ganesh MurtiKala — Uchheli (उच्छेळी)
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="desktop-nav-links">
          {navLinks}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav Menu Dropdown */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav-menu">
            {navLinks}
          </nav>
        )}
      </div>
    </header>
  );
}
