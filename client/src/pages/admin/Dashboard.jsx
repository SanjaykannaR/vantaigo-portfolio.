import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api';
import { FiUsers, FiCode, FiFileText, FiBriefcase, FiMail, FiStar, FiUserCheck, FiLayers, FiActivity, FiFile } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import './Admin.css';

const Dashboard = () => {
  const { admin } = useAuth();
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
          employees: 0, // Quick stats placeholder if we want to fetch them later
          resumes: 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    { icon: <FiUsers />, label: 'CMS Clients', count: stats.clients, path: '/admin/clients', color: '#2BA5A5' },
    { icon: <FiActivity />, label: 'CRM Clients', count: null, path: '/crm', color: '#3FB950' },
    { icon: <FiCode />, label: 'Projects', count: stats.projects, path: '/admin/projects', color: '#58A6FF' },
    { icon: <FiLayers />, label: 'Services', path: '/admin/services', color: '#F5A623' },
    { icon: <FiStar />, label: 'Testimonials', path: '/admin/testimonials', color: '#A371F7' },
    { icon: <FiFileText />, label: 'Blog Posts', count: stats.blogs, path: '/admin/blog', color: '#F778BA' },
    { icon: <FiUserCheck />, label: 'Employees', count: null, path: '/admin/employees', color: '#2BA5A5' },
    { icon: <FiFile />, label: 'Resumes', count: null, path: '/admin/resumes', color: '#D29922' },
    { icon: <FiBriefcase />, label: 'Careers', count: stats.careers, path: '/admin/careers', color: '#F85149' },
    { icon: <FiMail />, label: 'Newsletter', count: stats.subscribers, path: '/admin/newsletter', color: '#58A6FF' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div style={{ marginBottom: '2rem' }}>
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
    </AdminLayout>
  );
};

export default Dashboard;
