import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiUsers, FiCode, FiAward, FiTrendingUp, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Counter = ({ end, label, icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <motion.div className="stat-card glass-card" ref={ref} variants={fadeUp}>
      <div className="stat-icon">{icon}</div>
      <h3 className="stat-number text-gradient">{count}+</h3>
      <p>{label}</p>
    </motion.div>
  );
};

const Home = () => {
  const [config, setConfig] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, clientsRes, projectsRes, servicesRes, testimonialsRes] = await Promise.all([
          publicAPI.getSiteConfig(),
          publicAPI.getClients({ isFeatured: true }),
          publicAPI.getProjects({ isFeatured: true }),
          publicAPI.getServices(),
          publicAPI.getTestimonials(),
        ]);
        setConfig(configRes.data);
        setClients(clientsRes.data);
        setProjects(projectsRes.data);
        setServices(servicesRes.data);
        setTestimonials(testimonialsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const hrServices = services.filter(s => s.category === 'hr').slice(0, 4);
  const swServices = services.filter(s => s.category === 'software').slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid-lines" />
        </div>
        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="hero-badge">
              <FiAward /> Trusted by 50+ Companies
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {config?.heroTitle || 'Empowering Businesses with'}{' '}
            <span className="text-gradient">HR & Software Solutions</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {config?.heroSubtitle || 'Your trusted partner for talent acquisition, HR consultancy, and cutting-edge software development.'}
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/services" className="btn btn-primary btn-lg" id="hero-cta-services">
              Our Services <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg" id="hero-cta-contact">
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section" id="stats-section">
        <div className="container">
          <motion.div className="stats-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Counter end={config?.stats?.clientsCount || 50} label="Happy Clients" icon={<FiUsers />} />
            <Counter end={config?.stats?.projectsCount || 120} label="Projects Delivered" icon={<FiCode />} />
            <Counter end={config?.stats?.yearsExperience || 5} label="Years Experience" icon={<FiAward />} />
            <Counter end={config?.stats?.teamMembers || 30} label="Team Members" icon={<FiTrendingUp />} />
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section services-overview" id="services-overview">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="accent-line" />
            <h2>What We Do</h2>
            <p>Comprehensive HR consultancy and software solutions under one roof</p>
          </motion.div>

          <div className="services-split">
            <motion.div className="services-column" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="services-column-header">
                <FiUsers className="services-column-icon" />
                <h3>HR Consultancy</h3>
              </div>
              {hrServices.map(service => (
                <motion.div key={service._id} className="service-mini-card glass-card" variants={fadeUp}>
                  <h4>{service.title}</h4>
                  <p>{service.description.substring(0, 100)}...</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="services-column" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="services-column-header">
                <FiCode className="services-column-icon" />
                <h3>Software Solutions</h3>
              </div>
              {swServices.map(service => (
                <motion.div key={service._id} className="service-mini-card glass-card" variants={fadeUp}>
                  <h4>{service.title}</h4>
                  <p>{service.description.substring(0, 100)}...</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div className="text-center" style={{ marginTop: 40 }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link to="/services" className="btn btn-outline">View All Services <FiArrowRight /></Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Clients */}
      <section className="section clients-section" id="featured-clients">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="accent-line" />
            <h2>Trusted By Industry Leaders</h2>
            <p>Companies that trust us with their HR and technology needs</p>
          </motion.div>
          <motion.div className="clients-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {clients.map(client => (
              <motion.div key={client._id} className="client-logo-card glass-card" variants={fadeUp}>
                <div className="client-logo-placeholder">
                  {client.logo ? <img src={`http://localhost:5000${client.logo}`} alt={client.name} /> : <span>{client.name.charAt(0)}</span>}
                </div>
                <h4>{client.name}</h4>
                <span className="badge badge-primary">{client.industry}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="text-center" style={{ marginTop: 40 }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link to="/clients" className="btn btn-outline">View All Clients <FiArrowRight /></Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section projects-section" id="featured-projects">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="accent-line" />
            <h2>Our Recent Work</h2>
            <p>Software solutions we've built for our amazing clients</p>
          </motion.div>
          <motion.div className="grid grid-2" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {projects.slice(0, 4).map(project => (
              <motion.div key={project._id} className="project-card glass-card" variants={fadeUp}>
                <div className="project-card-header">
                  <span className={`badge ${project.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {project.status}
                  </span>
                  <span className="badge badge-primary">{project.category}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description.substring(0, 150)}...</p>
                <div className="project-tech">
                  {project.technologies?.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <span className="project-client">Client: {project.client || 'Confidential'}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="text-center" style={{ marginTop: 40 }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link to="/projects" className="btn btn-outline">View All Projects <FiArrowRight /></Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section testimonials-section" id="testimonials-section">
          <div className="container">
            <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="accent-line" />
              <h2>What Our Clients Say</h2>
              <p>Hear from the companies we've helped succeed</p>
            </motion.div>
            <div className="testimonial-carousel">
              <button className="testimonial-nav" onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}>
                <FiChevronLeft />
              </button>
              <div className="testimonial-slide glass-card">
                <div className="testimonial-stars">
                  {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                    <FiStar key={i} className="star-filled" />
                  ))}
                </div>
                <blockquote>"{testimonials[currentTestimonial]?.quote}"</blockquote>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonials[currentTestimonial]?.clientName?.charAt(0)}
                  </div>
                  <div>
                    <h4>{testimonials[currentTestimonial]?.clientName}</h4>
                    <p>{testimonials[currentTestimonial]?.designation}, {testimonials[currentTestimonial]?.company}</p>
                  </div>
                </div>
              </div>
              <button className="testimonial-nav" onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}>
                <FiChevronRight />
              </button>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button key={i} className={`dot ${i === currentTestimonial ? 'active' : ''}`} onClick={() => setCurrentTestimonial(i)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section cta-section" id="cta-section">
        <div className="container">
          <motion.div className="cta-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2>Ready to Transform Your Business?</h2>
            <p>Let's discuss how our HR consultancy and software solutions can help you grow.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Get Started <FiArrowRight />
              </Link>
              <Link to="/services" className="btn btn-outline btn-lg">
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
