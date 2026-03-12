import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getActivity: () => api.get('/admin/activity'),
  getQuizzes: () => api.get('/admin/quizzes'),
  getResults: () => api.get('/admin/results'),
};

// Quiz APIs
export const quizAPI = {
  getAllQuizzes: () => api.get('/quizzes'),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  getMyQuizzes: () => api.get('/quizzes/creator/my-quizzes'),
  createQuiz: (data) => api.post('/quizzes', data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

// Result APIs
export const resultAPI = {
  submitQuiz: (data) => api.post('/results/submit', data),
  getResultById: (id) => api.get(`/results/${id}`),
  getMyResults: () => api.get('/results/candidate/my-results'),
  getQuizResults: (quizId) => api.get(`/results/quiz/${quizId}`),
};

export default api;
