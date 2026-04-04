import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicAPI } from '../api';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    publicAPI.getClients().then(res => setClients(res.data)).catch(console.error);
  }, []);

  const filtered = filter === 'all' ? clients : clients.filter(c => c.serviceType === filter);
  const featured = filtered.filter(c => c.isFeatured);
  const others = filtered.filter(c => !c.isFeatured);

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Our <span className="text-gradient">Clients</span></h1>
            <p className="page-hero-sub">Trusted by leading companies across industries</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-tabs">
            {['all', 'hr', 'software', 'both'].map(tab => (
              <button key={tab} className={`filter-tab ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
                {tab === 'all' ? 'All' : tab === 'hr' ? 'HR Clients' : tab === 'software' ? 'Software Clients' : 'Both'}
              </button>
            ))}
          </div>

          {featured.length > 0 && (
            <>
              <h3 style={{ marginBottom: 24, color: 'var(--primary)' }}>⭐ Top Clients</h3>
              <motion.div key={featured.length} className="grid grid-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: 48 }}>
                {featured.map(client => (
                  <motion.div key={client._id} className="client-card glass-card featured-client" variants={fadeUp}>
                    <div className="client-card-logo">
                      {client.logo ? <img src={`http://localhost:5000${client.logo}`} alt={client.name} /> : <span>{client.name.charAt(0)}</span>}
                    </div>
                    <h4>{client.name}</h4>
                    <span className="badge badge-primary">{client.industry}</span>
                    <p>{client.description}</p>
                    <span className={`badge ${client.serviceType === 'hr' ? 'badge-warning' : client.serviceType === 'software' ? 'badge-success' : 'badge-primary'}`}>
                      {client.serviceType === 'hr' ? 'HR' : client.serviceType === 'software' ? 'Software' : 'HR & Software'}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {others.length > 0 && (
            <motion.div key={others.length} className="grid grid-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {others.map(client => (
                <motion.div key={client._id} className="client-card glass-card" variants={fadeUp}>
                  <div className="client-card-logo">
                    {client.logo ? <img src={`http://localhost:5000${client.logo}`} alt={client.name} /> : <span>{client.name.charAt(0)}</span>}
                  </div>
                  <h4>{client.name}</h4>
                  <span className="badge badge-primary">{client.industry}</span>
                  <p>{client.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Clients;
