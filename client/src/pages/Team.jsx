import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { publicAPI } from '../api';
import './Pages.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Team = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    publicAPI.getTeam().then(res => setMembers(res.data)).catch(console.error);
  }, []);

  const departments = [...new Set(members.map(m => m.department))];

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Our <span className="text-gradient">Team</span></h1>
            <p className="page-hero-sub">Meet the talented people behind Vantaigo's success</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {departments.map(dept => (
            <div key={dept} className="team-department">
              <h3 className="department-title">{dept}</h3>
              <motion.div key={members.length} className="grid grid-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {members.filter(m => m.department === dept).map(member => (
                  <motion.div key={member._id} className="team-card glass-card" variants={fadeUp}>
                    <div className="team-avatar">
                      {member.photo ? <img src={`http://localhost:5000${member.photo}`} alt={member.name} /> : <span>{member.name.charAt(0)}</span>}
                    </div>
                    <h4>{member.name}</h4>
                    <p className="team-designation">{member.designation}</p>
                    <p className="team-bio">{member.bio}</p>
                    <div className="team-social">
                      {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><FiLinkedin /></a>}
                      {member.socialLinks?.twitter && <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><FiTwitter /></a>}
                      {member.socialLinks?.email && <a href={`mailto:${member.socialLinks.email}`}><FiMail /></a>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;
