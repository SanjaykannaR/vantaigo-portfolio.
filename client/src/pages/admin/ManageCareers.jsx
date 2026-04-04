import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ManageCareers = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', department: 'Engineering', location: '', type: 'full-time', experience: '', description: '', requirements: '', responsibilities: '', salary: '', applyEmail: 'careers@vantaigo.com', isActive: true });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getCareers().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, requirements: typeof form.requirements === 'string' ? form.requirements.split('\n').filter(Boolean) : form.requirements, responsibilities: typeof form.responsibilities === 'string' ? form.responsibilities.split('\n').filter(Boolean) : form.responsibilities };
    if (editing) await adminAPI.updateCareer(editing, data); else await adminAPI.createCareer(data);
    setShowModal(false); setEditing(null); load();
  };
  const handleEdit = (i) => { setEditing(i._id); setForm({ ...i, requirements: i.requirements?.join('\n') || '', responsibilities: i.responsibilities?.join('\n') || '' }); setShowModal(true); };
  const handleDelete = async () => { await adminAPI.deleteCareer(deleteId); setDeleteId(null); load(); };

  return (
    <AdminLayout title="Manage Careers">
      <div className="admin-toolbar"><p>{items.length} listings</p><button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ title: '', department: 'Engineering', location: '', type: 'full-time', experience: '', description: '', requirements: '', responsibilities: '', salary: '', applyEmail: 'careers@vantaigo.com', isActive: true }); setShowModal(true); }}><FiPlus /> Add Job</button></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Active</th><th>Actions</th></tr></thead><tbody>{items.map(i => (<tr key={i._id}><td><strong>{i.title}</strong></td><td>{i.department}</td><td>{i.location}</td><td><span className="badge badge-primary">{i.type}</span></td><td>{i.isActive ? '✅' : '❌'}</td><td className="actions"><button className="btn btn-sm btn-outline" onClick={() => handleEdit(i)}><FiEdit2 /></button><button className="btn btn-sm btn-danger" onClick={() => setDeleteId(i._id)}><FiTrash2 /></button></td></tr>))}</tbody></table></div>
      {showModal && (<div className="modal-overlay" onClick={() => setShowModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><h3>{editing ? 'Edit' : 'Add'} Job Listing</h3><form onSubmit={handleSubmit}><div className="form-group"><label>Job Title</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div><div className="form-group"><label>Department</label><select className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})}><option>Engineering</option><option>HR</option><option>Marketing</option><option>Operations</option><option>Design</option></select></div><div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Hyderabad, India" /></div><div className="form-group"><label>Type</label><select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="full-time">Full Time</option><option value="part-time">Part Time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></div><div className="form-group"><label>Experience</label><input className="form-control" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="3-5 years" /></div><div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div><div className="form-group"><label>Requirements (one per line)</label><textarea className="form-control" value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} /></div><div className="form-group"><label>Responsibilities (one per line)</label><textarea className="form-control" value={form.responsibilities} onChange={e => setForm({...form, responsibilities: e.target.value})} /></div><div className="form-group"><label>Salary</label><input className="form-control" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="₹8-15 LPA" /></div><div className="form-group"><label>Apply Email</label><input className="form-control" value={form.applyEmail} onChange={e => setForm({...form, applyEmail: e.target.value})} /></div><div className="form-group"><label className="toggle"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /><span className="toggle-slider" /></label> Active</div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button></div></form></div></div>)}
      {deleteId && (<div className="confirm-overlay"><div className="confirm-box"><h4>Delete Job?</h4><p>This cannot be undone.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></div></div></div>)}
    </AdminLayout>
  );
};
export default ManageCareers;
