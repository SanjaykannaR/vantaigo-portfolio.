import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vantaigo-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add admin token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vantaigo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
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

// Separate instance for HRMS employee tokens
const hrmsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

hrmsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrms_employee_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

hrmsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hrms_employee_token');
      localStorage.removeItem('hrms_employee');
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
  changeCredentials: (data) => api.put('/auth/change-credentials', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),

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

  // Resume Vault
  getResumes: () => api.get('/resumes'),
  createResume: (formData) => api.post('/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateResume: (id, formData) => api.put(`/resumes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteResume: (id) => api.delete(`/resumes/${id}`),

  // HRMS - Employee Management (admin)
  getEmployees: () => api.get('/hrms/employees'),
  createEmployee: (data) => api.post('/hrms/employees', data),
  updateEmployee: (id, data) => api.put(`/hrms/employees/${id}`, data),
  resetEmployeePassword: (id, data) => api.put(`/hrms/employees/${id}/reset-password`, data),
  deleteEmployee: (id) => api.delete(`/hrms/employees/${id}`),
  getAllAttendance: (params) => api.get('/hrms/attendance', { params }),
  adminMarkAttendance: (data) => api.post('/hrms/attendance/admin', data),
  getAllWorkItems: (params) => api.get('/hrms/workitems', { params }),
  adminCreateWorkItem: (data) => api.post('/hrms/workitems/admin', data),
  adminUpdateWorkItem: (id, data) => api.put(`/hrms/workitems/admin/${id}`, data),
  adminDeleteWorkItem: (id) => api.delete(`/hrms/workitems/admin/${id}`),

  // CRM (admin) — uses same admin token
  getCRMClients: () => api.get('/crm'),
  getCRMClient: (id) => api.get(`/crm/${id}`),
  createCRMClient: (data) => api.post('/crm', data),
  updateCRMClient: (id, data) => api.put(`/crm/${id}`, data),
  deleteCRMClient: (id) => api.delete(`/crm/${id}`),
  uploadCRMFile: (id, formData) => api.post(`/crm/${id}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  downloadCRMFile: (id, fileId) => api.get(`/crm/${id}/files/${fileId}/download`, { responseType: 'blob' }),
  deleteCRMFile: (id, fileId) => api.delete(`/crm/${id}/files/${fileId}`),
  addCRMFeedback: (id, data) => api.post(`/crm/${id}/feedback`, data),
  deleteCRMFeedback: (id, fbId) => api.delete(`/crm/${id}/feedback/${fbId}`),
  addCRMPosition: (id, data) => api.post(`/crm/${id}/positions`, data),
  updateCRMPosition: (id, posId, data) => api.put(`/crm/${id}/positions/${posId}`, data),
  deleteCRMPosition: (id, posId) => api.delete(`/crm/${id}/positions/${posId}`),
  addCRMSoftwareProject: (id, data) => api.post(`/crm/${id}/software`, data),
  updateCRMSoftwareProject: (id, projId, data) => api.put(`/crm/${id}/software/${projId}`, data),
  deleteCRMSoftwareProject: (id, projId) => api.delete(`/crm/${id}/software/${projId}`),
  getCRMReports: () => api.get('/crm/reports'),
};

// ===== HRMS Employee API (uses hrms_employee_token) =====
export const hrmsEmployeeAPI = {
  login: (data) => hrmsApi.post('/hrms/employee-login', data),
  verify: () => hrmsApi.post('/hrms/employee-verify'),

  getMyAttendance: (params) => hrmsApi.get('/hrms/attendance/my', { params }),
  markAttendance: (data) => hrmsApi.post('/hrms/attendance', data),

  getMyWorkItems: () => hrmsApi.get('/hrms/workitems/my'),
  createWorkItem: (data) => hrmsApi.post('/hrms/workitems', data),
  updateWorkItem: (id, data) => hrmsApi.put(`/hrms/workitems/${id}`, data),
  deleteWorkItem: (id) => hrmsApi.delete(`/hrms/workitems/${id}`),

  // HRMS employees can add resumes to the vault (synced to admin)
  addResume: (formData) => hrmsApi.post('/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
