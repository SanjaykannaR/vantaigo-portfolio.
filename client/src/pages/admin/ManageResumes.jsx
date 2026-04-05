import { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiFile, FiLinkedin, FiInstagram, FiGlobe, FiSearch, FiX } from 'react-icons/fi';

const EMPTY_FORM = {
  candidateName: '', role: '', company: '', location: '',
  contactNumber: '', email: '', linkedin: '', instagram: '',
  portfolioWebsite: '', notes: '', addedBy: 'admin',
};

const ManageResumes = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const load = async () => {
    try {
      const r = await adminAPI.getResumes();
      setItems(r.data);
      setFiltered(r.data);
    } catch { }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(items.filter(i =>
      i.candidateName.toLowerCase().includes(q) ||
      i.role.toLowerCase().includes(q) ||
      (i.company || '').toLowerCase().includes(q) ||
      (i.email || '').toLowerCase().includes(q)
    ));
  }, [search, items]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      candidateName: item.candidateName || '',
      role: item.role || '',
      company: item.company || '',
      location: item.location || '',
      contactNumber: item.contactNumber || '',
      email: item.email || '',
      linkedin: item.linkedin || '',
      instagram: item.instagram || '',
      portfolioWebsite: item.portfolioWebsite || '',
      notes: item.notes || '',
      addedBy: item.addedBy || 'admin',
    });
    setFile(null);
    setError('');
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      fileRef.current.value = '';
      return;
    }
    setFile(f);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('resumeFile', file);

      if (editing) await adminAPI.updateResume(editing, fd);
      else await adminAPI.createResume(fd);

      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteResume(deleteId);
      setDeleteId(null);
      load();
    } catch { }
  };

  const downloadFile = async (item) => {
    if (!item.resumeFile) return;
    const url = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://vantaigo-api.onrender.com'}${item.resumeFile}`;
    window.open(url, '_blank');
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatSize = (b) => b ? `${(b / 1024).toFixed(0)} KB` : '';

  return (
    <AdminLayout title="Resume Vault">
      <div className="admin-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by name, role, company, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')}><FiX /></button>}
          </div>
          <p style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {filtered.length} of {items.length} candidates
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Candidate</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Role</th>
              <th>Company</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Links</th>
              <th>File</th>
              <th>Added</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No candidates found</td></tr>
            )}
            {filtered.map(item => (
              <tr key={item._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.candidateName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.email}</div>
                </td>
                <td><span className="badge badge-primary">{item.role}</span></td>
                <td>{item.company || '—'}</td>
                <td>{item.location || '—'}</td>
                <td style={{ fontSize: '0.82rem' }}>{item.contactNumber || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {item.linkedin && <a href={item.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: '#0A66C2' }}><FiLinkedin /></a>}
                    {item.instagram && <a href={item.instagram} target="_blank" rel="noreferrer" title="Instagram" style={{ color: '#E1306C' }}><FiInstagram /></a>}
                    {item.portfolioWebsite && <a href={item.portfolioWebsite} target="_blank" rel="noreferrer" title="Portfolio" style={{ color: 'var(--primary)' }}><FiGlobe /></a>}
                    {!item.linkedin && !item.instagram && !item.portfolioWebsite && <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </div>
                </td>
                <td>
                  {item.resumeFile ? (
                    <button className="btn btn-sm btn-outline" onClick={() => downloadFile(item)} title={`${item.resumeFileOriginalName} (${formatSize(item.resumeFileSizeBytes)})`}>
                      <FiDownload /> <span style={{ fontSize: '0.75rem' }}>{formatSize(item.resumeFileSizeBytes)}</span>
                    </button>
                  ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</td>
                <td>
                  <span className={`badge ${item.addedBy === 'hrms' ? 'badge-warning' : 'badge-primary'}`}>
                    {item.addedBy === 'hrms' ? '🏢 HR' : '🔧 Admin'}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(item)}><FiEdit2 /></button>
                  <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(item._id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiFile /> {editing ? 'Edit Candidate' : 'Add Candidate to Vault'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Candidate Name *</label>
                  <input className="form-control" value={form.candidateName} onChange={e => setForm({ ...form, candidateName: e.target.value })} required placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label>Role / Position *</label>
                  <input className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required placeholder="e.g. React Developer" />
                </div>
                <div className="form-group">
                  <label>Company (Considered For)</label>
                  <input className="form-control" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. TCS, Infosys" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input className="form-control" type="tel" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="candidate@email.com" />
                </div>
                <div className="form-group">
                  <label><FiLinkedin style={{ verticalAlign: 'middle' }} /> LinkedIn URL</label>
                  <input className="form-control" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="form-group">
                  <label><FiInstagram style={{ verticalAlign: 'middle' }} /> Instagram URL</label>
                  <input className="form-control" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
                </div>
                <div className="form-group">
                  <label><FiGlobe style={{ verticalAlign: 'middle' }} /> Portfolio Website</label>
                  <input className="form-control" value={form.portfolioWebsite} onChange={e => setForm({ ...form, portfolioWebsite: e.target.value })} placeholder="https://yourportfolio.com" />
                </div>
                <div className="form-group">
                  <label>Resume File (PDF/DOC/DOCX — max 5MB)</label>
                  <input ref={fileRef} className="form-control" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  {editing && !file && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Leave blank to keep existing file</p>}
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Notes</label>
                <textarea className="form-control" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes about the candidate..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update Candidate' : 'Add to Vault')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h4>Delete Candidate?</h4>
            <p>This will permanently delete the candidate record and their resume file.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageResumes;
