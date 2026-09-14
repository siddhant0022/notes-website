import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me', { skipGlobalError: true }),
};

export const resourcesApi = {
  getPublicStats: () => api.get('/resources/stats/public'),
  getAll: (params) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  upload: (formData) =>
    api.post('/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (id) =>
    api.get(`/resources/${id}/download`, { responseType: 'blob' }),
  toggleStar: (id) => api.post(`/resources/${id}/star`),
  getStarred: () => api.get('/resources/starred'),
  delete: (id) => api.delete(`/resources/${id}`),
};

export const subjectsApi = {
  getAll: (params) => api.get('/subjects', { params }),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getPending: (params) => api.get('/admin/resources/pending', { params }),
  approve: (id) => api.patch(`/admin/resources/${id}/approve`),
  reject: (id, reason) => api.patch(`/admin/resources/${id}/reject`, { reason }),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
};
