import axios from 'axios';

// URL da sua API no Render (NOVA)
const API_URL = 'https://sistema-agendamento-api-wndb.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token automaticamente em todas as requisições
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

export default api;
export { API_URL };
