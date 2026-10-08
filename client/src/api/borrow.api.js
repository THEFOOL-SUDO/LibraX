import api from './axios.js';

const borrowApi = {
  issueBook: (data) => api.post('/borrow/issue', data),
  returnBook: (data) => api.post('/borrow/return', data),
  getAllBorrows: (params) => api.get('/borrow/all', { params }),
  getStudentBorrows: (studentId) => api.get(`/borrow/student/${studentId}`),
  getOverdue: () => api.get('/borrow/overdue')
};

export default borrowApi;

