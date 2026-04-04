import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCode, FiShield, FiDollarSign, FiBookOpen, FiSmartphone, FiGrid, FiCloud, FiCheckCircle } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const iconMap = { FiUsers: <FiUsers />, FiCode: <FiCode />, FiShield: <FiShield />, FiDollarSign: <FiDollarSign />, FiBookOpen: <FiBookOpen />, FiSmartphone: <FiSmartphone />, FiGrid: <FiGrid />, FiCloud: <FiCloud /> };

const Services = () => {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    publicAPI.getServices().then(res => setServices(res.data)).catch(console.error);
  }, []);

  const filtered = activeTab === 'all' ? services : services.filter(s => s.category === activeTab);

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Our <span className="text-gradient">Services</span></h1>
            <p className="page-hero-sub">Comprehensive HR consultancy and software solutions tailored for your business</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-tabs">
            {['all', 'hr', 'software'].map(tab => (
              <button key={tab} className={`filter-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'all' ? 'All Services' : tab === 'hr' ? '🤝 HR Consultancy' : '💻 Software Solutions'}
              </button>
            ))}
          </div>

          <motion.div key={filtered.length} className="grid grid-2" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {filtered.map(service => (
              <motion.div key={service._id} className="service-card glass-card" variants={fadeUp}>
                <div className="service-card-icon">{iconMap[service.icon] || <FiCode />}</div>
                <div className="service-card-content">
                  <div className="service-card-top">
                    <h3>{service.title}</h3>
                    <span className={`badge ${service.category === 'hr' ? 'badge-primary' : 'badge-success'}`}>
                      {service.category === 'hr' ? 'HR' : 'Software'}
                    </span>
                  </div>
                  <p>{service.description}</p>
                  {service.features?.length > 0 && (
                    <ul className="service-features">
                      {service.features.map((f, i) => (
                        <li key={i}><FiCheckCircle /> {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
