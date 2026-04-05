import { useState, useEffect } from 'react';
import { hrmsEmployeeAPI } from '../../api';
import HRMSLayout from './HRMSLayout';
import { FiCheckCircle, FiClock, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const STATUS_OPTIONS = ['present', 'absent', 'half-day', 'leave', 'holiday'];
const STATUS_COLORS = {
  present: '#3FB950', absent: '#F85149', 'half-day': '#F5A623',
  leave: '#A371F7', holiday: '#58A6FF', '': '#555'
};

const HRMSAttendance = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [records, setRecords] = useState([]);
  const [markForm, setMarkForm] = useState({
    date: today.toISOString().split('T')[0],
    status: 'present',
    checkIn: '',
    checkOut: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await hrmsEmployeeAPI.getMyAttendance({
        month: String(month).padStart(2, '0'),
        year: String(year),
      });
      setRecords(r.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, [month, year]);

  const handleMark = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await hrmsEmployeeAPI.markAttendance(markForm);
      setSuccess('Attendance marked successfully!');
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error marking attendance');
    } finally {
      setSaving(false);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const leaveCount = records.filter(r => r.status === 'leave' || r.status === 'half-day').length;
  const totalHours = records.reduce((s, r) => s + (r.workHours || 0), 0).toFixed(1);

  // Colour-coded mini calendar
  const daysInMonth = new Date(year, month, 0).getDate();
  const calStart = new Date(year, month - 1, 1).getDay();
  const recordMap = {};
  records.forEach(r => { recordMap[r.date] = r; });

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <HRMSLayout title="Attendance">
      {/* Mark Today's Attendance */}
      <div className="hrms-section">
        <h3 className="hrms-section-title">Mark Attendance</h3>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {success && <div className="hrms-alert hrms-alert-success">{success}</div>}
          {error && <div className="hrms-alert hrms-alert-error">{error}</div>}
          <form onSubmit={handleMark}>
            <div className="hrms-form-grid">
              <div className="hrms-form-group">
                <label>Date</label>
                <input type="date" className="hrms-input" value={markForm.date} onChange={e => setMarkForm({ ...markForm, date: e.target.value })} max={today.toISOString().split('T')[0]} required />
              </div>
              <div className="hrms-form-group">
                <label>Status</label>
                <select className="hrms-input" value={markForm.status} onChange={e => setMarkForm({ ...markForm, status: e.target.value })}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              {markForm.status === 'present' || markForm.status === 'half-day' ? <>
                <div className="hrms-form-group">
                  <label><FiClock /> Check-in Time</label>
                  <input type="datetime-local" className="hrms-input" value={markForm.checkIn} onChange={e => setMarkForm({ ...markForm, checkIn: e.target.value })} />
                </div>
                <div className="hrms-form-group">
                  <label><FiClock /> Check-out Time</label>
                  <input type="datetime-local" className="hrms-input" value={markForm.checkOut} onChange={e => setMarkForm({ ...markForm, checkOut: e.target.value })} />
                </div>
              </> : null}
              <div className="hrms-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Notes (optional)</label>
                <input type="text" className="hrms-input" value={markForm.notes} onChange={e => setMarkForm({ ...markForm, notes: e.target.value })} placeholder="Any notes about this day..." />
              </div>
            </div>
            <button type="submit" className="hrms-btn hrms-btn-primary" disabled={saving} style={{ marginTop: '1rem' }}>
              <FiCheckCircle /> {saving ? 'Saving...' : 'Mark Attendance'}
            </button>
          </form>
        </div>
      </div>

      {/* Calendar View */}
      <div className="hrms-section">
        <div className="hrms-section-header">
          <h3 className="hrms-section-title">Attendance History</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="hrms-icon-btn" onClick={prevMonth}><FiChevronLeft /></button>
            <span style={{ fontWeight: 600, minWidth: '160px', textAlign: 'center' }}>{monthName}</span>
            <button className="hrms-icon-btn" onClick={nextMonth}><FiChevronRight /></button>
          </div>
        </div>

        {/* Stats */}
        <div className="hrms-mini-stats">
          <div className="hrms-mini-stat" style={{ color: STATUS_COLORS.present }}><strong>{presentCount}</strong><span>Present</span></div>
          <div className="hrms-mini-stat" style={{ color: STATUS_COLORS.absent }}><strong>{absentCount}</strong><span>Absent</span></div>
          <div className="hrms-mini-stat" style={{ color: STATUS_COLORS.leave }}><strong>{leaveCount}</strong><span>Leave/Half</span></div>
          <div className="hrms-mini-stat" style={{ color: '#2BA5A5' }}><strong>{totalHours}h</strong><span>Total Hours</span></div>
        </div>

        {/* Calendar grid */}
        <div className="hrms-calendar glass-card">
          <div className="hrms-cal-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="hrms-cal-day-name">{d}</div>
            ))}
          </div>
          <div className="hrms-cal-grid">
            {Array.from({ length: calStart }).map((_, i) => <div key={`e-${i}`} className="hrms-cal-day empty" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const rec = recordMap[dateStr];
              const isToday = dateStr === today.toISOString().split('T')[0];
              return (
                <div
                  key={dateStr}
                  className={`hrms-cal-day ${isToday ? 'today' : ''} ${rec ? 'has-record' : ''}`}
                  style={rec ? { borderColor: STATUS_COLORS[rec.status], background: `${STATUS_COLORS[rec.status]}15` } : {}}
                  title={rec ? `${rec.status}${rec.workHours ? ` · ${rec.workHours}h` : ''}` : 'No record'}
                >
                  <span className="hrms-cal-day-num">{day}</span>
                  {rec && <span className="hrms-cal-day-status" style={{ background: STATUS_COLORS[rec.status] }} />}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="hrms-cal-legend">
            {STATUS_OPTIONS.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_COLORS[s], display: 'inline-block' }} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Records list */}
        {loading ? <div className="hrms-loading">Loading...</div> : (
          <div className="hrms-att-list">
            {records.length === 0 ? (
              <div className="hrms-empty">No attendance records for {monthName}</div>
            ) : records.map(rec => (
              <div key={rec._id} className="hrms-att-row glass-card">
                <div className="hrms-att-date">
                  <FiCalendar />
                  <span>{new Date(rec.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                </div>
                <span className="hrms-badge" style={{ background: `${STATUS_COLORS[rec.status]}20`, color: STATUS_COLORS[rec.status] }}>
                  {rec.status}
                </span>
                {rec.workHours > 0 && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{rec.workHours}h worked</span>}
                {rec.notes && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{rec.notes}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </HRMSLayout>
  );
};

export default HRMSAttendance;
