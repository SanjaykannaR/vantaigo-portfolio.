import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ManageTeam = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', designation: '', department: 'General', bio: '', isActive: true, order: 0 });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getTeam().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); if (editing) await adminAPI.updateTeamMember(editing, form); else await adminAPI.createTeamMember(form); setShowModal(false); setEditing(null); load(); };
  const handleEdit = (i) => { setEditing(i._id); setForm(i); setShowModal(true); };
  const handleDelete = async () => { await adminAPI.deleteTeamMember(deleteId); setDeleteId(null); load(); };

  return (
    <AdminLayout title="Manage Team">
      <div className="admin-toolbar"><p>{items.length} members</p><button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', designation: '', department: 'General', bio: '', isActive: true, order: 0 }); setShowModal(true); }}><FiPlus /> Add Member</button></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Designation</th><th>Department</th><th>Active</th><th>Actions</th></tr></thead><tbody>{items.map(i => (<tr key={i._id}><td><strong>{i.name}</strong></td><td>{i.designation}</td><td>{i.department}</td><td>{i.isActive ? '✅' : '❌'}</td><td className="actions"><button className="btn btn-sm btn-outline" onClick={() => handleEdit(i)}><FiEdit2 /></button><button className="btn btn-sm btn-danger" onClick={() => setDeleteId(i._id)}><FiTrash2 /></button></td></tr>))}</tbody></table></div>
      {showModal && (<div className="modal-overlay" onClick={() => setShowModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><h3>{editing ? 'Edit' : 'Add'} Team Member</h3><form onSubmit={handleSubmit}><div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div><div className="form-group"><label>Designation</label><input className="form-control" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} required /></div><div className="form-group"><label>Department</label><select className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})}><option>Leadership</option><option>Engineering</option><option>HR</option><option>Marketing</option><option>General</option></select></div><div className="form-group"><label>Bio</label><textarea className="form-control" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /></div><div className="form-group"><label className="toggle"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /><span className="toggle-slider" /></label> Active</div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button></div></form></div></div>)}
      {deleteId && (<div className="confirm-overlay"><div className="confirm-box"><h4>Delete Member?</h4><p>This cannot be undone.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></div></div></div>)}
    </AdminLayout>
  );
};
export default ManageTeam;
