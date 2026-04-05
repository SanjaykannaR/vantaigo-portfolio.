import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './CRM.css';

const CRMLayout = ({ title, children }) => {
  const { isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return <div className="crm-loading-full">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  const isActive = (path) => location.pathname === path;

  const links = [
    { icon: <FiGrid />, label: 'All Clients', path: '/crm' },
    { icon: <FiUsers />, label: 'Analytics & Reports', path: '/crm/reports' },
  ];

  return (
    <div className="crm-page">
      {/* Mobile Header */}
      <div className="crm-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Vantaigo" style={{ height: '30px' }} />
          <span style={{ fontWeight: 700, color: 'var(--crm-accent)' }}>CRM</span>
        </div>
        <button className="crm-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <aside className={`crm-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="crm-sidebar-header">
          <img src="/logo.png" alt="Vantaigo" />
          <div>
            <span>CRM</span>
            <small>Client Management</small>
          </div>
        </div>

        <nav className="crm-nav">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`crm-nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <div className="crm-sidebar-footer">
          <Link to="/admin" className="crm-nav-link">🔧 Admin Panel</Link>
          <button className="crm-nav-link" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      {menuOpen && <div className="crm-overlay" onClick={() => setMenuOpen(false)} />}

      <main className="crm-main">
        <div className="crm-header">
          <h1>{title}</h1>
          <span className="crm-admin-badge">🔐 Admin Access</span>
        </div>
        <div className="crm-content">{children}</div>
      </main>
    </div>
  );
};

export default CRMLayout;
