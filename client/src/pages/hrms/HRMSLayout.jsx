import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHRMSAuth } from '../../context/HRMSAuthContext';
import { hrmsEmployeeAPI } from '../../api';
import {
  FiHome, FiCalendar, FiList, FiFileText, FiLogOut, FiMenu, FiX, FiUser, FiKey
} from 'react-icons/fi';
import './HRMS.css';

const HRMSLayout = ({ title, children }) => {
  const { employee, logout } = useHRMSAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwdStatus, setPwdStatus] = useState({ loading: false, error: '', success: '' });

  const handleLogout = () => {
    logout();
    navigate('/hrms/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 6) {
      setPwdStatus({ loading: false, error: 'New password must be at least 6 characters', success: '' });
      return;
    }
    setPwdStatus({ loading: true, error: '', success: '' });
    try {
      await hrmsEmployeeAPI.changePassword(pwdForm);
      setPwdStatus({ loading: false, error: '', success: 'Password updated successfully!' });
      setTimeout(() => {
        setShowPwdModal(false);
        setPwdForm({ currentPassword: '', newPassword: '' });
        setPwdStatus({ loading: false, error: '', success: '' });
      }, 2000);
    } catch (err) {
      setPwdStatus({ loading: false, error: err.response?.data?.message || 'Error changing password', success: '' });
    }
  };

  const links = [
    { icon: <FiHome />, label: 'Dashboard', path: '/hrms/dashboard' },
    { icon: <FiCalendar />, label: 'Attendance', path: '/hrms/attendance' },
    { icon: <FiList />, label: 'My Workflow', path: '/hrms/workflow' },
    { icon: <FiFileText />, label: 'Add Resume', path: '/hrms/resumes' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hrms-page">
      {/* Mobile Header */}
      <div className="hrms-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Vantaigo" style={{ height: '32px' }} />
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>HRMS</span>
        </div>
        <button className="hrms-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <aside className={`hrms-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="hrms-sidebar-header">
          <img src="/logo.png" alt="Vantaigo" />
          <div>
            <span>HRMS Portal</span>
            <small>Vantaigo</small>
          </div>
        </div>

        {/* Employee info */}
        {employee && (
          <div className="hrms-employee-info">
            <div className="hrms-avatar">{employee.name?.charAt(0)}</div>
            <div>
              <div className="hrms-employee-name">{employee.name}</div>
              <div className="hrms-employee-id">{employee.employeeId}</div>
              <div className="hrms-employee-dept">{employee.designation || employee.department}</div>
            </div>
          </div>
        )}

        <nav className="hrms-nav">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`hrms-nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <div className="hrms-sidebar-footer">
          <button className="hrms-nav-link" onClick={() => { setMenuOpen(false); setShowPwdModal(true); }}>
            <FiKey /> Change Password
          </button>
          <button className="hrms-nav-link" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {menuOpen && <div className="hrms-overlay" onClick={() => setMenuOpen(false)} />}

      <main className="hrms-main">
        <div className="hrms-header">
          <h1>{title}</h1>
          {employee && (
            <div className="hrms-header-user">
              <FiUser />
              <span>{employee.name} · {employee.employeeId}</span>
            </div>
          )}
        </div>
        <div className="hrms-content">{children}</div>
      </main>

      {/* Change Password Modal */}
      {showPwdModal && (
        <div className="hrms-modal-overlay" onClick={() => setShowPwdModal(false)}>
          <div className="hrms-modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="hrms-modal-header">
              <h3><FiKey /> Change Password</h3>
              <button className="hrms-icon-btn" onClick={() => setShowPwdModal(false)}><FiX /></button>
            </div>
            {pwdStatus.error && <div className="hrms-alert hrms-alert-error">{pwdStatus.error}</div>}
            {pwdStatus.success && <div className="hrms-alert hrms-alert-success">{pwdStatus.success}</div>}
            
            <form onSubmit={handlePasswordChange}>
              <div className="hrms-form-group" style={{ marginBottom: '1rem' }}>
                <label>Current Password</label>
                <input 
                  className="hrms-input" 
                  type="password" 
                  required 
                  value={pwdForm.currentPassword} 
                  onChange={e => setPwdForm({...pwdForm, currentPassword: e.target.value})}
                  placeholder="Enter current password" 
                />
              </div>
              <div className="hrms-form-group" style={{ marginBottom: '1.5rem' }}>
                <label>New Password</label>
                <input 
                  className="hrms-input" 
                  type="password" 
                  required 
                  value={pwdForm.newPassword} 
                  onChange={e => setPwdForm({...pwdForm, newPassword: e.target.value})}
                  placeholder="At least 6 characters" 
                />
              </div>
              <div className="hrms-modal-actions">
                <button type="button" className="hrms-btn hrms-btn-outline" onClick={() => setShowPwdModal(false)}>Cancel</button>
                <button type="submit" className="hrms-btn hrms-btn-primary" disabled={pwdStatus.loading}>
                  {pwdStatus.loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRMSLayout;
