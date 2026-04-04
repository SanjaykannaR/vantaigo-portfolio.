import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiArrowRight } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeMsg, setSubscribeMsg] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await publicAPI.subscribeNewsletter({ email });
      setSubscribeMsg(res.data.message);
      setEmail('');
    } catch (err) {
      setSubscribeMsg(err.response?.data?.message || 'Something went wrong');
    }
    setSubscribing(false);
    setTimeout(() => setSubscribeMsg(''), 4000);
  };

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="Vantaigo" />
              <div>
                <h3>Vantaigo</h3>
                <span>Software Solutions Pvt. Ltd.</span>
              </div>
            </Link>
            <p>Empowering businesses with strategic HR consultancy and cutting-edge software solutions since day one.</p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/clients">Our Clients</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <Link to="/services">Talent Acquisition</Link>
            <Link to="/services">HR Compliance</Link>
            <Link to="/services">Payroll Management</Link>
            <Link to="/services">Custom Software</Link>
            <Link to="/services">Mobile Apps</Link>
            <Link to="/services">Cloud Solutions</Link>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Stay updated with our latest news and insights.</p>
            <form className="footer-newsletter" onSubmit={handleSubscribe} id="footer-newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={subscribing} aria-label="Subscribe">
                <FiArrowRight />
              </button>
            </form>
            {subscribeMsg && <p className="footer-subscribe-msg">{subscribeMsg}</p>}
            <div className="footer-contact-info">
              <div><FiMail /> <span>info@vantaigo.com</span></div>
              <div><FiPhone /> <span>+91 9876543210</span></div>
              <div><FiMapPin /> <span>Hyderabad, India</span></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 - {new Date().getFullYear()} Vantaigo Software Solutions Pvt. Ltd. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
