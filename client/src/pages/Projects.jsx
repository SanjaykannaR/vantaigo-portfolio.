import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicAPI } from '../api';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    publicAPI.getProjects().then(res => setProjects(res.data)).catch(console.error);
  }, []);

  const categories = [...new Set(projects.map(p => p.category))];
  const filtered = projects.filter(p =>
    (statusFilter === 'all' || p.status === statusFilter) &&
    (categoryFilter === 'all' || p.category === categoryFilter)
  );

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Our <span className="text-gradient">Projects</span></h1>
            <p className="page-hero-sub">Explore the software solutions we've built for our clients</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-row">
            <div className="filter-tabs">
              {['all', 'completed', 'ongoing'].map(tab => (
                <button key={tab} className={`filter-tab ${statusFilter === tab ? 'active' : ''}`} onClick={() => setStatusFilter(tab)}>
                  {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="filter-tabs">
              <button className={`filter-tab ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>All Categories</button>
              {categories.map(cat => (
                <button key={cat} className={`filter-tab ${categoryFilter === cat ? 'active' : ''}`} onClick={() => setCategoryFilter(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          <motion.div key={filtered.length} className="grid grid-2" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {filtered.map(project => (
              <motion.div key={project._id} className="project-detail-card glass-card" variants={fadeUp}>
                {project.thumbnail && (
                  <div className="project-thumbnail">
                    <img src={`http://localhost:5000${project.thumbnail}`} alt={project.title} />
                  </div>
                )}
                <div className="project-detail-body">
                  <div className="project-card-header">
                    <span className={`badge ${project.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{project.status}</span>
                    <span className="badge badge-primary">{project.category}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.technologies?.map((tech, i) => <span key={i} className="tech-tag">{tech}</span>)}
                  </div>
                  <div className="project-footer">
                    <span>Client: {project.client || 'Confidential'}</span>
                    {project.completedDate && <span>Completed: {new Date(project.completedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
