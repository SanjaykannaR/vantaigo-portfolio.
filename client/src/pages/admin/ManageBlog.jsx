import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ManageBlog = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', author: 'Vantaigo Team', category: 'Company Updates', tags: '', isPublished: false });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => adminAPI.getBlogPosts().then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags };
    if (editing) await adminAPI.updateBlogPost(editing, data); else await adminAPI.createBlogPost(data);
    setShowModal(false); setEditing(null); load();
  };
  const handleEdit = (i) => { setEditing(i._id); setForm({ ...i, tags: i.tags?.join(', ') || '' }); setShowModal(true); };
  const handleDelete = async () => { await adminAPI.deleteBlogPost(deleteId); setDeleteId(null); load(); };

  return (
    <AdminLayout title="Manage Blog">
      <div className="admin-toolbar"><p>{items.length} posts</p><button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ title: '', content: '', excerpt: '', author: 'Vantaigo Team', category: 'Company Updates', tags: '', isPublished: false }); setShowModal(true); }}><FiPlus /> New Post</button></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(i => (<tr key={i._id}><td><strong>{i.title}</strong><br/><small style={{color:'var(--text-muted)'}}>{i.slug}</small></td><td>{i.category}</td><td>{i.author}</td><td><span className={`badge ${i.isPublished ? 'badge-success' : 'badge-warning'}`}>{i.isPublished ? 'Published' : 'Draft'}</span></td><td className="actions"><button className="btn btn-sm btn-outline" onClick={() => handleEdit(i)}><FiEdit2 /></button><button className="btn btn-sm btn-danger" onClick={() => setDeleteId(i._id)}><FiTrash2 /></button></td></tr>))}</tbody></table></div>
      {showModal && (<div className="modal-overlay" onClick={() => setShowModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><h3>{editing ? 'Edit' : 'New'} Blog Post</h3><form onSubmit={handleSubmit}><div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div><div className="form-group"><label>Excerpt</label><input className="form-control" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} /></div><div className="form-group"><label>Content</label><textarea className="form-control" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required style={{minHeight:200}} /></div><div className="form-group"><label>Author</label><input className="form-control" value={form.author} onChange={e => setForm({...form, author: e.target.value})} /></div><div className="form-group"><label>Category</label><select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>HR Insights</option><option>Tech News</option><option>Company Updates</option></select></div><div className="form-group"><label>Tags (comma-separated)</label><input className="form-control" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div><div className="form-group"><label className="toggle"><input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} /><span className="toggle-slider" /></label> Published</div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button></div></form></div></div>)}
      {deleteId && (<div className="confirm-overlay"><div className="confirm-box"><h4>Delete Post?</h4><p>This cannot be undone.</p><div className="confirm-actions"><button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></div></div></div>)}
    </AdminLayout>
  );
};
export default ManageBlog;
