import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api';
import {
  FiUsers, FiCode, FiFileText, FiBriefcase, FiMail, FiStar,
  FiUserCheck, FiLayers, FiActivity, FiFile, FiClock,
  FiCheckCircle, FiXCircle, FiAlertCircle, FiGrid, FiRefreshCw,
  FiTrendingUp, FiCalendar, FiClipboard, FiBell
} from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import './Admin.css';

const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const [clients, projects, blogs, careers, subscribers, team, empRes, attRes, workRes] = await Promise.all([
        adminAPI.getClients().catch(() => ({ data: [] })),
        adminAPI.getProjects().catch(() => ({ data: [] })),
        adminAPI.getBlogPosts().catch(() => ({ data: [] })),
        adminAPI.getCareers().catch(() => ({ data: [] })),
        adminAPI.getSubscribers().catch(() => ({ data: [] })),
        adminAPI.getTeam().catch(() => ({ data: [] })),
        adminAPI.getEmployees().catch(() => ({ data: [] })),
        adminAPI.getAllAttendance({ date: todayDate.toISOString().split('T')[0] }).catch(() => ({ data: [] })),
        adminAPI.getAllWorkItems({ date: todayDate.toISOString().split('T')[0] }).catch(() => ({ data: [] })),
      ]);

      setStats({
        clients: clients.data.length,
        projects: projects.data.length,
        blogs: blogs.data.length,
        careers: careers.data.length,
        subscribers: subscribers.data.length,
        team: team.data.length,
        employees: empRes.data.length,
        activeEmployees: empRes.data.filter(e => e.isActive).length,
      });

      setEmployees(empRes.data);
      setAttendance(Array.isArray(attRes.data) ? attRes.data : []);
      setWorkItems(Array.isArray(workRes.data) ? workRes.data : []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const getAttStatus = (record) => {
    if (record.checkOut) return { label: 'Checked Out', color: '#8B949E', icon: <FiCheckCircle /> };
    if (record.checkIn) return { label: 'Present', color: '#3FB950', icon: <FiCheckCircle /> };
    return { label: 'Absent', color: '#F85149', icon: <FiXCircle /> };
  };

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getWorkStatusColor = (status) => {
    const map = { completed: '#3FB950', 'in-progress': '#58A6FF', pending: '#D29922', blocked: '#F85149' };
    return map[status] || '#8B949E';
  };

  // Build employee map for quick lookup
  const empMap = {};
  employees.forEach(e => { empMap[e._id] = e; });

  // Employees who haven't marked attendance today
  const presentIds = new Set(attendance.map(a => String(a.employee?._id || a.employee)));
  const absentEmployees = employees.filter(e => e.isActive && !presentIds.has(String(e._id)));

  const statCards = [
    { icon: <FiUserCheck />, label: 'Active Employees', value: stats.activeEmployees ?? '—', color: '#2BA5A5', path: '/admin/employees' },
    { icon: <FiUsers />, label: 'CMS Clients', value: stats.clients ?? '—', color: '#58A6FF', path: '/admin/clients' },
    { icon: <FiCode />, label: 'Projects', value: stats.projects ?? '—', color: '#A371F7', path: '/admin/projects' },
    { icon: <FiFileText />, label: 'Blog Posts', value: stats.blogs ?? '—', color: '#F778BA', path: '/admin/blog' },
    { icon: <FiBriefcase />, label: 'Open Positions', value: stats.careers ?? '—', color: '#F5A623', path: '/admin/careers' },
    { icon: <FiMail />, label: 'Subscribers', value: stats.subscribers ?? '—', color: '#3FB950', path: '/admin/newsletter' },
  ];

  const quickLinks = [
    { icon: <FiUserCheck />, label: 'Employees', path: '/admin/employees', color: '#2BA5A5' },
    { icon: <FiFile />, label: 'Resume Vault', path: '/admin/resumes', color: '#D29922' },
    { icon: <FiActivity />, label: 'CRM', path: '/crm', color: '#3FB950' },
    { icon: <FiGrid />, label: 'Services', path: '/admin/services', color: '#F5A623' },
    { icon: <FiStar />, label: 'Testimonials', path: '/admin/testimonials', color: '#A371F7' },
    { icon: <FiLayers />, label: 'Team Members', path: '/admin/team', color: '#58A6FF' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome Strip */}
      <div className="dash-welcome">
        <div>
          <h2 className="dash-greet">
            Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening'}, <span className="text-gradient">{admin?.username}</span> 👋
          </h2>
          <p className="dash-date"><FiCalendar style={{ marginRight: 6, verticalAlign: 'middle' }} />{todayStr}</p>
        </div>
        <button className="btn btn-outline btn-sm dash-refresh" onClick={fetchAll} title="Refresh">
          <FiRefreshCw className={loading ? 'spin-icon' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Strip */}
      <div className="dash-stats-strip">
        {statCards.map(card => (
          <Link key={card.path} to={card.path} className="dash-stat" style={{ '--card-color': card.color }}>
            <div className="dash-stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="dash-stat-val">{card.value}</div>
              <div className="dash-stat-label">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid: Attendance + Work Items */}
      <div className="dash-main-grid">

        {/* Today's Attendance */}
        <div className="dash-section glass-card" style={{ padding: '1.5rem' }}>
          <div className="dash-section-header">
            <h3><FiClock style={{ color: '#3FB950' }} /> Today's Attendance</h3>
            <span className="badge badge-success">{attendance.filter(a => a.checkIn).length} / {stats.activeEmployees || 0} Present</span>
          </div>

          {loading ? (
            <div className="dash-loading">Loading attendance…</div>
          ) : attendance.length === 0 ? (
            <div className="dash-empty">
              <FiAlertCircle style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: 8 }} />
              <p>No attendance records for today yet.</p>
              <Link to="/admin/employees" className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>View Employees</Link>
            </div>
          ) : (
            <div className="dash-att-table-wrap">
              <table className="dash-att-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((rec) => {
                    const emp = rec.employee || {};
                    const status = getAttStatus(rec);
                    return (
                      <tr key={rec._id}>
                        <td>
                          <code className="emp-id-badge">{emp.employeeId || '—'}</code>
                        </td>
                        <td>
                          <div className="att-emp-name">{emp.name || '—'}</div>
                          <div className="att-emp-email">{emp.email || ''}</div>
                        </td>
                        <td>{emp.department || '—'}</td>
                        <td className="att-time">{formatTime(rec.checkIn)}</td>
                        <td className="att-time">{formatTime(rec.checkOut)}</td>
                        <td>
                          <span className="att-status-pill" style={{ background: `${status.color}20`, color: status.color }}>
                            {status.icon} {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Absent employees */}
          {!loading && absentEmployees.length > 0 && (
            <div className="dash-absent-strip">
              <FiXCircle style={{ color: '#F85149', flexShrink: 0 }} />
              <span><strong>{absentEmployees.length} not checked in:</strong> {absentEmployees.slice(0, 5).map(e => e.name).join(', ')}{absentEmployees.length > 5 ? ` +${absentEmployees.length - 5} more` : ''}</span>
            </div>
          )}
        </div>

        {/* Right column: Work Items + Quick Links */}
        <div className="dash-right-col">

          {/* Current Work Items */}
          <div className="dash-section glass-card" style={{ padding: '1.5rem' }}>
            <div className="dash-section-header">
              <h3><FiClipboard style={{ color: '#58A6FF' }} /> Work Activity Today</h3>
              <span className="badge badge-primary">{workItems.length} items</span>
            </div>

            {loading ? (
              <div className="dash-loading">Loading work items…</div>
            ) : workItems.length === 0 ? (
              <div className="dash-empty">
                <FiClipboard style={{ fontSize: '1.8rem', color: 'var(--text-muted)', marginBottom: 8 }} />
                <p>No work items logged today.</p>
              </div>
            ) : (
              <div className="dash-work-list">
                {workItems.slice(0, 8).map((item) => {
                  const emp = item.employee || {};
                  const statusColor = getWorkStatusColor(item.status);
                  return (
                    <div key={item._id} className="dash-work-item">
                      <div className="dash-work-dot" style={{ background: statusColor }} />
                      <div className="dash-work-body">
                        <div className="dash-work-title">{item.title || item.description || 'Untitled Task'}</div>
                        <div className="dash-work-meta">
                          <code className="emp-id-badge emp-id-sm">{emp.employeeId || '—'}</code>
                          <span>{emp.name || 'Unknown'}</span>
                          {emp.department && <span className="dash-work-dept">· {emp.department}</span>}
                        </div>
                      </div>
                      <span className="dash-work-status" style={{ color: statusColor, background: `${statusColor}18` }}>
                        {item.status || 'pending'}
                      </span>
                    </div>
                  );
                })}
                {workItems.length > 8 && (
                  <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    +{workItems.length - 8} more items — check HRMS for full view
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="dash-section glass-card" style={{ padding: '1.5rem' }}>
            <div className="dash-section-header" style={{ marginBottom: '1rem' }}>
              <h3><FiTrendingUp style={{ color: '#F5A623' }} /> Quick Access</h3>
            </div>
            <div className="dash-quick-grid">
              {quickLinks.map(link => (
                <Link key={link.path} to={link.path} className="dash-quick-btn" style={{ '--ql-color': link.color }}>
                  <span className="dash-quick-icon" style={{ color: link.color, background: `${link.color}18` }}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer note */}
      <div className="dash-footer-note">
        <FiBell style={{ color: 'var(--primary)', marginRight: 6 }} />
        Last refreshed at {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
        &nbsp;·&nbsp;
        <Link to="/hrms/dashboard" style={{ color: 'var(--primary)' }}>Open HRMS Portal →</Link>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
