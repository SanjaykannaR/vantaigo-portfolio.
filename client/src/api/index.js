import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vantaigo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vantaigo_token');
    }
    return Promise.reject(error);
  }
);

// ===== Public API =====
export const publicAPI = {
  getSiteConfig: () => api.get('/siteconfig'),
  getClients: (params) => api.get('/clients', { params }),
  getClient: (id) => api.get(`/clients/${id}`),
  getProjects: (params) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  getServices: (params) => api.get('/services', { params }),
  getTestimonials: () => api.get('/testimonials'),
  getBlogPosts: (params) => api.get('/blog', { params }),
  getBlogPost: (slug) => api.get(`/blog/${slug}`),
  getTeam: () => api.get('/team'),
  getCareers: (params) => api.get('/careers', { params }),
  getCareer: (id) => api.get(`/careers/${id}`),
  subscribeNewsletter: (data) => api.post('/newsletter/subscribe', data),
};

// ===== Admin API =====
export const adminAPI = {
  // Auth
  login: (data) => api.post('/auth/login', data),
  verify: () => api.post('/auth/verify'),

  // Clients
  getClients: () => api.get('/clients'),
  createClient: (data) => api.post('/clients', data),
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`),

  // Projects
  getProjects: () => api.get('/projects'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Services
  getServices: () => api.get('/services'),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Testimonials
  getTestimonials: () => api.get('/testimonials/admin'),
  createTestimonial: (data) => api.post('/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Blog
  getBlogPosts: () => api.get('/blog/admin'),
  createBlogPost: (data) => api.post('/blog', data),
  updateBlogPost: (id, data) => api.put(`/blog/${id}`, data),
  deleteBlogPost: (id) => api.delete(`/blog/${id}`),

  // Team
  getTeam: () => api.get('/team/admin'),
  createTeamMember: (data) => api.post('/team', data),
  updateTeamMember: (id, data) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),

  // Careers
  getCareers: () => api.get('/careers/admin'),
  createCareer: (data) => api.post('/careers', data),
  updateCareer: (id, data) => api.put(`/careers/${id}`, data),
  deleteCareer: (id) => api.delete(`/careers/${id}`),

  // Newsletter
  getSubscribers: () => api.get('/newsletter'),
  deleteSubscriber: (id) => api.delete(`/newsletter/${id}`),
  exportSubscribers: () => api.get('/newsletter/export', { responseType: 'blob' }),

  // Site Config
  getSiteConfig: () => api.get('/siteconfig'),
  updateSiteConfig: (data) => api.put('/siteconfig', data),

  // Upload
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
