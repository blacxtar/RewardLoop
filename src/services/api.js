/**
 * Centralized API service layer.
 * 
 * WHY a service layer?
 * - Decouples API details (base URLs, headers) from components/thunks
 * - Makes it trivial to swap endpoints, add interceptors, or mock in tests
 * - Single place to attach auth tokens to outgoing requests
 * 
 * We create separate axios instances for each external API to keep
 * base URLs and potential interceptors isolated.
 */

import axios from 'axios';

/**
 * DummyJSON API — used for authentication (login endpoint).
 * Docs: https://dummyjson.com/docs/auth
 */
export const authAPI = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * FakeStore API — used for product listings.
 * Docs: https://fakestoreapi.com/docs
 */
export const productsAPI = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

/**
 * Attach auth token to requests that need it.
 * Called once after login to configure the instance.
 *
 * @param {string} token - JWT from DummyJSON auth
 */
export const setAuthToken = (token) => {
  if (token) {
    authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete authAPI.defaults.headers.common['Authorization'];
  }
};
