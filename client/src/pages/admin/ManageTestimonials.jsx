import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ManageTestimonials = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ clientName: '', designation: '', company: '', quote: '', rating: 5, isActive: true });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getTestimonials().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); if (editing) await adminAPI.updateTestimonial(editing, form); else await adminAPI.createTestimonial(form); setShowModal(false); setEditing(null); load(); };
  const handleEdit = (i) => { setEditing(i._id); setForm(i); setShowModal(true); };
  const handleDelete = async () => { await adminAPI.deleteTestimonial(deleteId); setDeleteId(null); load(); };

  return (
    <AdminLayout title="Manage Testimonials">
      <div className="admin-toolbar"><p>{items.length} testimonials</p><button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ clientName: '', designation: '', company: '', quote: '', rating: 5, isActive: true }); setShowModal(true); }}><FiPlus /> Add Testimonial</button></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Client</th><th>Company</th><th>Rating</th><th>Active</th><th>Actions</th></tr></thead><tbody>{items.map(i => (<tr key={i._id}><td><strong>{i.clientName}</strong><br/><small style={{color:'var(--text-muted)'}}>{i.designation}</small></td><td>{i.company}</td><td>{'⭐'.repeat(i.rating)}</td><td>{i.isActive ? '✅' : '❌'}</td><td className="actions"><button className="btn btn-sm btn-outline" onClick={() => handleEdit(i)}><FiEdit2 /></button><button className="btn btn-sm btn-danger" onClick={() => setDeleteId(i._id)}><FiTrash2 /></button></td></tr>))}</tbody></table></div>
      {showModal && (<div className="modal-overlay" onClick={() => setShowModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><h3>{editing ? 'Edit' : 'Add'} Testimonial</h3><form onSubmit={handleSubmit}><div className="form-group"><label>Client Name</label><input className="form-control" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required /></div><div className="form-group"><label>Designation</label><input className="form-control" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} /></div><div className="form-group"><label>Company</label><input className="form-control" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div><div className="form-group"><label>Quote</label><textarea className="form-control" value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} required /></div><div className="form-group"><label>Rating (1-5)</label><input className="form-control" type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})} /></div><div className="form-group"><label className="toggle"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /><span className="toggle-slider" /></label> Active</div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button></div></form></div></div>)}
      {deleteId && (<div className="confirm-overlay"><div className="confirm-box"><h4>Delete Testimonial?</h4><p>This cannot be undone.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></div></div></div>)}
    </AdminLayout>
  );
};
export default ManageTestimonials;
