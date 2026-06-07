import axios from './axios';

// El parámetro all=true permite al admin ver incluso los inactivos
export const getProductsRequest = (all = false) => axios.get(`/products${all ? '?all=true' : ''}`);
export const createProductRequest = (product) => axios.post('/products', product);
export const getProductByIdRequest = (id) => axios.get(`/products/${id}`);
export const updateProductRequest = (id, product) => axios.put(`/products/${id}`, product);
export const deleteProductRequest = (id) => axios.delete(`/products/${id}`);