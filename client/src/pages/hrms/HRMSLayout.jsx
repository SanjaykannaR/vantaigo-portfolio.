import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHRMSAuth } from '../../context/HRMSAuthContext';
import {
  FiHome, FiCalendar, FiList, FiFileText, FiLogOut, FiMenu, FiX, FiUser
} from 'react-icons/fi';
import './HRMS.css';

const HRMSLayout = ({ title, children }) => {
  const { employee, logout } = useHRMSAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/hrms/login');
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
    </div>
  );
};

export default HRMSLayout;
