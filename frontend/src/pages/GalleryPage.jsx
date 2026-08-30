import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { murtiApi } from '../services/api';
import MurtiCard from '../components/MurtiCard';

export default function GalleryPage({ setSelectedMurtiId, setBookingMurtiId, setActivePage }) {
  const [query, setQuery] = useState('');
  const [deity, setDeity] = useState('');
  const [material, setMaterial] = useState('');
  const [sort, setSort] = useState('relevance');

  const [murtis, setMurtis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiActive, setAiActive] = useState(false);

  const fetchMurtis = () => {
    setLoading(true);
    murtiApi.getMurtis({ q: query, deity, material, sort })
      .then((res) => {
        setMurtis(res.data.murtis || []);
        setAiActive(!!query.trim());
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMurtis();
  }, [deity, material, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMurtis();
  };

  return (
    <div className="section-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Murti Gallery & AI Search
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Search sculptures using natural language queries powered by <strong>scikit-learn TF-IDF & NLTK</strong> via Python microservice.
        </p>
      </div>

      {/* AI Search Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-card" style={{
        padding: '0.6rem 0.6rem 0.6rem 1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        borderRadius: '9999px',
        border: aiActive ? '1px solid rgba(192, 132, 252, 0.5)' : '1px solid var(--glass-border)',
        boxShadow: aiActive ? '0 0 20px rgba(192, 132, 252, 0.2)' : 'none'
      }}>
        <Sparkles size={20} color={aiActive ? '#c084fc' : 'var(--accent-gold)'} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try AI natural language search: "5 feet eco friendly Ganpati" or "seated Devi"'
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontFamily: 'var(--font-sans)'
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setTimeout(fetchMurtis, 50); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Clear
          </button>
        )}
        <button type="submit" className="btn-primary" style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem' }}>
          <Search size={16} /> AI Rank Search
        </button>
      </form>

      {/* Filter Controls */}
      <div className="glass-card" style={{
        padding: '1.2rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <Filter size={16} /> Filters:
          </div>

          <select
            value={deity}
            onChange={(e) => setDeity(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <option value="">All Deities</option>
            <option value="Ganpati">Ganpati</option>
            <option value="Devi">Devi</option>
          </select>

          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <option value="">All Materials (सर्व प्रकार)</option>
            <option value="Shadu Mati">शाडू माती (Shadu Mati)</option>
            <option value="Marble">मार्बल (Marble)</option>
            <option value="Fiber">फायबर (Fiber)</option>
            <option value="Plaster of Paris">पी. ओ. पी. (P.O.P.)</option>
            <option value="Eco-friendly clay">Eco-friendly clay</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <SlidersHorizontal size={16} /> Sort by:
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <option value="relevance">AI Relevance</option>
            <option value="newest">Newest First</option>
            <option value="height_asc">Height (Low to High)</option>
            <option value="height_desc">Height (High to Low)</option>
            <option value="availability">Availability</option>
          </select>
        </div>
      </div>

      {/* AI Search Badge Active Banner */}
      {aiActive && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1.2rem',
          borderRadius: '10px',
          background: 'rgba(192, 132, 252, 0.12)',
          border: '1px solid rgba(192, 132, 252, 0.3)',
          color: '#c084fc',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={16} /> AI Natural Language Query Active: <strong>"{query}"</strong>. Ranked by TF-IDF & Cosine Similarity.
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ marginBottom: '0.5rem' }} />
          <div>Searching sculptures with AI...</div>
        </div>
      ) : murtis.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No murtis found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Try refining your search terms or clearing filters.</p>
          <button onClick={() => { setQuery(''); setDeity(''); setMaterial(''); }} className="btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '1.5rem'
        }}>
          {murtis.map((m) => (
            <MurtiCard
              key={m.id}
              murti={m}
              onSelect={(id) => { setSelectedMurtiId(id); setActivePage('detail'); }}
              onBook={(id) => { setBookingMurtiId(id); setActivePage('book'); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
