import { useState, useEffect, useCallback } from 'react';
import { hrmsEmployeeAPI } from '../../api';
import HRMSLayout from './HRMSLayout';
import {
  FiLogIn, FiLogOut, FiCalendar, FiClock, FiChevronLeft, FiChevronRight, FiCheckCircle, FiCoffee
} from 'react-icons/fi';

const STATUS_COLORS = {
  present: '#3FB950',
  absent: '#F85149',
  'half-day': '#F5A623',
  leave: '#A371F7',
  holiday: '#58A6FF',
  '': '#555',
};

const STATUS_OPTIONS = ['present', 'absent', 'half-day', 'leave', 'holiday'];

const formatTime = (isoStr) => {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

const HRMSAttendance = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [records, setRecords] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [liveTime, setLiveTime] = useState(new Date());

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await hrmsEmployeeAPI.getMyAttendance({
        month: String(month).padStart(2, '0'),
        year: String(year),
      });
      setRecords(r.data);
      const rec = r.data.find(x => x.date === todayStr);
      setTodayRecord(rec || null);
    } catch { /* silent */ }
    setLoading(false);
  }, [month, year, todayStr]);

  useEffect(() => { load(); }, [load]);

  const showMsg = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setError(''); }
    else { setError(msg); setSuccess(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 4000);
  };

  const handleClockIn = async () => {
    setActionLoading('in');
    try {
      const now = new Date().toISOString();
      await hrmsEmployeeAPI.markAttendance({
        date: todayStr,
        status: 'present',
        checkIn: now,
        checkOut: todayRecord?.checkOut || null,
        notes: todayRecord?.notes || '',
      });
      showMsg('success', 'Clocked in successfully! You are marked as Present.');
      load();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to clock in. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  const handleClockOut = async () => {
    setActionLoading('out');
    try {
      const now = new Date().toISOString();
      await hrmsEmployeeAPI.markAttendance({
        date: todayStr,
        status: todayRecord?.status || 'present',
        checkIn: todayRecord?.checkIn || now,
        checkOut: now,
        notes: todayRecord?.notes || '',
      });
      showMsg('success', 'Clocked out successfully! Have a great rest of your day.');
      load();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to clock out. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  const handleBreakAction = async () => {
    setActionLoading('break');
    try {
      const now = new Date().toISOString();
      const currentBreaks = todayRecord?.breaks || [];
      const updatedBreaks = [...currentBreaks];
      
      const onBreak = currentBreaks.length > 0 && currentBreaks[currentBreaks.length - 1].start && !currentBreaks[currentBreaks.length - 1].end;

      if (onBreak) {
        updatedBreaks[updatedBreaks.length - 1].end = now;
      } else {
        updatedBreaks.push({ start: now });
      }

      await hrmsEmployeeAPI.markAttendance({
        date: todayStr,
        status: todayRecord?.status || 'present',
        checkIn: todayRecord?.checkIn,
        checkOut: todayRecord?.checkOut || null,
        notes: todayRecord?.notes || '',
        breaks: updatedBreaks,
      });
      showMsg('success', onBreak ? 'Break ended. Welcome back!' : 'Break started. Enjoy your break!');
      load();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to update break status.');
    } finally {
      setActionLoading('');
    }
  };

  // Derived state
  const hasCheckedIn = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;
  const isSessionComplete = hasCheckedIn && hasCheckedOut;
  const breakList = todayRecord?.breaks || [];
  const isOnBreak = breakList.length > 0 && breakList[breakList.length - 1].start && !breakList[breakList.length - 1].end;


  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const leaveCount = records.filter(r => r.status === 'leave' || r.status === 'half-day').length;
  const totalHours = records.reduce((s, r) => s + (r.workHours || 0), 0).toFixed(1);

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
      {/* ── Today's Attendance Clock Card ── */}
      <div className="hrms-section">
        <h3 className="hrms-section-title">Today's Attendance</h3>

        <div className="att-clock-card glass-card">
          {/* Date & live time */}
          <div className="att-clock-header">
            <div className="att-clock-date">
              <FiCalendar style={{ color: 'var(--primary)', marginRight: 8 }} />
              {formatDateDisplay(todayStr)}
            </div>
            <div className="att-clock-live">
              <FiClock style={{ marginRight: 6 }} />
              {liveTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
          </div>

          {/* Alerts */}
          {success && (
            <div className="hrms-alert hrms-alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCheckCircle /> {success}
            </div>
          )}
          {error && <div className="hrms-alert hrms-alert-error">{error}</div>}

          {/* Status Timeline */}
          <div className="att-status-row">
            <div className={`att-status-pill ${hasCheckedIn ? 'active' : ''}`}>
              <FiLogIn />
              <div>
                <span className="att-pill-label">Clock In</span>
                <span className="att-pill-time">{hasCheckedIn ? formatTime(todayRecord.checkIn) : '—'}</span>
              </div>
            </div>
            <div className="att-status-divider" />
            <div className={`att-status-pill ${isOnBreak ? 'break-pill' : hasCheckedOut || breakList.length > 0 ? 'break-pill' : ''}`} style={(!isOnBreak && breakList.length === 0) ? { opacity: 0.5 } : {}}>
              <FiCoffee />
              <div>
                <span className="att-pill-label">Break</span>
                <span className="att-pill-time">
                  {isOnBreak ? 'On Break' : breakList.length > 0 ? `${breakList.length} Break(s)` : '—'}
                </span>
              </div>
            </div>
            <div className="att-status-divider" />
            <div className={`att-status-pill ${hasCheckedOut ? 'active checked-out' : ''}`}>
              <FiLogOut />
              <div>
                <span className="att-pill-label">Clock Out</span>
                <span className="att-pill-time">{hasCheckedOut ? formatTime(todayRecord.checkOut) : '—'}</span>
              </div>
            </div>
            {isSessionComplete && (
              <>
                <div className="att-status-divider" />
                <div className="att-status-pill active hours-pill">
                  <FiClock />
                  <div>
                    <span className="att-pill-label">Work Hours</span>
                    <span className="att-pill-time">{todayRecord.workHours}h</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="att-action-row">
            <button
              className={`att-action-btn clock-in-btn ${hasCheckedIn ? 'done' : ''}`}
              onClick={handleClockIn}
              disabled={!!actionLoading || hasCheckedIn}
              id="btn-clock-in"
            >
              <FiLogIn size={20} />
              <span>
                {actionLoading === 'in'
                  ? 'Clocking In...'
                  : hasCheckedIn
                    ? `Clocked In at ${formatTime(todayRecord.checkIn)}`
                    : 'Clock In'}
              </span>
            </button>

            <button
              className={`att-action-btn break-btn ${isOnBreak ? 'active' : ''}`}
              onClick={handleBreakAction}
              disabled={!!actionLoading || !hasCheckedIn || hasCheckedOut}
              id="btn-break"
            >
              <FiCoffee size={20} />
              <span>
                {actionLoading === 'break'
                  ? 'Processing...'
                  : isOnBreak
                    ? 'Resume Work'
                    : 'Take Break'}
              </span>
            </button>

            <button
              className={`att-action-btn clock-out-btn ${hasCheckedOut ? 'done' : ''}`}
              onClick={handleClockOut}
              disabled={!!actionLoading || !hasCheckedIn || hasCheckedOut || isOnBreak}
              id="btn-clock-out"
            >
              <FiLogOut size={20} />
              <span>
                {actionLoading === 'out'
                  ? 'Clocking Out...'
                  : hasCheckedOut
                    ? `Clocked Out at ${formatTime(todayRecord.checkOut)}`
                    : 'Clock Out'}
              </span>
            </button>
          </div>

          {/* Helper text */}
          <p className="att-hint">
            {!hasCheckedIn && 'Click "Clock In" to mark your attendance and start your work session.'}
            {hasCheckedIn && !hasCheckedOut && 'You are currently clocked in. Click "Clock Out" when you finish your work.'}
            {isSessionComplete && `Great work today! Total session: ${todayRecord.workHours}h`}
          </p>

          {/* Today's status badge */}
          {todayRecord && (
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status:</span>
              <span
                className="hrms-badge"
                style={{
                  background: `${STATUS_COLORS[todayRecord.status]}20`,
                  color: STATUS_COLORS[todayRecord.status],
                }}
              >
                {todayRecord.status.charAt(0).toUpperCase() + todayRecord.status.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Attendance History ── */}
      <div className="hrms-section">
        <div className="hrms-section-header">
          <h3 className="hrms-section-title" style={{ margin: 0 }}>Attendance History</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="hrms-icon-btn" onClick={prevMonth}><FiChevronLeft /></button>
            <span style={{ fontWeight: 600, minWidth: '140px', textAlign: 'center', fontSize: '0.92rem' }}>{monthName}</span>
            <button className="hrms-icon-btn" onClick={nextMonth}><FiChevronRight /></button>
          </div>
        </div>

        {/* Stats */}
        <div className="hrms-mini-stats">
          <div className="hrms-mini-stat" style={{ color: STATUS_COLORS.present }}>
            <strong>{presentCount}</strong><span>Present</span>
          </div>
          <div className="hrms-mini-stat" style={{ color: STATUS_COLORS.absent }}>
            <strong>{absentCount}</strong><span>Absent</span>
          </div>
          <div className="hrms-mini-stat" style={{ color: STATUS_COLORS.leave }}>
            <strong>{leaveCount}</strong><span>Leave/Half</span>
          </div>
          <div className="hrms-mini-stat" style={{ color: '#2BA5A5' }}>
            <strong>{totalHours}h</strong><span>Total Hours</span>
          </div>
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
              const isToday = dateStr === todayStr;
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
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[s], display: 'inline-block' }} />
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
                {rec.checkIn && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiLogIn size={12} style={{ color: '#3FB950' }} /> {formatTime(rec.checkIn)}
                  </span>
                )}
                {rec.checkOut && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiLogOut size={12} style={{ color: '#F85149' }} /> {formatTime(rec.checkOut)}
                  </span>
                )}
                {rec.workHours > 0 && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{rec.workHours}h worked</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </HRMSLayout>
  );
};

export default HRMSAttendance;
