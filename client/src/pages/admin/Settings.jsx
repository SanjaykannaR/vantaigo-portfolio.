import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiLock, FiUser, FiGlobe, FiLinkedin, FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiGithub, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('credentials');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Credentials form
  const [credForm, setCredForm] = useState({
    currentPassword: '', username: '', email: '', newPassword: '', confirmPassword: '',
  });

  // Social form
  const [socialForm, setSocialForm] = useState({
    linkedin: '', twitter: '', facebook: '', instagram: '', youtube: '', github: '',
  });

  useEffect(() => {
    adminAPI.getSiteConfig().then(r => {
      setConfig(r.data);
      if (r.data?.socialLinks) {
        setSocialForm({
          linkedin: r.data.socialLinks.linkedin || '',
          twitter: r.data.socialLinks.twitter || '',
          facebook: r.data.socialLinks.facebook || '',
          instagram: r.data.socialLinks.instagram || '',
          youtube: r.data.socialLinks.youtube || '',
          github: r.data.socialLinks.github || '',
        });
      }
    }).catch(() => { });
  }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 4000);
  };

  const handleCredentials = async (e) => {
    e.preventDefault();
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      flash('New passwords do not match', true);
      return;
    }
    setLoading(true);
    try {
      const payload = { currentPassword: credForm.currentPassword };
      if (credForm.username) payload.username = credForm.username;
      if (credForm.email) payload.email = credForm.email;
      if (credForm.newPassword) payload.newPassword = credForm.newPassword;
      await adminAPI.changeCredentials(payload);
      setCredForm({ currentPassword: '', username: '', email: '', newPassword: '', confirmPassword: '' });
      flash('Credentials updated successfully!');
    } catch (err) {
      flash(err.response?.data?.message || 'Error updating credentials', true);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinks = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.updateSiteConfig({ socialLinks: socialForm });
      flash('Social media links updated!');
    } catch (err) {
      flash('Error updating social links', true);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'credentials', label: '🔐 Change Password', icon: <FiLock /> },
    { id: 'social', label: '🌐 Social Media Links', icon: <FiGlobe /> },
  ];

  return (
    <AdminLayout title="Settings">
      {success && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}
      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Tab Navigation */}
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content glass-card">
        {/* ── Change Credentials ─────────────────────────────────── */}
        {activeTab === 'credentials' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiUser /> Admin Credentials
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Update your admin username, email, or password. You must enter your current password to make changes.
            </p>
            <form onSubmit={handleCredentials}>
              <div className="form-group">
                <label>Current Password *</label>
                <div className="input-icon-wrap">
                  <input
                    className="form-control"
                    type={showCurrent ? 'text' : 'password'}
                    value={credForm.currentPassword}
                    onChange={e => setCredForm({ ...credForm, currentPassword: e.target.value })}
                    required
                    placeholder="Your current password"
                  />
                  <button type="button" className="input-icon-btn" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0', padding: '1rem 0 0' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Leave fields blank to keep their current values.
                </p>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>New Username</label>
                    <input className="form-control" value={credForm.username} onChange={e => setCredForm({ ...credForm, username: e.target.value })} placeholder="New username (optional)" />
                  </div>
                  <div className="form-group">
                    <label>New Email</label>
                    <input className="form-control" type="email" value={credForm.email} onChange={e => setCredForm({ ...credForm, email: e.target.value })} placeholder="New email (optional)" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-icon-wrap">
                      <input
                        className="form-control"
                        type={showNew ? 'text' : 'password'}
                        value={credForm.newPassword}
                        onChange={e => setCredForm({ ...credForm, newPassword: e.target.value })}
                        placeholder="New password (optional)"
                        minLength={6}
                      />
                      <button type="button" className="input-icon-btn" onClick={() => setShowNew(!showNew)}>
                        {showNew ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      className="form-control"
                      type="password"
                      value={credForm.confirmPassword}
                      onChange={e => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiSave /> {loading ? 'Updating...' : 'Update Credentials'}
              </button>
            </form>
          </div>
        )}

        {/* ── Social Media Links ──────────────────────────────────── */}
        {activeTab === 'social' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiGlobe /> Social Media Links
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              These links appear in the website footer and contact section. Enter full URLs.
            </p>
            <form onSubmit={handleSocialLinks}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label><FiLinkedin style={{ color: '#0A66C2', verticalAlign: 'middle' }} /> LinkedIn</label>
                  <input className="form-control" value={socialForm.linkedin} onChange={e => setSocialForm({ ...socialForm, linkedin: e.target.value })} placeholder="https://linkedin.com/company/vantaigo" />
                </div>
                <div className="form-group">
                  <label><FiInstagram style={{ color: '#E1306C', verticalAlign: 'middle' }} /> Instagram</label>
                  <input className="form-control" value={socialForm.instagram} onChange={e => setSocialForm({ ...socialForm, instagram: e.target.value })} placeholder="https://instagram.com/vantaigo" />
                </div>
                <div className="form-group">
                  <label><FiTwitter style={{ color: '#1DA1F2', verticalAlign: 'middle' }} /> Twitter / X</label>
                  <input className="form-control" value={socialForm.twitter} onChange={e => setSocialForm({ ...socialForm, twitter: e.target.value })} placeholder="https://twitter.com/vantaigo" />
                </div>
                <div className="form-group">
                  <label><FiFacebook style={{ color: '#1877F2', verticalAlign: 'middle' }} /> Facebook</label>
                  <input className="form-control" value={socialForm.facebook} onChange={e => setSocialForm({ ...socialForm, facebook: e.target.value })} placeholder="https://facebook.com/vantaigo" />
                </div>
                <div className="form-group">
                  <label><FiYoutube style={{ color: '#FF0000', verticalAlign: 'middle' }} /> YouTube</label>
                  <input className="form-control" value={socialForm.youtube} onChange={e => setSocialForm({ ...socialForm, youtube: e.target.value })} placeholder="https://youtube.com/@vantaigo" />
                </div>
                <div className="form-group">
                  <label><FiGithub style={{ verticalAlign: 'middle' }} /> GitHub</label>
                  <input className="form-control" value={socialForm.github} onChange={e => setSocialForm({ ...socialForm, github: e.target.value })} placeholder="https://github.com/vantaigo" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                <FiSave /> {loading ? 'Saving...' : 'Save Social Links'}
              </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Settings;
