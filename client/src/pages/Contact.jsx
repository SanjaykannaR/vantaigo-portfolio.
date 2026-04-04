import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you! Your message has been received. We\'ll get back to you soon.');
    setForm({ name: '', email: '', phone: '', service: '', message: '' });
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Get In <span className="text-gradient">Touch</span></h1>
            <p className="page-hero-sub">Let's discuss how we can help your business grow</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <motion.form className="contact-form glass-card" onSubmit={handleSubmit} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="contact-form">
              <h3>Send us a Message</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Interested In</label>
                  <select className="form-control" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                    <option value="">Select a service</option>
                    <option value="hr">HR Consultancy</option>
                    <option value="software">Software Development</option>
                    <option value="both">Both</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" placeholder="Tell us about your project or requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <FiSend /> Send Message
              </button>
              {status && <p className="form-status">{status}</p>}
            </motion.form>

            <motion.div className="contact-info" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="contact-info-card glass-card">
                <FiMail className="contact-info-icon" />
                <h4>Email Us</h4>
                <p>vantaigosoftware@outlook.com</p>
              </div>
              <div className="contact-info-card glass-card">
                <FiPhone className="contact-info-icon" />
                <h4>Call Us</h4>
                <p>+91 9629897489</p>
              </div>
              <div className="contact-info-card glass-card">
                <FiMapPin className="contact-info-icon" />
                <h4>Visit Us</h4>
                <p>India</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
