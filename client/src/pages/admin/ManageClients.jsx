import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ManageClients = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', industry: '', description: '', serviceType: 'both', isFeatured: false, website: '', order: 0 });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getClients().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await adminAPI.updateClient(editing, form);
    else await adminAPI.createClient(form);
    setShowModal(false); setEditing(null); setForm({ name: '', industry: '', description: '', serviceType: 'both', isFeatured: false, website: '', order: 0 });
    load();
  };

  const handleEdit = (item) => { setEditing(item._id); setForm(item); setShowModal(true); };
  const handleDelete = async () => { await adminAPI.deleteClient(deleteId); setDeleteId(null); load(); };

  return (
    <AdminLayout title="Manage Clients">
      <div className="admin-toolbar">
        <p>{items.length} clients total</p>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', industry: '', description: '', serviceType: 'both', isFeatured: false, website: '', order: 0 }); setShowModal(true); }}><FiPlus /> Add Client</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Industry</th><th>Type</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td><strong>{item.name}</strong></td>
                <td>{item.industry}</td>
                <td><span className="badge badge-primary">{item.serviceType}</span></td>
                <td>{item.isFeatured ? '⭐' : '—'}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(item)}><FiEdit2 /></button>
                  <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(item._id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Client' : 'Add Client'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Industry</label><input className="form-control" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="form-group"><label>Service Type</label><select className="form-control" value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})}><option value="hr">HR</option><option value="software">Software</option><option value="both">Both</option></select></div>
              <div className="form-group"><label>Website</label><input className="form-control" value={form.website} onChange={e => setForm({...form, website: e.target.value})} /></div>
              <div className="form-group"><label className="toggle"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /><span className="toggle-slider" /></label> Featured</div>
              <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="confirm-overlay"><div className="confirm-box"><h4>Delete Client?</h4><p>This action cannot be undone.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></div></div></div>
      )}
    </AdminLayout>
  );
};

export default ManageClients;
