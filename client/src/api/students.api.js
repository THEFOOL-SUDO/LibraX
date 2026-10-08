import api from './axios.js';

const studentsApi = {
  getStudents: () => api.get('/students'),
  getStudent: (id) => api.get(`/students/${id}`),
  deactivateStudent: (id) => api.delete(`/students/${id}`)
};

export default studentsApi;

