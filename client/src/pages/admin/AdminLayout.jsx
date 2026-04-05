import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiSettings, FiUsers, FiCode, FiLayers, FiStar, FiFileText,
  FiUserCheck, FiBriefcase, FiMail, FiLogOut, FiMenu, FiX,
  FiFileText as FiResume, FiUser, FiSliders, FiBarChart2, FiGrid
} from 'react-icons/fi';
import './Admin.css';

const AdminLayout = ({ title, children }) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const mainLinks = [
    { icon: <FiGrid />, label: 'Dashboard', path: '/admin' },
    { icon: <FiUsers />, label: 'Clients', path: '/admin/clients' },
    { icon: <FiCode />, label: 'Projects', path: '/admin/projects' },
    { icon: <FiLayers />, label: 'Services', path: '/admin/services' },
    { icon: <FiStar />, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: <FiFileText />, label: 'Blog', path: '/admin/blog' },
    { icon: <FiUserCheck />, label: 'Team', path: '/admin/team' },
    { icon: <FiBriefcase />, label: 'Careers', path: '/admin/careers' },
    { icon: <FiMail />, label: 'Newsletter', path: '/admin/newsletter' },
  ];

  const hrmsLinks = [
    { icon: <FiResume />, label: 'Resume Vault', path: '/admin/resumes' },
    { icon: <FiUser />, label: 'Employees', path: '/admin/employees' },
  ];

  return (
    <div className="admin-page">
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Vantaigo" />
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Admin Panel</span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Vantaigo" />
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {/* Main CMS Links */}
          <div className="nav-section-label">Website CMS</div>
          {mainLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`admin-nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}

          {/* HRMS Section */}
          <div className="nav-section-label" style={{ marginTop: '8px' }}>HR Management</div>
          {hrmsLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`admin-nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}

          {/* Settings */}
          <div className="nav-section-label" style={{ marginTop: '8px' }}>System</div>
          <Link
            to="/admin/settings"
            onClick={() => setMenuOpen(false)}
            className={`admin-nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
          >
            <FiSliders /> Settings
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link" title="Go to main website">🌐 Main Site</Link>
          <a href="/hrms/login" className="admin-nav-link" title="Go to HRMS">🏢 HRMS Portal</a>
          <Link to="/crm" className="admin-nav-link" title="Go to CRM">📊 CRM</Link>
          <button className="admin-nav-link" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {menuOpen && <div className="admin-sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <main className="admin-main">
        <div className="admin-header"><h1>{title}</h1></div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
