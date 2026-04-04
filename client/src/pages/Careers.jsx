import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiBriefcase, FiChevronDown, FiChevronUp, FiMail } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    publicAPI.getCareers().then(res => setCareers(res.data)).catch(console.error);
  }, []);

  const departments = [...new Set(careers.map(c => c.department))];
  const filtered = deptFilter === 'all' ? careers : careers.filter(c => c.department === deptFilter);

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Join Our <span className="text-gradient">Team</span></h1>
            <p className="page-hero-sub">Explore exciting career opportunities at Vantaigo</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-tabs">
            <button className={`filter-tab ${deptFilter === 'all' ? 'active' : ''}`} onClick={() => setDeptFilter('all')}>All Departments</button>
            {departments.map(dept => (
              <button key={dept} className={`filter-tab ${deptFilter === dept ? 'active' : ''}`} onClick={() => setDeptFilter(dept)}>{dept}</button>
            ))}
          </div>

          <motion.div key={filtered.length} className="careers-list" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {filtered.map(career => (
              <motion.div key={career._id} className="career-card glass-card" variants={fadeUp}>
                <div className="career-card-header" onClick={() => setExpanded(expanded === career._id ? null : career._id)}>
                  <div className="career-card-info">
                    <h3>{career.title}</h3>
                    <div className="career-card-tags">
                      <span className="career-tag"><FiBriefcase /> {career.type}</span>
                      <span className="career-tag"><FiMapPin /> {career.location}</span>
                      <span className="career-tag"><FiClock /> {career.experience || 'Any'}</span>
                      <span className="badge badge-primary">{career.department}</span>
                    </div>
                  </div>
                  <button className="career-expand">
                    {expanded === career._id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                {expanded === career._id && (
                  <motion.div className="career-card-body" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <p>{career.description}</p>
                    {career.requirements?.length > 0 && (
                      <div className="career-list-section">
                        <h4>Requirements</h4>
                        <ul>{career.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    )}
                    {career.responsibilities?.length > 0 && (
                      <div className="career-list-section">
                        <h4>Responsibilities</h4>
                        <ul>{career.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    )}
                    {career.salary && <p className="career-salary">💰 Salary: {career.salary}</p>}
                    <a href={`mailto:${career.applyEmail || 'careers@vantaigo.com'}?subject=Application for ${career.title}`} className="btn btn-primary">
                      <FiMail /> Apply Now
                    </a>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 60 }}>No open positions in this department right now.</p>}
        </div>
      </section>
    </div>
  );
};

export default Careers;
