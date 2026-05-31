// Standard axios import
import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginCompany = (data) => api.post('/auth/login', data);
export const registerCompany = (data) => api.post('/auth/register', data);

export const getDashboardStats = () => api.get('/company/dashboard-stats');
export const getAlerts = () => api.get('/company/alerts');
export const getCodesByBatch = (batchId) => api.get(`/company/codes/${batchId}`);
export const getCompanyProducts = () => api.get('/company/products');
export const addCompanyProduct = (data) => api.post('/company/product', data);
export const createProductBatch = (data) => api.post('/company/batch', data);

export const verifyProductCode = (batchNumber, data) => api.post(`/verify/${batchNumber}`, data);
export const validateQrFormat = (data) => api.post(`/verify/qr`, data);

export default api;
