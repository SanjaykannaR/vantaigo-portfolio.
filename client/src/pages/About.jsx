import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart, FiCheckCircle } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const About = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    publicAPI.getSiteConfig().then(res => setConfig(res.data)).catch(console.error);
  }, []);

  const milestones = [
    { year: '2020', title: 'Founded', desc: 'Vantaigo Software Solutions was established with a vision to bridge HR and technology.' },
    { year: '2021', title: 'First Major Client', desc: 'Secured our first enterprise client and delivered a comprehensive ERP solution.' },
    { year: '2022', title: 'Team Growth', desc: 'Expanded to 20+ team members across HR and engineering departments.' },
    { year: '2023', title: '50+ Clients', desc: 'Reached the milestone of serving over 50 clients across multiple industries.' },
    { year: '2024', title: 'Pan-India Presence', desc: 'Extended operations to serve clients across all major Indian cities.' },
    { year: '2025', title: 'Innovation Hub', desc: 'Launched AI-powered solutions for HR analytics and software automation.' },
  ];

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1>About <span className="text-gradient">Vantaigo</span></h1>
            <p className="page-hero-sub">Discover our story, mission, and the values that drive us forward</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story-grid">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2>Our Story</h2>
              <p className="about-text">{config?.aboutText || 'Vantaigo Software Solutions Private Limited is a leading provider of HR consultancy and custom software solutions. We help businesses scale their operations through strategic talent management and innovative technology.'}</p>
              <p className="about-text">With a blend of HR expertise and engineering prowess, we deliver comprehensive solutions that address both human capital and digital transformation needs — all under one roof.</p>
            </motion.div>
            <motion.div className="about-values" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {[
                { icon: <FiCheckCircle />, title: 'Excellence', desc: 'We deliver nothing less than the best.' },
                { icon: <FiHeart />, title: 'Integrity', desc: 'Honest, transparent partnerships.' },
                { icon: <FiTarget />, title: 'Innovation', desc: 'Cutting-edge solutions for modern challenges.' },
                { icon: <FiEye />, title: 'Client Focus', desc: 'Your success is our success.' },
              ].map((v, i) => (
                <div key={i} className="value-card glass-card">
                  <div className="value-icon">{v.icon}</div>
                  <div>
                    <h4>{v.title}</h4>
                    <p>{v.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="mv-grid">
            <motion.div className="mv-card glass-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mv-icon"><FiTarget /></div>
              <h3>Our Mission</h3>
              <p>{config?.aboutMission || 'To empower organizations with the right talent and technology solutions that drive growth, efficiency, and innovation.'}</p>
            </motion.div>
            <motion.div className="mv-card glass-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mv-icon"><FiEye /></div>
              <h3>Our Vision</h3>
              <p>{config?.aboutVision || 'To be the most trusted partner for HR and software solutions across industries, recognized for our commitment to excellence and client success.'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="accent-line" />
            <h2>Our Journey</h2>
          </motion.div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="timeline-content glass-card">
                  <span className="timeline-year">{m.year}</span>
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
