import axios from './axios';

export const getMyOrdersRequest = () => axios.get('/orders/my-orders');