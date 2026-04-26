import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const pickDefined = (source, keys) =>
    keys.reduce((result, key) => {
        if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
            result[key] = source[key];
        }
        return result;
    }, {});

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
    updateMe: (data) => api.put('/auth/me', data),
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
    update: (id, data) => api.put(`/companies/${id}`, data),
    delete: (id) => api.delete(`/companies/${id}`),
};

export const userAPI = {
    getAll: () => api.get('/users'),
    getOne: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    getStats: () => api.get('/users/stats'),
    search: (query = '', role = '') => api.get('/users/search', { params: { q: query, role } }),
    assignFaculty: (data) => api.post('/users/faculty-assignments', data),
    getAssignedStudents: () => api.get('/users/faculty/assigned-students'),
    getPortfolio: (id) => api.get(`/users/portfolio/${id}`),
    exportStudents: () => api.get('/users/export/students', { responseType: 'blob' }),
    updateProfile: (data) => {
        const profileKeys = [
            'phone',
            'university',
            'degree',
            'graduationDate',
            'bio',
            'location',
            'skills',
            'avatarUrl',
            'department',
            'batch',
            'section',
            'rollNumber',
            'designation',
            'resumeUrl',
            'resumeFileName',
            'resumeMimeType',
            'resumeUploadedAt',
            'githubUrl',
            'linkedinUrl',
            'certifications',
            'achievements',
            'experience',
            'achievementsSummary',
            'achievementsImageUrl',
            'assignedFaculty',
        ];

        const profileSource = data.profile || data;

        return api.put('/auth/me', {
            ...pickDefined(data, ['name', 'email']),
            profile: pickDefined(profileSource, profileKeys),
        });
    },
};

export const applicationAPI = {
    getAll: () => api.get('/applications'),
    apply: (internshipId) => api.post(`/applications/${internshipId}`),
    updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
    exportAll: () => api.get('/applications/export', { responseType: 'blob' }),
};

export const messageAPI = {
    getAll: () => api.get('/messages'),
    getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
    sendMessage: (data) => api.post('/messages', data),
};

export const projectAPI = {
    getAll: (params = {}) => api.get('/projects', { params }),
    getOne: (id) => api.get(`/projects/${id}`),
    getFacultyQueue: () => api.get('/projects/faculty/queue'),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    submit: (id) => api.post(`/projects/${id}/submit`),
    resubmit: (id, data) => api.post(`/projects/${id}/resubmit`, data),
    review: (id, data) => api.post(`/projects/${id}/review`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    exportApproved: () => api.get('/projects/export/approved', { responseType: 'blob' }),
    exportBacklog: () => api.get('/projects/export/review-backlog', { responseType: 'blob' }),
};

export const notificationAPI = {
    getAll: (limit = 8) => api.get('/notifications', { params: { limit } }),
    markRead: (id) => api.post(`/notifications/${id}/read`),
    markAllRead: () => api.post('/notifications/read-all'),
};

export const uploadFile = (category, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/uploads/${category}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const studentAPI = {
    getDashboard: () => api.get('/student/dashboard'),
    getAnalytics: () => api.get('/student/analytics'),
};

export const settingsAPI = {
    get: () => api.get('/settings'),
    update: (data) => api.put('/settings', data),
};

export default api;
