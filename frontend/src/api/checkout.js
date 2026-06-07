import axios from './axios';

// El payload esperado es { cartItems: [{ productId, quantity }], paymentToken: string }
export const createOrderRequest = (orderData) => axios.post('/checkout', orderData);