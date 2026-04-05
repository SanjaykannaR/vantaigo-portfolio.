import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import CRMLayout from './CRMLayout';
import {
  FiArrowLeft, FiEdit2, FiPlus, FiTrash2, FiDownload,
  FiUpload, FiStar, FiX, FiExternalLink, FiFile, FiMessageSquare
} from 'react-icons/fi';

const STATUS_COLORS = { prospect: '#F5A623', active: '#3FB950', 'on-hold': '#A371F7', closed: '#F85149' };

const CRMClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Position modal state
  const [showPosModal, setShowPosModal] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [posForm, setPosForm] = useState({ title: '', count: 1, description: '', isPending: true, revenue: 0 });

  // Software Project modal state
  const [showSwModal, setShowSwModal] = useState(false);
  const [editingSw, setEditingSw] = useState(null);
  const [swForm, setSwForm] = useState({ title: '', description: '', status: 'pending', revenue: 0 });

  // Feedback modal state
  const [showFbModal, setShowFbModal] = useState(false);
  const [fbForm, setFbForm] = useState({ text: '', rating: 5, source: '' });

  // File upload
  const fileRef = useRef();
  const [uploadLoading, setUploadLoading] = useState(false);

  // Edit client modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const flash = (msg, isErr = false) => {
    if (isErr) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 4000);
  };

  const load = useCallback(async () => {
    try {
      const r = await adminAPI.getCRMClient(id);
      setClient(r.data);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setError('Failed to load client data');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // ─── Edit Client ─────────────────────────────────────
  const openEdit = () => {
    setEditForm({
      companyName: client.companyName, about: client.about, officialWebsite: client.officialWebsite,
      industry: client.industry, contactEmail: client.contactEmail, contactPhone: client.contactPhone,
      status: client.status, notes: client.notes,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateCRMClient(id, editForm);
      setShowEditModal(false);
      load();
      flash('Client updated!');
    } catch (err) { flash(err.response?.data?.message || 'Error updating client', true); }
  };

  // ─── Positions ────────────────────────────────────────
  const openAddPos = () => { setEditingPos(null); setPosForm({ title: '', count: 1, description: '', isPending: true, revenue: 0 }); setShowPosModal(true); };
  const openEditPos = (pos) => { setEditingPos(pos._id); setPosForm({ title: pos.title, count: pos.count, description: pos.description || '', isPending: pos.isPending, revenue: pos.revenue || 0 }); setShowPosModal(true); };

  const handlePosSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPos) await adminAPI.updateCRMPosition(id, editingPos, posForm);
      else await adminAPI.addCRMPosition(id, posForm);
      setShowPosModal(false);
      load();
    } catch { flash('Error saving position', true); }
  };

  const deletePos = async (posId) => {
    if (!window.confirm('Delete this position?')) return;
    // eslint-disable-next-line no-unused-vars
    try { await adminAPI.deleteCRMPosition(id, posId); load(); } catch (e) { flash('Error deleting position', true); }
  };

  // ─── Software Projects ────────────────────────────────
  const openAddSw = () => { setEditingSw(null); setSwForm({ title: '', description: '', status: 'pending', revenue: 0 }); setShowSwModal(true); };
  const openEditSw = (sw) => { setEditingSw(sw._id); setSwForm({ title: sw.title, description: sw.description || '', status: sw.status, revenue: sw.revenue || 0 }); setShowSwModal(true); };

  const handleSwSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSw) await adminAPI.updateCRMSoftwareProject(id, editingSw, swForm);
      else await adminAPI.addCRMSoftwareProject(id, swForm);
      setShowSwModal(false);
      load();
    } catch { flash('Error saving software project', true); }
  };

  const deleteSw = async (swId) => {
    if (!window.confirm('Delete this project?')) return;
    // eslint-disable-next-line no-unused-vars
    try { await adminAPI.deleteCRMSoftwareProject(id, swId); load(); } catch (e) { flash('Error deleting project', true); }
  };

  // ─── Files ────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { flash('File too large (max 10MB)', true); return; }
    setUploadLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await adminAPI.uploadCRMFile(id, fd);
      load();
      flash('File uploaded securely!');
      if (fileRef.current) fileRef.current.value = '';
    } catch { flash('Error uploading file', true); }
    setUploadLoading(false);
  };

  const downloadFile = async (fileId, originalName) => {
    try {
      const resp = await adminAPI.downloadCRMFile(id, fileId);
      const url = URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement('a');
      a.href = url; a.download = originalName; a.click();
      URL.revokeObjectURL(url);
    } catch { flash('Error downloading file', true); }
  };

  const deleteFile = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;
    // eslint-disable-next-line no-unused-vars
    try { await adminAPI.deleteCRMFile(id, fileId); load(); flash('File deleted'); } catch (e) { flash('Error deleting file', true); }
  };

  // ─── Feedback ─────────────────────────────────────────
  const handleFbSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addCRMFeedback(id, fbForm);
      setShowFbModal(false);
      setFbForm({ text: '', rating: 5, source: '' });
      load();
      flash('Feedback added!');
    } catch { flash('Error adding feedback', true); }
  };

  const deleteFb = async (fbId) => {
    if (!window.confirm('Delete this feedback?')) return;
    // eslint-disable-next-line no-unused-vars
    try { await adminAPI.deleteCRMFeedback(id, fbId); load(); } catch (e) { flash('Error deleting feedback', true); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const formatSize = (b) => b ? (b > 1024 * 1024 ? `${(b / (1024 * 1024)).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`) : '';

  if (loading) return <CRMLayout title="Loading..."><div className="crm-loading">Loading client...</div></CRMLayout>;
  if (!client) return <CRMLayout title="Not Found"><div className="crm-empty">Client not found.</div></CRMLayout>;

  return (
    <CRMLayout title={client.companyName}>
      {error && <div className="crm-alert crm-alert-error">{error}</div>}
      {success && <div className="crm-alert crm-alert-success">{success}</div>}

      {/* Back + Actions */}
      <div className="crm-detail-topbar">
        <Link to="/crm" className="crm-btn crm-btn-outline crm-btn-sm"><FiArrowLeft /> Back</Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="crm-status-badge" style={{ background: `${STATUS_COLORS[client.status]}20`, color: STATUS_COLORS[client.status] }}>
            {client.status}
          </span>
          <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={openEdit}><FiEdit2 /> Edit</button>
        </div>
      </div>

      {/* Company Info */}
      <div className="crm-detail-grid">
        <div className="crm-detail-main">

          {/* Company Overview */}
          <section className="crm-section glass-card">
            <div className="crm-section-header">
              <h3>Company Overview</h3>
            </div>
            <div className="crm-info-grid">
              <div><label>Industry</label><span>{client.industry || '—'}</span></div>
              <div><label>Email</label><span>{client.contactEmail || '—'}</span></div>
              <div><label>Phone</label><span>{client.contactPhone || '—'}</span></div>
              {client.officialWebsite && (
                <div><label>Website</label>
                  <a href={client.officialWebsite} target="_blank" rel="noreferrer" className="crm-link">
                    {client.officialWebsite} <FiExternalLink />
                  </a>
                </div>
              )}
            </div>
            {client.about && <p className="crm-about-text">{client.about}</p>}
            {client.notes && (
              <div className="crm-notes-box">
                <strong>Internal Notes:</strong>
                <p>{client.notes}</p>
              </div>
            )}
          </section>

          {/* Requested Positions */}
          <section className="crm-section glass-card">
            <div className="crm-section-header">
              <h3>Requested Positions ({client.requestedPositions?.length || 0})</h3>
              <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={openAddPos}><FiPlus /> Add Position</button>
            </div>
            {client.requestedPositions?.length === 0 ? (
              <div className="crm-empty-inline">No positions added yet.</div>
            ) : (
              <div className="crm-positions-list">
                {client.requestedPositions.map(pos => (
                  <div key={pos._id} className="crm-position-item">
                    <div className="crm-position-info">
                      <div className="crm-position-title">
                        {pos.title}
                        <span className="crm-count-badge">×{pos.count}</span>
                        {pos.isPending && <span className="crm-pending-badge">Pending</span>}
                      </div>
                      <div style={{fontSize:'0.8rem', color:'var(--primary)', marginTop:'2px', fontWeight:'600'}}>Revenue: ₹{pos.revenue || 0}</div>
                      {pos.description && <p className="crm-position-desc">{pos.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="crm-icon-btn" onClick={() => openEditPos(pos)}><FiEdit2 /></button>
                      <button className="crm-icon-btn danger" onClick={() => deletePos(pos._id)}><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Software Projects */}
          <section className="crm-section glass-card">
            <div className="crm-section-header">
              <h3>Software Projects ({client.softwareProjects?.length || 0})</h3>
              <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={openAddSw}><FiPlus /> Add Project</button>
            </div>
            {client.softwareProjects?.length === 0 ? (
              <div className="crm-empty-inline">No software projects added yet.</div>
            ) : (
              <div className="crm-positions-list">
                {client.softwareProjects.map(proj => (
                  <div key={proj._id} className="crm-position-item">
                    <div className="crm-position-info">
                      <div className="crm-position-title">
                        {proj.title}
                        <span className="crm-status-badge" style={{ background: proj.status === 'completed' ? '#3FB95020' : '#F5A62320', color: proj.status === 'completed' ? '#3FB950' : '#F5A623', marginLeft: '8px' }}>
                          {proj.status}
                        </span>
                      </div>
                      <div style={{fontSize:'0.8rem', color:'var(--primary)', marginTop:'2px', fontWeight:'600'}}>Revenue: ₹{proj.revenue || 0}</div>
                      {proj.description && <p className="crm-position-desc">{proj.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="crm-icon-btn" onClick={() => openEditSw(proj)}><FiEdit2 /></button>
                      <button className="crm-icon-btn danger" onClick={() => deleteSw(proj._id)}><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Client Feedback */}
          <section className="crm-section glass-card">
            <div className="crm-section-header">
              <h3>Client Feedback ({client.feedback?.length || 0})</h3>
              <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={() => setShowFbModal(true)}>
                <FiMessageSquare /> Add Feedback
              </button>
            </div>
            {client.feedback?.length === 0 ? (
              <div className="crm-empty-inline">No feedback recorded yet.</div>
            ) : (
              <div className="crm-feedback-list">
                {client.feedback.map(fb => (
                  <div key={fb._id} className="crm-feedback-item glass-card">
                    <div className="crm-feedback-top">
                      <div className="crm-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} style={{ color: i < fb.rating ? '#F5A623' : 'rgba(255,255,255,0.15)', fill: i < fb.rating ? '#F5A623' : 'none' }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {fb.source && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>— {fb.source}</span>}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(fb.date)}</span>
                        <button className="crm-icon-btn danger" onClick={() => deleteFb(fb._id)}><FiTrash2 /></button>
                      </div>
                    </div>
                    <p className="crm-feedback-text">"{fb.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Secure Files */}
        <div className="crm-detail-side">
          <section className="crm-section glass-card">
            <div className="crm-section-header">
              <h3>🔒 Secure Files ({client.files?.length || 0})</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Files are accessible only within CRM. No public URLs are generated.
            </p>
            <div className="crm-file-upload">
              <label className="crm-file-label">
                <FiUpload />
                <span>{uploadLoading ? 'Uploading...' : 'Upload File'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PDF, DOCX, XLS, CSV — max 10MB</span>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" onChange={handleFileUpload} disabled={uploadLoading} />
              </label>
            </div>

            {client.files?.length === 0 ? (
              <div className="crm-empty-inline" style={{ marginTop: '1rem' }}>No files uploaded yet.</div>
            ) : (
              <div className="crm-files-list">
                {client.files.map(file => (
                  <div key={file._id} className="crm-file-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <FiFile style={{ color: 'var(--crm-accent)', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {file.originalName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatSize(file.sizeBytes)} · {formatDate(file.uploadedAt)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button className="crm-icon-btn" onClick={() => downloadFile(file._id, file.originalName)} title="Download"><FiDownload /></button>
                      <button className="crm-icon-btn danger" onClick={() => deleteFile(file._id)} title="Delete"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Edit Client Modal */}
      {showEditModal && (
        <div className="crm-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="crm-modal crm-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>Edit {client.companyName}</h3>
              <button className="crm-icon-btn" onClick={() => setShowEditModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="crm-form-grid">
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Company Name *</label>
                  <input className="crm-input" value={editForm.companyName} onChange={e => setEditForm({ ...editForm, companyName: e.target.value })} required />
                </div>
                <div className="crm-form-group">
                  <label>Industry</label>
                  <input className="crm-input" value={editForm.industry} onChange={e => setEditForm({ ...editForm, industry: e.target.value })} />
                </div>
                <div className="crm-form-group">
                  <label>Status</label>
                  <select className="crm-input" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Contact Email</label>
                  <input className="crm-input" type="email" value={editForm.contactEmail} onChange={e => setEditForm({ ...editForm, contactEmail: e.target.value })} />
                </div>
                <div className="crm-form-group">
                  <label>Contact Phone</label>
                  <input className="crm-input" value={editForm.contactPhone} onChange={e => setEditForm({ ...editForm, contactPhone: e.target.value })} />
                </div>
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Official Website</label>
                  <input className="crm-input" value={editForm.officialWebsite} onChange={e => setEditForm({ ...editForm, officialWebsite: e.target.value })} />
                </div>
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>About</label>
                  <textarea className="crm-input" rows={3} value={editForm.about} onChange={e => setEditForm({ ...editForm, about: e.target.value })} />
                </div>
                <div className="crm-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Internal Notes</label>
                  <textarea className="crm-input" rows={2} value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} />
                </div>
              </div>
              <div className="crm-modal-actions">
                <button type="button" className="crm-btn crm-btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="crm-btn crm-btn-primary">Update Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Position Modal */}
      {showPosModal && (
        <div className="crm-modal-overlay" onClick={() => setShowPosModal(false)}>
          <div className="crm-modal" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>{editingPos ? 'Edit Position' : 'Add Position'}</h3>
              <button className="crm-icon-btn" onClick={() => setShowPosModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handlePosSubmit}>
              <div className="crm-form-group">
                <label>Position Title *</label>
                <input className="crm-input" value={posForm.title} onChange={e => setPosForm({ ...posForm, title: e.target.value })} required placeholder="e.g. Software Engineer" />
              </div>
              <div className="crm-form-group">
                <label>Count (Number of openings)</label>
                <input className="crm-input" type="number" min={1} value={posForm.count} onChange={e => setPosForm({ ...posForm, count: parseInt(e.target.value) })} />
              </div>
              <div className="crm-form-group">
                <label>Expected Revenue (₹)</label>
                <input className="crm-input" type="number" min={0} value={posForm.revenue} onChange={e => setPosForm({ ...posForm, revenue: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="crm-form-group">
                <label>Description / Requirements</label>
                <textarea className="crm-input" rows={3} value={posForm.description} onChange={e => setPosForm({ ...posForm, description: e.target.value })} placeholder="Skills, experience, requirements..." />
              </div>
              <div className="crm-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <input type="checkbox" id="isPending" checked={posForm.isPending} onChange={e => setPosForm({ ...posForm, isPending: e.target.checked })} />
                <label htmlFor="isPending" style={{ margin: 0 }}>Mark as Pending (still open)</label>
              </div>
              <div className="crm-modal-actions">
                <button type="button" className="crm-btn crm-btn-outline" onClick={() => setShowPosModal(false)}>Cancel</button>
                <button type="submit" className="crm-btn crm-btn-primary">{editingPos ? 'Update' : 'Add Position'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Software Project Modal */}
      {showSwModal && (
        <div className="crm-modal-overlay" onClick={() => setShowSwModal(false)}>
          <div className="crm-modal" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>{editingSw ? 'Edit Software Project' : 'Add Software Project'}</h3>
              <button className="crm-icon-btn" onClick={() => setShowSwModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSwSubmit}>
              <div className="crm-form-group">
                <label>Project Title *</label>
                <input className="crm-input" value={swForm.title} onChange={e => setSwForm({ ...swForm, title: e.target.value })} required placeholder="e.g. E-Commerce Website" />
              </div>
              <div className="crm-form-grid">
                <div className="crm-form-group">
                  <label>Status</label>
                  <select className="crm-input" value={swForm.status} onChange={e => setSwForm({ ...swForm, status: e.target.value })}>
                    <option value="pending">Pending / Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Revenue (₹)</label>
                  <input className="crm-input" type="number" min={0} value={swForm.revenue} onChange={e => setSwForm({ ...swForm, revenue: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="crm-form-group">
                <label>Description / Details</label>
                <textarea className="crm-input" rows={3} value={swForm.description} onChange={e => setSwForm({ ...swForm, description: e.target.value })} placeholder="Tech stack, modules, timeline..." />
              </div>
              <div className="crm-modal-actions">
                <button type="button" className="crm-btn crm-btn-outline" onClick={() => setShowSwModal(false)}>Cancel</button>
                <button type="submit" className="crm-btn crm-btn-primary">{editingSw ? 'Update' : 'Add Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFbModal && (
        <div className="crm-modal-overlay" onClick={() => setShowFbModal(false)}>
          <div className="crm-modal" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>Add Client Feedback</h3>
              <button className="crm-icon-btn" onClick={() => setShowFbModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleFbSubmit}>
              <div className="crm-form-group">
                <label>Feedback Text *</label>
                <textarea className="crm-input" rows={4} value={fbForm.text} onChange={e => setFbForm({ ...fbForm, text: e.target.value })} required placeholder="What did the client say?" />
              </div>
              <div className="crm-form-grid">
                <div className="crm-form-group">
                  <label>Rating (1–5)</label>
                  <select className="crm-input" value={fbForm.rating} onChange={e => setFbForm({ ...fbForm, rating: parseInt(e.target.value) })}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{'⭐'.repeat(n)} ({n})</option>)}
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Source / Given By</label>
                  <input className="crm-input" value={fbForm.source} onChange={e => setFbForm({ ...fbForm, source: e.target.value })} placeholder="e.g. Mr. Sharma, HR Head" />
                </div>
              </div>
              <div className="crm-modal-actions">
                <button type="button" className="crm-btn crm-btn-outline" onClick={() => setShowFbModal(false)}>Cancel</button>
                <button type="submit" className="crm-btn crm-btn-primary">Add Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CRMLayout>
  );
};

export default CRMClientDetail;
