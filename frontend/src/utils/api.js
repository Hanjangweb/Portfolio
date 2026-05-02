import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (data) => API.post('/auth/register', data),
  logout: () => API.post('/auth/logout'),
};

// Projects endpoints
export const projectsAPI = {
  getAll: () => API.get('/projects'),
  getOne: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
};

// Blog endpoints
export const blogAPI = {
  getAll: (page = 1, limit = 10) => API.get(`/blog?page=${page}&limit=${limit}`),
  getOne: (id) => API.get(`/blog/${id}`),
  create: (data) => API.post('/blog', data),
  update: (id, data) => API.put(`/blog/${id}`, data),
  delete: (id) => API.delete(`/blog/${id}`),
};

// Skills endpoints
export const skillsAPI = {
  getAll: () => API.get('/skills'),
  create: (data) => API.post('/skills', data),
  update: (id, data) => API.put(`/skills/${id}`, data),
  delete: (id) => API.delete(`/skills/${id}`),
};

// Contact endpoints
export const contactAPI = {
  submit: (data) => API.post('/contact', data),
  getAll: () => API.get('/contact'),
};

// Testimonials endpoints
export const testimonialsAPI = {
  getAll: () => API.get('/testimonials'),
  create: (data) => API.post('/testimonials', data),
  delete: (id) => API.delete(`/testimonials/${id}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getStats: () => API.get('/analytics/stats'),
  getVisits: () => API.get('/analytics/visits'),
};

// Footer endpoints
export const footerAPI = {
  getAll: () => API.get('/footer'),
  create: (data) => API.post('/footer', data),
  update: (id, data) => API.put(`/footer/${id}`, data),
  delete: (id) => API.delete(`/footer/${id}`),
};

// Settings endpoints
export const settingsAPI = {
  get: () => API.get('/settings'),
  update: (data) => API.put('/settings', data),
};

// Upload endpoints
export const uploadAPI = {
  uploadImage: (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// AI endpoints
export const aiAPI = {
  generate: (data) => API.post('/ai/generate', data),
};

export default API;
