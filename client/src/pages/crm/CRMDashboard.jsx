import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import CRMLayout from './CRMLayout';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiX } from 'react-icons/fi';

const STATUS_COLORS = {
  prospect: '#F5A623',
  active: '#3FB950',
  'on-hold': '#A371F7',
  closed: '#F85149',
};

const EMPTY_FORM = {
  companyName: '', about: '', officialWebsite: '', trackingLink: '', industry: '',
  contactEmail: '', contactPhone: '', status: 'prospect', notes: '',
};

const CRMDashboard = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const r = await adminAPI.getCRMClients();
      setClients(r.data);
    } catch { }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (client) => {
    setEditing(client._id);
    setForm({
      companyName: client.companyName || '',
      about: client.about || '',
      officialWebsite: client.officialWebsite || '',
      trackingLink: client.trackingLink || '',
      industry: client.industry || '',
      contactEmail: client.contactEmail || '',
      contactPhone: client.contactPhone || '',
      status: client.status || 'prospect',
      notes: client.notes || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editing) await adminAPI.updateCRMClient(editing, form);
      else await adminAPI.createCRMClient(form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving client');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteCRMClient(deleteId);
      setDeleteId(null);
      load();
    } catch { }
  };

  const filtered = clients
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c => !search || c.companyName.toLowerCase().includes(search.toLowerCase()) || (c.industry || '').toLowerCase().includes(search.toLowerCase()));

  const statuses = ['all', 'prospect', 'active', 'on-hold', 'closed'];
  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'all' ? clients.length : clients.filter(c => c.status === s).length;
    return acc;
  }, {});

  return (
    <CRMLayout title="Client Management">
      {/* Status Filter Bar */}
      <div className="crm-status-bar">
        {statuses.map(s => (
          <button
            key={s}
            className={`crm-status-btn ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
            style={filterStatus === s && s !== 'all' ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="crm-toolbar">
        <input
          className="crm-search"
          placeholder="Search companies, industries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="crm-btn crm-btn-primary" onClick={openAdd}><FiPlus /> Add Client</button>
      </div>

      {/* Clients Grid */}
      {filtered.length === 0 ? (
        <div className="crm-empty">No clients found. <button className="crm-link-btn" onClick={openAdd}>Add your first CRM client →</button></div>
      ) : (
        <div className="crm-cards-grid">
          {filtered.map(client => (
            <div key={client._id} className="crm-client-card glass-card">
              <div className="crm-card-top">
                <div>
                  <div className="crm-company-name">{client.companyName}</div>
                  {client.industry && <div className="crm-company-industry">{client.industry}</div>}
                </div>
                <span className="crm-status-badge" style={{ background: `${STATUS_COLORS[client.status]}20`, color: STATUS_COLORS[client.status] }}>
                  {client.status}
                </span>
              </div>

              {client.about && <p className="crm-card-about">{client.about.slice(0, 120)}{client.about.length > 120 ? '...' : ''}</p>}

              <div className="crm-card-stats">
                <div className="crm-card-stat">
                  <span>{client.requestedPositions?.length || 0}</span>
                  <label>Positions</label>
                </div>
                <div className="crm-card-stat">
                  <span>{client.files?.length || 0}</span>
                  <label>Files</label>
                </div>
                <div className="crm-card-stat">
                  <span>{client.feedback?.length || 0}</span>
                  <label>Feedback</label>
                </div>
              </div>

              {(client.contactEmail || client.contactPhone) && (
                <div className="crm-card-contact">
                  {client.contactEmail && <span>✉ {client.contactEmail}</span>}
                  {client.contactPhone && <span>📞 {client.contactPhone}</span>}
                </div>
              )}

              <div className="crm-card-actions">
                <Link to={`/crm/${client._id}`} className="crm-btn crm-btn-primary crm-btn-sm">
                  View Details →
                </Link>
                {client.officialWebsite && (
                  <a href={client.officialWebsite} target="_blank" rel="noreferrer" className="crm-btn crm-btn-outline crm-btn-sm">
                    <FiExternalLink />
                  </a>
                )}
                <button className="crm-btn crm-btn-outline crm-btn-sm" onClick={() => openEdit(client)}>
                  <FiEdit2 />
                </button>
                <button className="crm-btn crm-btn-danger crm-btn-sm" onClick={() => setDeleteId(client._id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="crm-modal" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>{editing ? 'Edit Client' : 'Add CRM Client'}</h3>
              <button className="crm-icon-btn" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            {error && <div className="crm-alert crm-alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="crm-form-grid">
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Company Name *</label>
                  <input className="crm-input" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required placeholder="e.g. TCS, Infosys, Wipro" />
                </div>
                <div className="crm-form-group">
                  <label>Industry</label>
                  <input className="crm-input" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} placeholder="e.g. IT, Finance, Healthcare" />
                </div>
                <div className="crm-form-group">
                  <label>Status</label>
                  <select className="crm-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Contact Email</label>
                  <input className="crm-input" type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="hr@company.com" />
                </div>
                <div className="crm-form-group">
                  <label>Contact Phone</label>
                  <input className="crm-input" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Official Website</label>
                  <input className="crm-input" value={form.officialWebsite} onChange={e => setForm({ ...form, officialWebsite: e.target.value })} placeholder="https://company.com" />
                </div>
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Tracker Link (Google Sheet / Excel Online)</label>
                  <input className="crm-input" value={form.trackingLink} onChange={e => setForm({ ...form, trackingLink: e.target.value })} placeholder="https://docs.google.com/spreadsheets/..." />
                </div>
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>About Company</label>
                  <textarea className="crm-input" rows={3} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} placeholder="Brief description of the company..." />
                </div>
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Internal Notes</label>
                  <textarea className="crm-input" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Internal notes (not visible to client)..." />
                </div>
              </div>
              <div className="crm-modal-actions">
                <button type="button" className="crm-btn crm-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="crm-btn crm-btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update Client' : 'Add Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="crm-modal-overlay">
          <div className="crm-modal" style={{ maxWidth: '380px' }}>
            <h4>Delete Client?</h4>
            <p style={{ color: 'var(--text-muted)', margin: '12px 0' }}>This will delete the client and all associated positions, feedback, and files permanently.</p>
            <div className="crm-modal-actions">
              <button className="crm-btn crm-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="crm-btn crm-btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  );
};

export default CRMDashboard;
