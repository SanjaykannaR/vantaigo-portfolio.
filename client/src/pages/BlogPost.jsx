import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowLeft, FiTag } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Pages.css';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getBlogPost(slug)
      .then(res => setPost(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="spinner" style={{ minHeight: '60vh' }} />;
  if (!post) return <div className="page-wrapper"><div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><h2>Post not found</h2><Link to="/blog" className="btn btn-outline" style={{ marginTop: 20 }}>Back to Blog</Link></div></div>;

  return (
    <div className="page-wrapper">
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <Link to="/blog" className="back-link"><FiArrowLeft /> Back to Blog</Link>
          <motion.article className="blog-post-article" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-primary">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="blog-post-meta">
              <span><FiUser /> {post.author}</span>
              <span><FiCalendar /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            {post.thumbnail && <img src={`http://localhost:5000${post.thumbnail}`} alt={post.title} className="blog-post-cover" />}
            <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            {post.tags?.length > 0 && (
              <div className="blog-post-tags">
                <FiTag /> {post.tags.map((tag, i) => <span key={i} className="tech-tag">{tag}</span>)}
              </div>
            )}
          </motion.article>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
