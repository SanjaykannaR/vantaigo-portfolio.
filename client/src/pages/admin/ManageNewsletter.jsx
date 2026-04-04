import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiTrash2, FiDownload } from 'react-icons/fi';

const ManageNewsletter = () => {
  const [items, setItems] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getSubscribers().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleDelete = async () => { await adminAPI.deleteSubscriber(deleteId); setDeleteId(null); load(); };
  const handleExport = async () => {
    try {
      const res = await adminAPI.exportSubscribers();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'newsletter-subscribers.csv'; a.click();
    } catch (err) { console.error(err); }
  };

  return (
    <AdminLayout title="Newsletter Subscribers">
      <div className="admin-toolbar">
        <p>{items.length} subscribers</p>
        <button className="btn btn-primary" onClick={handleExport}><FiDownload /> Export CSV</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Email</th><th>Name</th><th>Subscribed</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{items.map(i => (
            <tr key={i._id}>
              <td>{i.email}</td>
              <td>{i.name || '—'}</td>
              <td>{new Date(i.subscribedAt).toLocaleDateString('en-IN')}</td>
              <td>{i.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Unsubscribed</span>}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => setDeleteId(i._id)}><FiTrash2 /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {deleteId && (<div className="confirm-overlay"><div className="confirm-box"><h4>Remove Subscriber?</h4><p>This will permanently remove them.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Remove</button></div></div></div>)}
    </AdminLayout>
  );
};
export default ManageNewsletter;
