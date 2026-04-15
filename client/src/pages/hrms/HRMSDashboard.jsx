import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHRMSAuth } from '../../context/HRMSAuthContext';
import { hrmsEmployeeAPI } from '../../api';
import HRMSLayout from './HRMSLayout';
import { FiCalendar, FiCheckCircle, FiClock, FiList, FiAlertCircle } from 'react-icons/fi';

const HRMSDashboard = () => {
  const { employee } = useHRMSAuth();
  const [attendance, setAttendance] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const load = async () => {
      try {
        const [attRes, workRes] = await Promise.all([
          hrmsEmployeeAPI.getMyAttendance(),
          hrmsEmployeeAPI.getMyWorkItems(),
        ]);
        setAttendance(attRes.data);
        setWorkItems(workRes.data);

        const todayRec = attRes.data.find(a => a.date === today);
        setTodayStatus(todayRec);
      } catch { }
      setLoading(false);
    };
    load();
  }, []);

  // Stats
  const thisMonthYear = today.slice(0, 7);
  const monthAtt = attendance.filter(a => a.date.startsWith(thisMonthYear));
  const presentDays = monthAtt.filter(a => a.status === 'present' || a.status === 'half-day').length;
  const totalHours = monthAtt.reduce((s, a) => s + (a.workHours || 0), 0).toFixed(1);
  const pendingItems = workItems.filter(w => w.status === 'todo' || w.status === 'in-progress').length;
  const doneItems = workItems.filter(w => w.status === 'done').length;

  const getStatusColor = (status) => {
    const colors = { present: '#3FB950', absent: '#F85149', 'half-day': '#F5A623', leave: '#A371F7', holiday: '#58A6FF' };
    return colors[status] || '#666';
  };

  const statusIcon = (status) => {
    if (!status) return <span style={{ color: 'var(--text-muted)' }}>Not marked yet</span>;
    return <span style={{ color: getStatusColor(status.status), fontWeight: 600, textTransform: 'capitalize' }}>✓ {status.status}</span>;
  };

  if (loading) return <HRMSLayout title="Dashboard"><div className="hrms-loading">Loading...</div></HRMSLayout>;

  return (
    <HRMSLayout title="Dashboard">
      <div className="hrms-welcome">
        <h2>Welcome back, <span>{employee?.name}</span>! 👋</h2>
        <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Today's Status */}
      <div className="hrms-today-card glass-card">
        <div>
          <h3>Today's Status</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{today}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {statusIcon(todayStatus)}
          {todayStatus?.checkIn && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
              In: {new Date(todayStatus.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              {todayStatus?.checkOut && (
                <> &nbsp;·&nbsp; Out: {new Date(todayStatus.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</>
              )}
            </p>
          )}
        </div>
        <Link to="/hrms/attendance" className="hrms-btn hrms-btn-primary">
          {!todayStatus ? '🕐 Clock In' : !todayStatus.checkOut ? '🕐 Clock Out' : '✓ View Attendance'}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="hrms-stats-grid">
        <div className="hrms-stat-card glass-card">
          <div className="hrms-stat-icon" style={{ background: '#3FB95020', color: '#3FB950' }}><FiCheckCircle /></div>
          <div>
            <h3>{presentDays}</h3>
            <p>Days Present (This Month)</p>
          </div>
        </div>
        <div className="hrms-stat-card glass-card">
          <div className="hrms-stat-icon" style={{ background: '#2BA5A520', color: '#2BA5A5' }}><FiClock /></div>
          <div>
            <h3>{totalHours}h</h3>
            <p>Hours Worked (This Month)</p>
          </div>
        </div>
        <div className="hrms-stat-card glass-card">
          <div className="hrms-stat-icon" style={{ background: '#F5A62320', color: '#F5A623' }}><FiAlertCircle /></div>
          <div>
            <h3>{pendingItems}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>
        <div className="hrms-stat-card glass-card">
          <div className="hrms-stat-icon" style={{ background: '#A371F720', color: '#A371F7' }}><FiList /></div>
          <div>
            <h3>{doneItems}</h3>
            <p>Tasks Completed</p>
          </div>
        </div>
      </div>

      {/* Recent Work Items */}
      <div className="hrms-section">
        <div className="hrms-section-header">
          <h3>My Active Tasks</h3>
          <Link to="/hrms/workflow" className="hrms-link">View All →</Link>
        </div>
        {workItems.filter(w => w.status !== 'done').slice(0, 5).length === 0 ? (
          <div className="hrms-empty">No active tasks. <Link to="/hrms/workflow">Add a task →</Link></div>
        ) : (
          <div className="hrms-task-list">
            {workItems.filter(w => w.status !== 'done').slice(0, 5).map(item => (
              <div key={item._id} className="hrms-task-item glass-card">
                <div className="hrms-task-info">
                  <div className="hrms-task-title">{item.title}</div>
                  {item.description && <div className="hrms-task-desc">{item.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`hrms-badge hrms-badge-${item.priority}`}>{item.priority}</span>
                  <span className={`hrms-badge hrms-badge-status-${item.status.replace('-', '')}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Attendance */}
      <div className="hrms-section">
        <div className="hrms-section-header">
          <h3>Recent Attendance</h3>
          <Link to="/hrms/attendance" className="hrms-link">View All →</Link>
        </div>
        <div className="hrms-att-mini">
          {attendance.slice(0, 7).map(rec => (
            <div key={rec._id} className="hrms-att-mini-item glass-card">
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{new Date(rec.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
              <span style={{ color: getStatusColor(rec.status), fontWeight: 600, fontSize: '0.8rem', textTransform: 'capitalize' }}>{rec.status}</span>
              {rec.workHours > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.workHours}h</span>}
            </div>
          ))}
        </div>
      </div>
    </HRMSLayout>
  );
};

export default HRMSDashboard;
