import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ManageProjects = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', client: '', technologies: '', category: 'Web App', status: 'completed', isFeatured: false });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getProjects().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, technologies: typeof form.technologies === 'string' ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : form.technologies };
    if (editing) await adminAPI.updateProject(editing, data);
    else await adminAPI.createProject(data);
    setShowModal(false); setEditing(null); load();
  };

  const handleEdit = (item) => { setEditing(item._id); setForm({ ...item, technologies: item.technologies?.join(', ') || '' }); setShowModal(true); };
  const handleDelete = async () => { await adminAPI.deleteProject(deleteId); setDeleteId(null); load(); };

  return (
    <AdminLayout title="Manage Projects">
      <div className="admin-toolbar">
        <p>{items.length} projects</p>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ title: '', description: '', client: '', technologies: '', category: 'Web App', status: 'completed', isFeatured: false }); setShowModal(true); }}><FiPlus /> Add Project</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Client</th><th>Category</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item._id}>
              <td><strong>{item.title}</strong></td><td>{item.client}</td><td>{item.category}</td>
              <td><span className={`badge ${item.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span></td>
              <td>{item.isFeatured ? '⭐' : '—'}</td>
              <td className="actions"><button className="btn btn-sm btn-outline" onClick={() => handleEdit(item)}><FiEdit2 /></button><button className="btn btn-sm btn-danger" onClick={() => setDeleteId(item._id)}><FiTrash2 /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Project' : 'Add Project'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="form-group"><label>Client</label><input className="form-control" value={form.client} onChange={e => setForm({...form, client: e.target.value})} /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
              <div className="form-group"><label>Technologies (comma-separated)</label><input className="form-control" value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} placeholder="React, Node.js, MongoDB" /></div>
              <div className="form-group"><label>Category</label><select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>Web App</option><option>Mobile App</option><option>ERP</option><option>API</option><option>Other</option></select></div>
              <div className="form-group"><label>Status</label><select className="form-control" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="completed">Completed</option><option value="ongoing">Ongoing</option></select></div>
              <div className="form-group"><label className="toggle"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /><span className="toggle-slider" /></label> Featured</div>
              <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
      {deleteId && (<div className="confirm-overlay"><div className="confirm-box"><h4>Delete Project?</h4><p>This cannot be undone.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></div></div></div>)}
    </AdminLayout>
  );
};

export default ManageProjects;
