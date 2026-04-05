import { useState, useEffect } from 'react';
import { hrmsEmployeeAPI } from '../../api';
import HRMSLayout from './HRMSLayout';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

const STATUSES = ['todo', 'in-progress', 'pipeline', 'review', 'done'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const STATUS_LABELS = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'pipeline': 'Pipeline',
  'review': 'In Review',
  'done': 'Done',
};

const STATUS_COLORS = {
  'todo': '#555',
  'in-progress': '#2BA5A5',
  'pipeline': '#F5A623',
  'review': '#A371F7',
  'done': '#3FB950',
};

const PRIORITY_COLORS = {
  'low': '#3FB950',
  'medium': '#F5A623',
  'high': '#F85149',
  'urgent': '#FF0000',
};

const EMPTY_FORM = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', tags: '' };

const HRMSWorkflow = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const r = await hrmsEmployeeAPI.getMyWorkItems();
      setItems(r.data);
    } catch { }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title,
      description: item.description || '',
      status: item.status,
      priority: item.priority,
      dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
      tags: (item.tags || []).join(', '),
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        dueDate: form.dueDate || null,
      };
      if (editing) await hrmsEmployeeAPI.updateWorkItem(editing, data);
      else await hrmsEmployeeAPI.createWorkItem(data);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await hrmsEmployeeAPI.deleteWorkItem(deleteId);
      setDeleteId(null);
      load();
    } catch { }
  };

  const quickStatusUpdate = async (id, newStatus) => {
    try {
      await hrmsEmployeeAPI.updateWorkItem(id, { status: newStatus });
      load();
    } catch { }
  };

  const filtered = filterStatus === 'all' ? items : items.filter(i => i.status === filterStatus);

  // Group by status for Kanban-like display
  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = items.filter(i => i.status === s);
    return acc;
  }, {});

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : null;

  return (
    <HRMSLayout title="My Workflow">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`hrms-filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >All ({items.length})</button>
          {STATUSES.map(s => (
            <button
              key={s}
              className={`hrms-filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              style={filterStatus === s ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
            >
              {STATUS_LABELS[s]} ({grouped[s].length})
            </button>
          ))}
        </div>
        <button className="hrms-btn hrms-btn-primary" onClick={openAdd}><FiPlus /> Add Task</button>
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="hrms-empty glass-card">
          No tasks found. <button className="hrms-link-btn" onClick={openAdd}>Add your first task →</button>
        </div>
      ) : (
        <div className="hrms-task-cards">
          {filtered.map(item => (
            <div key={item._id} className="hrms-task-card glass-card">
              <div className="hrms-task-card-top">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="hrms-badge" style={{ background: `${STATUS_COLORS[item.status]}20`, color: STATUS_COLORS[item.status] }}>
                    {STATUS_LABELS[item.status]}
                  </span>
                  <span className="hrms-badge" style={{ background: `${PRIORITY_COLORS[item.priority]}20`, color: PRIORITY_COLORS[item.priority] }}>
                    {item.priority}
                  </span>
                  {item.assignedBy === 'admin' && <span className="hrms-badge" style={{ background: '#58A6FF20', color: '#58A6FF' }}>Admin Assigned</span>}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="hrms-icon-btn" onClick={() => openEdit(item)} title="Edit"><FiEdit2 /></button>
                  <button className="hrms-icon-btn danger" onClick={() => setDeleteId(item._id)} title="Delete"><FiTrash2 /></button>
                </div>
              </div>

              <h4 className="hrms-task-title">{item.title}</h4>
              {item.description && <p className="hrms-task-desc">{item.description}</p>}

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {(item.tags || []).map(tag => (
                  <span key={tag} className="hrms-tag">{tag}</span>
                ))}
              </div>

              <div className="hrms-task-card-bottom">
                {item.dueDate && (
                  <span style={{ fontSize: '0.78rem', color: new Date(item.dueDate) < new Date() && item.status !== 'done' ? '#F85149' : 'var(--text-muted)' }}>
                    📅 Due: {formatDate(item.dueDate)}
                  </span>
                )}
                {/* Quick status next step */}
                {item.status !== 'done' && (
                  <button
                    className="hrms-btn hrms-btn-sm hrms-btn-outline"
                    onClick={() => {
                      const nextIdx = STATUSES.indexOf(item.status) + 1;
                      if (nextIdx < STATUSES.length) quickStatusUpdate(item._id, STATUSES[nextIdx]);
                    }}
                    title="Move to next stage"
                  >
                    → Move to {STATUS_LABELS[STATUSES[Math.min(STATUSES.indexOf(item.status) + 1, STATUSES.length - 1)]]}
                  </button>
                )}
                {item.status === 'done' && (
                  <span style={{ color: '#3FB950', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheck /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="hrms-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="hrms-modal" onClick={e => e.stopPropagation()}>
            <div className="hrms-modal-header">
              <h3>{editing ? 'Edit Task' : 'Add New Task'}</h3>
              <button className="hrms-icon-btn" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            {error && <div className="hrms-alert hrms-alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="hrms-form-group">
                <label>Task Title *</label>
                <input className="hrms-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="What needs to be done?" />
              </div>
              <div className="hrms-form-group">
                <label>Description</label>
                <textarea className="hrms-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="More details..." />
              </div>
              <div className="hrms-form-grid">
                <div className="hrms-form-group">
                  <label>Status</label>
                  <select className="hrms-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="hrms-form-group">
                  <label>Priority</label>
                  <select className="hrms-input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div className="hrms-form-group">
                  <label>Due Date</label>
                  <input type="date" className="hrms-input" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div className="hrms-form-group">
                  <label>Tags (comma separated)</label>
                  <input className="hrms-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g. frontend, urgent, client-x" />
                </div>
              </div>
              <div className="hrms-modal-actions">
                <button type="button" className="hrms-btn hrms-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="hrms-btn hrms-btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update Task' : 'Add Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="hrms-modal-overlay">
          <div className="hrms-modal" style={{ maxWidth: '380px' }}>
            <h4>Delete Task?</h4>
            <p style={{ color: 'var(--text-muted)', margin: '12px 0' }}>This action cannot be undone.</p>
            <div className="hrms-modal-actions">
              <button className="hrms-btn hrms-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="hrms-btn hrms-btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </HRMSLayout>
  );
};

export default HRMSWorkflow;
