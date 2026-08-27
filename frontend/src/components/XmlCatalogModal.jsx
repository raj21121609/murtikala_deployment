import React, { useState } from 'react';
import { Download, Upload, FileCode, CheckCircle, AlertCircle, X } from 'lucide-react';
import { catalogApi } from '../services/api';

export default function XmlCatalogModal({ isOpen, onClose, onRefreshCatalog }) {
  const [xmlFile, setXmlFile] = useState(null);
  const [rawXmlText, setRawXmlText] = useState('');
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleExportXML = () => {
    window.open(catalogApi.exportXmlUrl, '_blank');
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setImporting(true);
    setMessage(null);

    try {
      let res;
      if (xmlFile) {
        const formData = new FormData();
        formData.append('xmlFile', xmlFile);
        res = await catalogApi.importXml(formData);
      } else if (rawXmlText.trim()) {
        res = await catalogApi.importXmlText(rawXmlText);
      } else {
        setMessage({ type: 'error', text: 'Please select an XML file or paste XML text to import.' });
        setImporting(false);
        return;
      }

      setMessage({ type: 'success', text: res.data.message || 'Catalog imported successfully!' });
      setXmlFile(null);
      setRawXmlText('');
      if (onRefreshCatalog) onRefreshCatalog();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to import XML catalog.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '650px',
        width: '100%',
        padding: '2rem',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(243, 176, 54, 0.15)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileCode size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>XML Murti Catalog Integration</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Export entire catalog to XML format or import murtis from external XML data.
            </p>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            border: `1px solid ${message.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* Export Section */}
        <div style={{
          padding: '1.25rem',
          background: 'rgba(15, 17, 26, 0.6)',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export Catalog (Admin → XML)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Download the current database catalog as a structured XML file (`murtikala_catalog.xml`).
          </p>
          <button
            type="button"
            onClick={handleExportXML}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
          >
            <Download size={16} /> Download Catalog XML
          </button>
        </div>

        {/* Import Section */}
        <form onSubmit={handleImportSubmit} style={{
          padding: '1.25rem',
          background: 'rgba(15, 17, 26, 0.6)',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)'
        }}>
          <h3 style={{ fontSize: '1.05rem', color: '#c084fc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} /> Import Catalog (XML → Database)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Select an XML file containing <code>&lt;murtikala_catalog&gt;</code> or paste valid XML code below.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Upload XML File:
            </label>
            <input
              type="file"
              accept=".xml,text/xml"
              onChange={(e) => setXmlFile(e.target.files[0] || null)}
              className="form-input"
              style={{ padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Or Paste Raw XML Code:
            </label>
            <textarea
              rows={4}
              value={rawXmlText}
              onChange={(e) => setRawXmlText(e.target.value)}
              placeholder="<murtikala_catalog><murtis><murti><name>...</name>...</murti></murtis></murtikala_catalog>"
              className="form-textarea"
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={importing}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.4)' }}
          >
            {importing ? 'Validating & Importing...' : 'Import Catalog from XML'}
          </button>
        </form>
      </div>
    </div>
  );
}
