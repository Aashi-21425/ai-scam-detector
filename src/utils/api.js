// api.js
// All backend API calls in one place
// axios automatically sends/receives JSON data

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth APIs ──────────────────────────────
export const registerUser = (name, email, password) =>
  API.post('/auth/register', { name, email, password });

export const loginUser = (email, password) =>
  API.post('/auth/login', { email, password });

export const getCurrentUser = () =>
  API.get('/auth/me');

// ── Scan APIs (we'll use on Day 5) ─────────
export const detectScam = (type, content, language) =>
  API.post('/detect', { type, content, language });

export const getScanHistory = () =>
  API.get('/history');

export const deleteScan = (id) =>
  API.delete(`/history/${id}`);