import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ManageServices = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'hr', features: '', icon: 'FiCode', order: 0 });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getServices().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, features: typeof form.features === 'string' ? form.features.split(',').map(f => f.trim()).filter(Boolean) : form.features };
    if (editing) await adminAPI.updateService(editing, data); else await adminAPI.createService(data);
    setShowModal(false); setEditing(null); load();
  };
  const handleEdit = (item) => { setEditing(item._id); setForm({ ...item, features: item.features?.join(', ') || '' }); setShowModal(true); };
  const handleDelete = async () => { await adminAPI.deleteService(deleteId); setDeleteId(null); load(); };

  return (
    <AdminLayout title="Manage Services">
      <div className="admin-toolbar"><p>{items.length} services</p><button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ title: '', description: '', category: 'hr', features: '', icon: 'FiCode', order: 0 }); setShowModal(true); }}><FiPlus /> Add Service</button></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Category</th><th>Features</th><th>Actions</th></tr></thead><tbody>{items.map(i => (<tr key={i._id}><td><strong>{i.title}</strong></td><td><span className={`badge ${i.category==='hr' ? 'badge-primary' : 'badge-success'}`}>{i.category}</span></td><td>{i.features?.length || 0}</td><td className="actions"><button className="btn btn-sm btn-outline" onClick={() => handleEdit(i)}><FiEdit2 /></button><button className="btn btn-sm btn-danger" onClick={() => setDeleteId(i._id)}><FiTrash2 /></button></td></tr>))}</tbody></table></div>
      {showModal && (<div className="modal-overlay" onClick={() => setShowModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><h3>{editing ? 'Edit' : 'Add'} Service</h3><form onSubmit={handleSubmit}><div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div><div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div><div className="form-group"><label>Category</label><select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="hr">HR</option><option value="software">Software</option></select></div><div className="form-group"><label>Features (comma-separated)</label><input className="form-control" value={form.features} onChange={e => setForm({...form, features: e.target.value})} /></div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button></div></form></div></div>)}
      {deleteId && (<div className="confirm-overlay"><div className="confirm-box"><h4>Delete Service?</h4><p>This cannot be undone.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></div></div></div>)}
    </AdminLayout>
  );
};
export default ManageServices;
