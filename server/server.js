const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const testimonialRoutes = require('./routes/testimonials');
const blogRoutes = require('./routes/blog');
const teamRoutes = require('./routes/team');
const careerRoutes = require('./routes/careers');
const newsletterRoutes = require('./routes/newsletter');
const siteconfigRoutes = require('./routes/siteconfig');
const uploadRoutes = require('./routes/upload');
const resumeRoutes = require('./routes/resumes');
const hrmsRoutes = require('./routes/hrms');
const crmRoutes = require('./routes/crm');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images (public)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// NOTE: CRM files are in uploads/crm/ but are NOT accessible via this static route
// — they are served only through the auth-gated /api/crm/:id/files/:fileId/download endpoint

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/siteconfig', siteconfigRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/hrms', hrmsRoutes);
app.use('/api/crm', crmRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`📁 Resume uploads: /uploads/resumes/ (max 5MB)`);
  console.log(`🔒 CRM files: /uploads/crm/ (auth-gated access only)`);
});
