// api.js
// All backend API calls live here
// Keeps code organized - one place to manage all requests

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // your Node.js backend URL

// Register new user
export async function registerUser(name, email, password) {
  const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
  return res.data;
}

// Login user
export async function loginUser(email, password) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
}