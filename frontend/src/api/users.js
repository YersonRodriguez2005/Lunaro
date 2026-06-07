import axios from './axios';

export const getProfileRequest = () => axios.get('/users/profile');
export const updateProfileRequest = (user) => axios.put('/users/profile', user);