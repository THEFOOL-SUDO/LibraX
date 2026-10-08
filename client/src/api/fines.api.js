import api from './axios.js';

const finesApi = {
  getStudentFines: (studentId) => api.get(`/fines/student/${studentId}`),
  getAllFines: () => api.get('/fines/all'),
  payFine: (id) => api.put(`/fines/${id}/pay`)
};

export default finesApi;

