import { useState, useRef } from 'react';
import { hrmsEmployeeAPI } from '../../api';
import HRMSLayout from './HRMSLayout';
import { useHRMSAuth } from '../../context/HRMSAuthContext';
import { FiPlus, FiFile, FiLinkedin, FiInstagram, FiGlobe, FiX } from 'react-icons/fi';

const EMPTY_FORM = {
  candidateName: '', role: '', company: '', location: '',
  contactNumber: '', email: '', linkedin: '', instagram: '',
  portfolioWebsite: '', notes: '',
};

const HRMSResumes = () => {
  const { employee } = useHRMSAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

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
      fd.append('addedBy', 'hrms');
      if (file) fd.append('resumeFile', file);

      await hrmsEmployeeAPI.addResume(fd);
      setSuccess('✅ Candidate added to Resume Vault! Admin can view it in the admin panel.');
      setForm(EMPTY_FORM);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HRMSLayout title="Add Candidate Resume">
      <div className="hrms-section">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Add candidate resumes to the shared vault. Once added, they are visible and manageable by the admin in the admin panel.
        </p>

        {success && <div className="hrms-alert hrms-alert-success">{success}</div>}
        {error && <div className="hrms-alert hrms-alert-error">{error}</div>}

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="hrms-form-grid">
              <div className="hrms-form-group">
                <label>Candidate Name *</label>
                <input className="hrms-input" value={form.candidateName} onChange={e => setForm({ ...form, candidateName: e.target.value })} required placeholder="Full name" />
              </div>
              <div className="hrms-form-group">
                <label>Role / Position *</label>
                <input className="hrms-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required placeholder="e.g. React Developer" />
              </div>
              <div className="hrms-form-group">
                <label>Company (Being Considered For)</label>
                <input className="hrms-input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. TCS, Infosys" />
              </div>
              <div className="hrms-form-group">
                <label>Location</label>
                <input className="hrms-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
              </div>
              <div className="hrms-form-group">
                <label>Contact Number</label>
                <input className="hrms-input" type="tel" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="hrms-form-group">
                <label>Email</label>
                <input className="hrms-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="candidate@email.com" />
              </div>
              <div className="hrms-form-group">
                <label><FiLinkedin style={{ verticalAlign: 'middle' }} /> LinkedIn</label>
                <input className="hrms-input" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="hrms-form-group">
                <label><FiInstagram style={{ verticalAlign: 'middle' }} /> Instagram</label>
                <input className="hrms-input" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
              </div>
              <div className="hrms-form-group">
                <label><FiGlobe style={{ verticalAlign: 'middle' }} /> Portfolio Website</label>
                <input className="hrms-input" value={form.portfolioWebsite} onChange={e => setForm({ ...form, portfolioWebsite: e.target.value })} placeholder="https://portfolio.com" />
              </div>
              <div className="hrms-form-group">
                <label><FiFile style={{ verticalAlign: 'middle' }} /> Resume File (PDF/DOC — max 5MB)</label>
                <input ref={fileRef} className="hrms-input" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              </div>
            </div>
            <div className="hrms-form-group" style={{ marginTop: '12px' }}>
              <label>Notes</label>
              <textarea className="hrms-input" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes about this candidate..." />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
              <button type="submit" className="hrms-btn hrms-btn-primary" disabled={loading}>
                <FiPlus /> {loading ? 'Adding...' : 'Add to Resume Vault'}
              </button>
              <button type="button" className="hrms-btn hrms-btn-outline" onClick={() => { setForm(EMPTY_FORM); setFile(null); if (fileRef.current) fileRef.current.value = ''; setError(''); }}>
                <FiX /> Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </HRMSLayout>
  );
};

export default HRMSResumes;
