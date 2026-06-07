import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Crear instancia de Axios apuntando a nuestro backend
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// Interceptor de Respuestas
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si da 401 y la ruta original NO era el login o el propio refresh (para evitar bucles infinitos)
    if (error.response?.status === 401 && !error.config.url.includes('/login') && !error.config.url.includes('/refresh')) {
      // Disparamos la advertencia global
      useAuthStore.getState().setShowSessionWarning(true);
    }
    return Promise.reject(error);
  }
);

// Interceptor de Petición: Inyecta el token automáticamente si existe
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;