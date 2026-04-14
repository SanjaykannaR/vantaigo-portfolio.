import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiKey, FiUser, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi';

const EMPTY_FORM = {
  employeeId: '', name: '', email: '', phone: '',
  department: '', designation: '', password: '', isActive: true,
};

const ManageEmployees = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [resetId, setResetId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successPassword, setSuccessPassword] = useState(null);

  const load = async () => {
    try {
      const r = await adminAPI.getEmployees();
      setItems(r.data);
    } catch (e) { console.error(e); }
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
      employeeId: item.employeeId,
      name: item.name,
      email: item.email || '',
      phone: item.phone || '',
      department: item.department || '',
      designation: item.designation || '',
      password: '',
      isActive: item.isActive,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = { ...form };
      if (editing && !data.password) delete data.password;
      if (editing) await adminAPI.updateEmployee(editing, data);
      else await adminAPI.createEmployee(data);
      setShowModal(false);
      load();
      setSuccess(editing ? 'Employee updated!' : 'Employee created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteEmployee(deleteId);
      setDeleteId(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword && newPassword.length < 6) {
      setError('Password must be at least 6 characters if provided manually');
      return;
    }
    try {
      setLoading(true);
      const payload = newPassword ? { newPassword } : {};
      const res = await adminAPI.resetEmployeePassword(resetId, payload);
      const finalPass = res.data.newPassword || newPassword;
      setSuccessPassword(finalPass);
      // Wait to close the modal until they copy it
      setNewPassword('');
      load();
      setSuccess('Password reset successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await adminAPI.updateEmployee(item._id, { ...item, isActive: !item.isActive });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout title="Manage Employees">
      {success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{success}</div>}

      <div className="admin-toolbar">
        <p>{items.length} employees total · {items.filter(e => e.isActive).length} active</p>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Employee</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Contact</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No employees yet. Add your first employee to enable HRMS login.</td></tr>
            )}
            {items.map(item => (
              <tr key={item._id}>
                <td><code style={{ background: 'var(--bg-glass)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, color: 'var(--primary)' }}>{item.employeeId}</code></td>
                <td>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.name}
                    {item.passwordResetRequested && (
                      <span className="badge" style={{ background: 'rgba(248,81,73,0.15)', color: '#F85149', fontSize: '0.65rem', padding: '2px 6px' }}>Reset Req!</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.email}</div>
                </td>
                <td>{item.department || '—'}</td>
                <td>{item.designation || '—'}</td>
                <td style={{ fontSize: '0.82rem' }}>{item.phone || '—'}</td>
                <td style={{ fontSize: '0.82rem' }}>{formatDate(item.joinDate)}</td>
                <td>
                  <button className="icon-btn" onClick={() => toggleActive(item)} title={item.isActive ? 'Deactivate' : 'Activate'}>
                    {item.isActive
                      ? <FiToggleRight style={{ color: '#3FB950', fontSize: '1.4rem' }} />
                      : <FiToggleLeft style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }} />}
                  </button>
                </td>
                <td className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(item)} title="Edit"><FiEdit2 /></button>
                  <button className="btn btn-sm btn-outline" onClick={() => { setResetId(item._id); setNewPassword(''); setError(''); }} title="Reset Password"><FiKey /></button>
                  <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(item._id)} title="Delete"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiUser /> {editing ? 'Edit Employee' : 'Add Employee'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input className="form-control" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value.toUpperCase() })} required placeholder="e.g. EMP001" disabled={!!editing} />
                  {editing && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Employee ID cannot be changed</p>}
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Employee full name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="employee@vantaigo.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input className="form-control" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="e.g. HR, Engineering, Sales" />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input className="form-control" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="e.g. HR Manager, Senior Developer" />
                </div>
                <div className="form-group">
                  <label>{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <input className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editing} placeholder="Minimum 6 characters" minLength={editing ? 0 : 6} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
                  <label className="toggle">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                    <span className="toggle-slider" />
                  </label>
                  <span>Active Account</span>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update Employee' : 'Create Employee')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetId && (
        <div className="modal-overlay" onClick={() => { if (!successPassword) setResetId(null); }}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiKey /> Reset Password</h3>
              {!successPassword && <button className="modal-close" onClick={() => setResetId(null)}><FiX /></button>}
            </div>
            
            {successPassword ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <p style={{ marginBottom: '16px', color: 'var(--primary)' }}>Password has been reset successfully!</p>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>Temporary Password</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    className="form-control" 
                    readOnly 
                    value={successPassword} 
                    style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px', background: 'rgba(43,165,165,0.05)' }} 
                  />
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      navigator.clipboard.writeText(successPassword);
                      setSuccessPassword(null);
                      setResetId(null);
                    }}
                  >
                    Copy & Close
                  </button>
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Share this password securely with the employee.</p>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-group">
                  <label>New Password (Leave blank to auto-generate)</label>
                  <input className="form-control" type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Auto-generates 8 chars..." />
                </div>
                <div className="modal-actions">
                  <button className="btn btn-outline" onClick={() => setResetId(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleResetPassword} disabled={loading}>
                    {loading ? 'Processing...' : <><FiKey /> Reset Password</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h4>Delete Employee?</h4>
            <p>This will permanently delete the employee account and all their attendance & work records.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageEmployees;
