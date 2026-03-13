import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
};

export const internshipAPI = {
    getAll: () => api.get('/internships'),
    getOne: (id) => api.get(`/internships/${id}`),
    create: (data) => api.post('/internships', data),
    update: (id, data) => api.put(`/internships/${id}`, data),
    delete: (id) => api.delete(`/internships/${id}`),
};

export const companyAPI = {
    getAll: () => api.get('/companies'),
    create: (data) => api.post('/companies', data),
};

export const applicationAPI = {
    getAll: () => api.get('/applications'),
    apply: (internshipId) => api.post(`/applications/${internshipId}`),
    updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

export default api;
