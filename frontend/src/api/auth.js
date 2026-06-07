import axios from './axios'; // Importamos la instancia configurada

// Exportamos funciones puras que retornan Promesas
export const registerRequest = (user) => axios.post('/auth/register', user);
export const loginRequest = (user) => axios.post('/auth/login', user);
export const logoutRequest = () => axios.post('/auth/logout');