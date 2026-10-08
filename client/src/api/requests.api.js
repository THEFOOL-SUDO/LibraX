import api from './axios.js';

const requestsApi = {
  createRequest: (data) => api.post('/requests', data),
  getRequests: (params) => api.get('/requests', { params }),
  getMyRequests: () => api.get('/requests/my'),
  updateRequest: (id, data) => api.put(`/requests/${id}`, data)
};

export default requestsApi;

