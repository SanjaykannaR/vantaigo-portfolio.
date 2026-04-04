import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageClients from './pages/admin/ManageClients';
import ManageProjects from './pages/admin/ManageProjects';
import ManageServices from './pages/admin/ManageServices';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageBlog from './pages/admin/ManageBlog';
import ManageTeam from './pages/admin/ManageTeam';
import ManageCareers from './pages/admin/ManageCareers';
import ManageNewsletter from './pages/admin/ManageNewsletter';

import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ marginTop: 'var(--navbar-height)' }}>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/clients" element={<PublicLayout><Clients /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/team" element={<PublicLayout><Team /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
          <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute><ManageClients /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute><ManageServices /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><ManageTestimonials /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><ManageBlog /></ProtectedRoute>} />
          <Route path="/admin/team" element={<ProtectedRoute><ManageTeam /></ProtectedRoute>} />
          <Route path="/admin/careers" element={<ProtectedRoute><ManageCareers /></ProtectedRoute>} />
          <Route path="/admin/newsletter" element={<ProtectedRoute><ManageNewsletter /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
