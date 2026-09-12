import React, { useState } from 'react';
import { Search, ShoppingBag, ShieldCheck, User, LogOut, Phone, Instagram, MapPin, Menu, X, ClipboardList } from 'lucide-react';

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
          whiteSpace: 'nowrap'
        }}
      >
        <Search size={16} /> Gallery & AI Search
      </button>

      <button
        onClick={() => handleNavClick('mybookings')}
        style={{
          background: activePage === 'mybookings' ? '#fef3c7' : 'transparent',
          border: 'none',
          borderRadius: '9999px',
          padding: '0.45rem 0.9rem',
          color: activePage === 'mybookings' ? '#ea580c' : 'var(--text-primary)',
          fontWeight: activePage === 'mybookings' ? 700 : 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
      >
        <ClipboardList size={16} /> My Bookings
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
            whiteSpace: 'nowrap'
          }}
        >
          <ShieldCheck size={16} /> Admin Portal
        </button>
      )}

      {currentUser ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'nowrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
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
          style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
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
      <div className="top-spiritual-bar">
        <div className="top-spiritual-container">
          <div className="topbar-mantra-group">
            <span className="topbar-mantra">॥ ॐ श्री गणेशाय नमः ॥</span>
            <span className="topbar-divider">•</span>
            <span className="topbar-location">
              <MapPin size={12} color="#fef08a" /> उच्छेळी (Uchheli)
            </span>
          </div>

          <div className="topbar-contact-group">
            <a
              href="tel:7276703163"
              className="topbar-contact-pill"
              title="Call Workshop"
            >
              <Phone size={12} /> 7276703163
            </a>
            <span className="topbar-divider">•</span>
            <a
              href="https://www.instagram.com/gart.135/"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar-contact-pill"
              title="Instagram @gart.135"
            >
              <Instagram size={12} /> gart.135
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0.75rem clamp(1rem, 3vw, 1.5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 1, minWidth: 0 }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '13px',
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
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', flexWrap: 'nowrap' }}>
              <h1 style={{
                fontSize: 'clamp(1.05rem, 2.2vw, 1.55rem)',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                color: '#b91c1c',
                textShadow: '0 1px 2px rgba(185, 28, 28, 0.15)',
                margin: 0,
                whiteSpace: 'nowrap'
              }}>
                श्री गणेश मूर्तिकला
              </h1>
              <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 800 }}>
                G.ART
              </span>
            </div>
            <span style={{ fontSize: 'clamp(0.58rem, 1.5vw, 0.75rem)', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
            padding: '0.4rem',
            cursor: 'pointer'
          }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
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
