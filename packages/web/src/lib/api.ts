import axios from 'axios';
import { config } from '../config';

// Створюємо axios інстанс з налаштуваннями
export const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Додаємо перехоплювач для токена авторизації
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Додаємо перехоплювач для обробки помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      // Ігноруємо помилки сертифіката в режимі розробки
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
); 