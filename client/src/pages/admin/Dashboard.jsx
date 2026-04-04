import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api';
import { FiUsers, FiCode, FiFileText, FiBriefcase, FiMail, FiSettings, FiLogOut, FiStar, FiUserCheck, FiLayers } from 'react-icons/fi';
import './Admin.css';

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clients, projects, blogs, careers, subscribers, team] = await Promise.all([
          adminAPI.getClients(),
          adminAPI.getProjects(),
          adminAPI.getBlogPosts(),
          adminAPI.getCareers(),
          adminAPI.getSubscribers(),
          adminAPI.getTeam(),
        ]);
        setStats({
          clients: clients.data.length,
          projects: projects.data.length,
          blogs: blogs.data.length,
          careers: careers.data.length,
          subscribers: subscribers.data.length,
          team: team.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    { icon: <FiUsers />, label: 'Clients', count: stats.clients, path: '/admin/clients', color: '#2BA5A5' },
    { icon: <FiCode />, label: 'Projects', count: stats.projects, path: '/admin/projects', color: '#3FB950' },
    { icon: <FiLayers />, label: 'Services', path: '/admin/services', color: '#58A6FF' },
    { icon: <FiStar />, label: 'Testimonials', path: '/admin/testimonials', color: '#F5A623' },
    { icon: <FiFileText />, label: 'Blog Posts', count: stats.blogs, path: '/admin/blog', color: '#A371F7' },
    { icon: <FiUserCheck />, label: 'Team Members', count: stats.team, path: '/admin/team', color: '#F778BA' },
    { icon: <FiBriefcase />, label: 'Careers', count: stats.careers, path: '/admin/careers', color: '#D29922' },
    { icon: <FiMail />, label: 'Newsletter', count: stats.subscribers, path: '/admin/newsletter', color: '#F85149' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Vantaigo" />
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link active"><FiSettings /> Dashboard</Link>
          {menuItems.map(item => (
            <Link key={item.path} to={item.path} className="admin-nav-link">{item.icon} {item.label}</Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link">🌐 View Site</Link>
          <button className="admin-nav-link" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{admin?.username}</strong></p>
        </div>
        <div className="admin-stats-grid">
          {menuItems.map(item => (
            <Link key={item.path} to={item.path} className="admin-stat-card glass-card">
              <div className="admin-stat-icon" style={{ background: `${item.color}20`, color: item.color }}>{item.icon}</div>
              <div>
                <h3>{item.count ?? '—'}</h3>
                <p>{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
