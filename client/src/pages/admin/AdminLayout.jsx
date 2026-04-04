import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiSettings, FiUsers, FiCode, FiLayers, FiStar, FiFileText, FiUserCheck, FiBriefcase, FiMail, FiLogOut } from 'react-icons/fi';
import './Admin.css';

const AdminLayout = ({ title, children }) => {
  const { logout } = useAuth();
  const links = [
    { icon: <FiSettings />, label: 'Dashboard', path: '/admin' },
    { icon: <FiUsers />, label: 'Clients', path: '/admin/clients' },
    { icon: <FiCode />, label: 'Projects', path: '/admin/projects' },
    { icon: <FiLayers />, label: 'Services', path: '/admin/services' },
    { icon: <FiStar />, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: <FiFileText />, label: 'Blog', path: '/admin/blog' },
    { icon: <FiUserCheck />, label: 'Team', path: '/admin/team' },
    { icon: <FiBriefcase />, label: 'Careers', path: '/admin/careers' },
    { icon: <FiMail />, label: 'Newsletter', path: '/admin/newsletter' },
  ];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Vantaigo" />
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          {links.map(link => (
            <Link key={link.path} to={link.path} className={`admin-nav-link ${window.location.pathname === link.path ? 'active' : ''}`}>
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link">🌐 View Site</Link>
          <button className="admin-nav-link" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-header"><h1>{title}</h1></div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
