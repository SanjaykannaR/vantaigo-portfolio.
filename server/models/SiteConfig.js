const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: 'Empowering Businesses with HR & Software Solutions',
  },
  heroSubtitle: {
    type: String,
    default: 'Your trusted partner for talent acquisition, HR consultancy, and cutting-edge software development.',
  },
  aboutText: {
    type: String,
    default: 'Vantaigo Software Solutions Private Limited is a leading provider of HR consultancy and custom software solutions. We help businesses scale their operations through strategic talent management and innovative technology.',
  },
  aboutMission: {
    type: String,
    default: 'To empower organizations with the right talent and technology solutions that drive growth, efficiency, and innovation.',
  },
  aboutVision: {
    type: String,
    default: 'To be the most trusted partner for HR and software solutions across industries, recognized for our commitment to excellence and client success.',
  },
  contactEmail: {
    type: String,
    default: 'info@vantaigo.com',
  },
  contactPhone: {
    type: String,
    default: '+91 9876543210',
  },
  contactAddress: {
    type: String,
    default: 'Hyderabad, Telangana, India',
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  stats: {
    clientsCount: { type: Number, default: 50 },
    projectsCount: { type: Number, default: 120 },
    yearsExperience: { type: Number, default: 5 },
    teamMembers: { type: Number, default: 30 },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
