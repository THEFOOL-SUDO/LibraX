import api from './axios.js';

const authApi = {
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  changePassword: (data) => api.put('/auth/change-password', data).then((res) => res.data)
};

export default authApi;

