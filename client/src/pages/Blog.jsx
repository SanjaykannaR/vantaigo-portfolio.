import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');

  useEffect(() => {
    publicAPI.getBlogPosts({ page, category: category || undefined })
      .then(res => { setPosts(res.data.posts); setTotalPages(res.data.totalPages); })
      .catch(console.error);
  }, [page, category]);

  const categories = ['HR Insights', 'Tech News', 'Company Updates'];

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Our <span className="text-gradient">Blog</span></h1>
            <p className="page-hero-sub">Insights, news, and stories from the Vantaigo team</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-tabs">
            <button className={`filter-tab ${!category ? 'active' : ''}`} onClick={() => { setCategory(''); setPage(1); }}>All</button>
            {categories.map(cat => (
              <button key={cat} className={`filter-tab ${category === cat ? 'active' : ''}`} onClick={() => { setCategory(cat); setPage(1); }}>{cat}</button>
            ))}
          </div>

          <motion.div key={posts.length} className="grid grid-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {posts.map(post => (
              <motion.div key={post._id} className="blog-card glass-card" variants={fadeUp}>
                {post.thumbnail && (
                  <div className="blog-card-thumbnail">
                    <img src={`http://localhost:5000${post.thumbnail}`} alt={post.title} />
                  </div>
                )}
                <div className="blog-card-body">
                  <span className="badge badge-primary">{post.category}</span>
                  <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt || post.content.substring(0, 120)}...</p>
                  <div className="blog-card-meta">
                    <span><FiUser /> {post.author}</span>
                    <span><FiCalendar /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="btn btn-sm btn-outline">Read More</Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
