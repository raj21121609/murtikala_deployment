import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, FileCode, Check, RefreshCw, Layers, Calendar, Image as ImageIcon } from 'lucide-react';
import { murtiApi, bookingApi } from '../services/api';
import XmlCatalogModal from '../components/XmlCatalogModal';

export default function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('murtis'); // 'murtis' | 'bookings' | 'add'
  const [murtis, setMurtis] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xmlModalOpen, setXmlModalOpen] = useState(false);

  // New Murti Form State
  const [newMurti, setNewMurti] = useState({
    name: '',
    deity: 'Ganpati',
    description: '',
    material: 'Eco-friendly clay',
    height_cm: '',
    width_cm: '',
    weight_kg: '',
    availability: 'Available'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [msg, setMsg] = useState(null);

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      murtiApi.getMurtis({ sort: 'newest' }),
      bookingApi.getAllBookings()
    ])
      .then(([murtisRes, bookingsRes]) => {
        setMurtis(murtisRes.data.murtis || []);
        setBookings(bookingsRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateMurti = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMsg(null);

    try {
      await murtiApi.createMurti(newMurti, selectedFiles);
      setMsg({ type: 'success', text: 'Murti added successfully to catalog!' });
      setNewMurti({
        name: '',
        deity: 'Ganpati',
        description: '',
        material: 'Eco-friendly clay',
        height_cm: '',
        width_cm: '',
        weight_kg: '',
        availability: 'Available'
      });
      setSelectedFiles([]);
      loadDashboardData();
      setActiveTab('murtis');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create murti.';
      setMsg({ type: 'error', text: errorMsg });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteMurti = async (id) => {
    if (!window.confirm('Are you sure you want to delete this murti?')) return;
    try {
      await murtiApi.deleteMurti(id);
      setMsg({ type: 'success', text: 'Murti deleted successfully.' });
      loadDashboardData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to delete murti.' });
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingApi.updateStatus(id, status);
      setMsg({ type: 'success', text: `Booking status updated to ${status}.` });
      loadDashboardData();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update booking status.' });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={26} color="var(--accent-gold)" />
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>Admin Portal</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage sculptures, customer booking requests, and XML catalog imports/exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setXmlModalOpen(true)}
            className="btn-secondary"
            style={{ color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.4)', fontSize: '0.85rem' }}
          >
            <FileCode size={16} /> XML Catalog Import/Export
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add New Murti
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {msg && (
        <div style={{
          padding: '0.8rem 1.2rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          background: msg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: msg.type === 'success' ? '#4ade80' : '#f87171',
          border: `1px solid ${msg.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
        }}>
          {msg.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: '1px solid var(--glass-border)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('murtis')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'murtis' ? '2px solid var(--accent-gold)' : 'none',
            color: activeTab === 'murtis' ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'murtis' ? 700 : 500,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Murti Catalog ({murtis.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'bookings' ? '2px solid var(--accent-gold)' : 'none',
            color: activeTab === 'bookings' ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'bookings' ? 700 : 500,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Customer Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('add')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'add' ? '2px solid var(--accent-gold)' : 'none',
            color: activeTab === 'add' ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'add' ? 700 : 500,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          + Create Sculpture Record
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading dashboard...</div>
      ) : activeTab === 'murtis' ? (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Deity</th>
                <th style={{ padding: '0.75rem' }}>Material</th>
                <th style={{ padding: '0.75rem' }}>Height</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {murtis.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '0.75rem' }}><span className="badge-gold">{m.deity}</span></td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{m.material}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{m.height_cm} cm</td>
                  <td style={{ padding: '0.75rem' }}><span className={`badge-status ${m.availability}`}>{m.availability}</span></td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteMurti(m.id)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.3rem' }}
                      title="Delete Murti"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'bookings' ? (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Ref Code</th>
                <th style={{ padding: '0.75rem' }}>Sculpture</th>
                <th style={{ padding: '0.75rem' }}>Customer</th>
                <th style={{ padding: '0.75rem' }}>Contact</th>
                <th style={{ padding: '0.75rem' }}>Event Date</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{b.reference}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{b.murti_name}</td>
                  <td style={{ padding: '0.75rem' }}>{b.customer_name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{b.email}<br/>{b.phone}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{b.event_date || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}><span className={`badge-status ${b.status}`}>{b.status}</span></td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <select
                      value={b.status}
                      onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                      className="form-select"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Declined">Declined</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Add Murti Form */
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Add New Murti Sculpture
          </h2>

          <form onSubmit={handleCreateMurti} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Sculpture Name *
              </label>
              <input
                type="text"
                required
                value={newMurti.name}
                onChange={(e) => setNewMurti({ ...newMurti, name: e.target.value })}
                placeholder="e.g. Rajmudra Ganpati"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Deity *
                </label>
                <select
                  value={newMurti.deity}
                  onChange={(e) => setNewMurti({ ...newMurti, deity: e.target.value })}
                  className="form-select"
                >
                  <option value="Ganpati">Ganpati</option>
                  <option value="Devi">Devi</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Material *
                </label>
                <input
                  type="text"
                  required
                  value={newMurti.material}
                  onChange={(e) => setNewMurti({ ...newMurti, material: e.target.value })}
                  placeholder="Eco-friendly clay / Shadu Mati"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Height (cm) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newMurti.height_cm}
                  onChange={(e) => setNewMurti({ ...newMurti, height_cm: e.target.value })}
                  placeholder="45"
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Width (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newMurti.width_cm}
                  onChange={(e) => setNewMurti({ ...newMurti, width_cm: e.target.value })}
                  placeholder="30"
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newMurti.weight_kg}
                  onChange={(e) => setNewMurti({ ...newMurti, weight_kg: e.target.value })}
                  placeholder="8.5"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Description *
              </label>
              <textarea
                rows={4}
                required
                value={newMurti.description}
                onChange={(e) => setNewMurti({ ...newMurti, description: e.target.value })}
                placeholder="Detailed handcrafted specifications, painting details, and features..."
                className="form-textarea"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Upload Sculpture Photos (Multer File Storage)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                className="form-input"
                style={{ padding: '0.5rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '1rem' }}
            >
              {formSubmitting ? 'Saving Murti...' : 'Save Murti to Catalog'}
            </button>
          </form>
        </div>
      )}

      {/* XML Modal */}
      <XmlCatalogModal
        isOpen={xmlModalOpen}
        onClose={() => setXmlModalOpen(false)}
        onRefreshCatalog={loadDashboardData}
      />
    </div>
  );
}