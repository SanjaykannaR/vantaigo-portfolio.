const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const BlogPost = require('../models/BlogPost');
const TeamMember = require('../models/TeamMember');
const Career = require('../models/Career');
const SiteConfig = require('../models/SiteConfig');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Admin.deleteMany({}),
      Client.deleteMany({}),
      Project.deleteMany({}),
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
      BlogPost.deleteMany({}),
      TeamMember.deleteMany({}),
      Career.deleteMany({}),
      SiteConfig.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin
    await Admin.create({
      username: 'admin',
      email: 'admin@vantaigo.com',
      password: 'admin123',
    });
    console.log('👤 Admin user created (admin / admin123)');

    // Create site config
    await SiteConfig.create({});
    console.log('⚙️  Site config created');

    // Create services
    await Service.insertMany([
      {
        title: 'Talent Acquisition',
        description: 'End-to-end recruitment solutions to find the perfect talent for your organization. We handle everything from job profiling to onboarding.',
        icon: 'FiUsers',
        category: 'hr',
        features: ['Executive Search', 'Campus Recruitment', 'Contract Staffing', 'RPO Services'],
        order: 1,
      },
      {
        title: 'HR Compliance & Advisory',
        description: 'Navigate complex labor laws and regulations with our expert HR compliance services. Stay compliant and avoid penalties.',
        icon: 'FiShield',
        category: 'hr',
        features: ['Labor Law Compliance', 'Policy Development', 'HR Audits', 'Statutory Compliance'],
        order: 2,
      },
      {
        title: 'Payroll Management',
        description: 'Streamline your payroll operations with accurate, timely, and compliant payroll processing services.',
        icon: 'FiDollarSign',
        category: 'hr',
        features: ['Salary Processing', 'Tax Calculations', 'Payslip Generation', 'Statutory Filings'],
        order: 3,
      },
      {
        title: 'Training & Development',
        description: 'Upskill your workforce with customized training programs designed to boost productivity and employee satisfaction.',
        icon: 'FiBookOpen',
        category: 'hr',
        features: ['Leadership Development', 'Technical Training', 'Soft Skills', 'Compliance Training'],
        order: 4,
      },
      {
        title: 'Custom Software Development',
        description: 'Build tailored software solutions that perfectly fit your business needs. From concept to deployment, we handle it all.',
        icon: 'FiCode',
        category: 'software',
        features: ['Web Applications', 'Enterprise Software', 'API Development', 'Cloud Solutions'],
        order: 5,
      },
      {
        title: 'Mobile App Development',
        description: 'Create powerful mobile experiences for iOS and Android platforms that engage your users and drive business growth.',
        icon: 'FiSmartphone',
        category: 'software',
        features: ['iOS & Android Apps', 'Cross-Platform', 'UI/UX Design', 'App Maintenance'],
        order: 6,
      },
      {
        title: 'ERP Solutions',
        description: 'Implement comprehensive ERP systems to integrate and streamline your business processes across departments.',
        icon: 'FiGrid',
        category: 'software',
        features: ['ERP Implementation', 'Custom Modules', 'Data Migration', 'Support & Training'],
        order: 7,
      },
      {
        title: 'Cloud & DevOps',
        description: 'Leverage cloud infrastructure and DevOps practices to build scalable, reliable, and efficient systems.',
        icon: 'FiCloud',
        category: 'software',
        features: ['AWS/Azure/GCP', 'CI/CD Pipelines', 'Containerization', 'Infrastructure as Code'],
        order: 8,
      },
    ]);
    console.log('🛠️  Services created');

    // Create clients
    await Client.insertMany([
      { name: 'TechCorp Solutions', industry: 'Information Technology', description: 'Provided end-to-end talent acquisition and custom ERP solutions.', serviceType: 'both', isFeatured: true, order: 1 },
      { name: 'FinServe Bank', industry: 'Banking & Finance', description: 'HR compliance advisory and mobile banking application development.', serviceType: 'both', isFeatured: true, order: 2 },
      { name: 'HealthPlus Hospital', industry: 'Healthcare', description: 'Staffing solutions for medical professionals across 5 locations.', serviceType: 'hr', isFeatured: true, order: 3 },
      { name: 'RetailMax India', industry: 'Retail', description: 'Custom inventory management software and POS system development.', serviceType: 'software', isFeatured: true, order: 4 },
      { name: 'EduLearn Academy', industry: 'Education', description: 'Learning management system (LMS) development and faculty recruitment.', serviceType: 'both', isFeatured: false, order: 5 },
      { name: 'GreenEnergy Ltd', industry: 'Energy', description: 'Payroll management for 500+ employees across multiple states.', serviceType: 'hr', isFeatured: false, order: 6 },
    ]);
    console.log('🏢 Clients created');

    // Create projects
    await Project.insertMany([
      {
        title: 'Enterprise ERP System',
        description: 'A comprehensive ERP system with modules for HR, Finance, Inventory, and CRM. Built for TechCorp Solutions to manage their operations across 3 countries.',
        client: 'TechCorp Solutions',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
        category: 'ERP',
        status: 'completed',
        completedDate: new Date('2025-06-15'),
        isFeatured: true,
        order: 1,
      },
      {
        title: 'Mobile Banking App',
        description: 'A secure, feature-rich mobile banking application supporting UPI, NEFT, and mutual fund investments. Served 100k+ users.',
        client: 'FinServe Bank',
        technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS'],
        category: 'Mobile App',
        status: 'completed',
        completedDate: new Date('2025-03-20'),
        isFeatured: true,
        order: 2,
      },
      {
        title: 'Inventory Management System',
        description: 'Real-time inventory tracking with barcode scanning, automated restocking alerts, and multi-warehouse support.',
        client: 'RetailMax India',
        technologies: ['Vue.js', 'Python', 'MySQL', 'Docker'],
        category: 'Web App',
        status: 'completed',
        completedDate: new Date('2025-01-10'),
        isFeatured: true,
        order: 3,
      },
      {
        title: 'AI-Powered LMS Platform',
        description: 'Learning management system with AI-driven course recommendations, video streaming, and progress analytics.',
        client: 'EduLearn Academy',
        technologies: ['Next.js', 'Python', 'TensorFlow', 'MongoDB'],
        category: 'Web App',
        status: 'ongoing',
        isFeatured: true,
        order: 4,
      },
    ]);
    console.log('💻 Projects created');

    // Create testimonials
    await Testimonial.insertMany([
      {
        clientName: 'Rajesh Kumar',
        designation: 'CTO',
        company: 'TechCorp Solutions',
        quote: 'Vantaigo delivered our ERP system on time and within budget. Their team understood our complex requirements and built a solution that transformed our operations.',
        rating: 5,
      },
      {
        clientName: 'Priya Sharma',
        designation: 'HR Director',
        company: 'FinServe Bank',
        quote: 'The talent acquisition team at Vantaigo helped us fill 50+ critical positions in just 3 months. Their understanding of the banking sector is exceptional.',
        rating: 5,
      },
      {
        clientName: 'Dr. Anil Mehta',
        designation: 'CEO',
        company: 'HealthPlus Hospital',
        quote: 'Finding qualified medical professionals is challenging, but Vantaigo made it seamless. They provided us with top-tier talent across all our locations.',
        rating: 4,
      },
    ]);
    console.log('💬 Testimonials created');

    // Create team members
    await TeamMember.insertMany([
      { name: 'Vikram Patel', designation: 'CEO & Founder', department: 'Leadership', bio: 'Visionary leader with 15+ years of experience in IT and HR consulting. Founded Vantaigo with a mission to bridge the gap between talent and technology.', order: 1 },
      { name: 'Sneha Reddy', designation: 'CTO', department: 'Leadership', bio: 'Technology strategist with expertise in cloud architecture and enterprise solutions. Led 50+ successful software projects.', order: 2 },
      { name: 'Amit Joshi', designation: 'Head of HR Services', department: 'HR', bio: 'HR veteran with deep knowledge of Indian labor laws and talent management strategies.', order: 3 },
      { name: 'Kavitha Nair', designation: 'Senior Developer', department: 'Engineering', bio: 'Full-stack developer specializing in React and Node.js. Passionate about building scalable applications.', order: 4 },
      { name: 'Rahul Singh', designation: 'UI/UX Designer', department: 'Engineering', bio: 'Creative designer focused on creating intuitive and beautiful user experiences that drive engagement.', order: 5 },
    ]);
    console.log('👥 Team members created');

    // Create blog posts
    const blog1 = new BlogPost({
      title: 'How AI is Transforming HR Recruitment in 2025',
      content: 'Artificial intelligence is revolutionizing the way companies recruit talent. From resume screening to candidate matching, AI tools are making the hiring process faster, more efficient, and less biased.\n\n## Key Trends\n\n1. **AI-Powered Resume Screening** - Machine learning algorithms can now analyze thousands of resumes in minutes, identifying the best candidates based on skills, experience, and cultural fit.\n\n2. **Chatbot Interviews** - Initial screening interviews are being conducted by AI chatbots, providing a consistent experience for all candidates.\n\n3. **Predictive Analytics** - Companies are using data analytics to predict employee turnover and identify retention strategies.\n\n## The Human Touch\n\nWhile AI is powerful, the human element remains crucial. At Vantaigo, we combine AI efficiency with human expertise to deliver the best recruitment outcomes for our clients.',
      excerpt: 'Discover how artificial intelligence is reshaping the recruitment landscape and what it means for businesses and job seekers.',
      author: 'Amit Joshi',
      category: 'HR Insights',
      tags: ['AI', 'Recruitment', 'HR Tech'],
      isPublished: true,
      publishedAt: new Date('2025-12-15'),
    });
    await blog1.save();

    const blog2 = new BlogPost({
      title: '5 Essential Software Solutions Every Growing Business Needs',
      content: 'As businesses scale, the need for robust software solutions becomes critical. Here are five essential tools that every growing company should consider.\n\n## 1. Enterprise Resource Planning (ERP)\nAn ERP system integrates all your business processes into a single platform, improving efficiency and data accuracy.\n\n## 2. Customer Relationship Management (CRM)\nTrack customer interactions, manage sales pipelines, and improve customer retention with a good CRM.\n\n## 3. Human Resource Management System (HRMS)\nAutomate payroll, leave management, and performance tracking.\n\n## 4. Project Management Tools\nKeep your teams aligned and projects on track with collaborative project management software.\n\n## 5. Business Intelligence & Analytics\nMake data-driven decisions with real-time dashboards and reporting tools.',
      excerpt: 'From ERP to analytics, discover the software solutions that can help your business scale efficiently.',
      author: 'Sneha Reddy',
      category: 'Tech News',
      tags: ['Software', 'Business', 'Growth'],
      isPublished: true,
      publishedAt: new Date('2025-11-28'),
    });
    await blog2.save();
    console.log('📝 Blog posts created');

    // Create careers
    await Career.insertMany([
      {
        title: 'Senior React Developer',
        department: 'Engineering',
        location: 'Hyderabad, India',
        type: 'full-time',
        experience: '3-5 years',
        description: 'We are looking for an experienced React developer to join our engineering team and build cutting-edge web applications for our clients.',
        requirements: ['3+ years experience with React.js', 'Strong JavaScript/TypeScript skills', 'Experience with REST APIs and GraphQL', 'Knowledge of state management (Redux, Context)', 'Git proficiency'],
        responsibilities: ['Build responsive web applications', 'Collaborate with designers and backend developers', 'Write clean, maintainable code', 'Participate in code reviews', 'Mentor junior developers'],
        salary: '₹8-15 LPA',
        applyEmail: 'careers@vantaigo.com',
      },
      {
        title: 'HR Recruitment Specialist',
        department: 'HR',
        location: 'Hyderabad, India',
        type: 'full-time',
        experience: '2-4 years',
        description: 'Join our HR consultancy team to help clients find the best talent across industries.',
        requirements: ['2+ years in recruitment/staffing', 'Experience with ATS systems', 'Strong communication skills', 'Knowledge of Indian labor laws', 'Degree in HR or related field'],
        responsibilities: ['Manage end-to-end recruitment process', 'Source candidates through various channels', 'Conduct initial screenings', 'Coordinate with client HR teams', 'Maintain candidate databases'],
        salary: '₹4-8 LPA',
        applyEmail: 'careers@vantaigo.com',
      },
    ]);
    console.log('💼 Career listings created');

    console.log('\n✅ Seed completed successfully!');
    console.log('📋 Admin Login: username=admin, password=admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
