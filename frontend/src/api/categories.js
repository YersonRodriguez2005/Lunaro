import axios from './axios';

export const getCategoriesRequest = () => axios.get('/categories');
export const createCategoryRequest = (category) => axios.post('/categories', category);