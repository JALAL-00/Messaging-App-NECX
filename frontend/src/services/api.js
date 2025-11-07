import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

// User API calls
export const getUsers = () => api.get('/users');
export const createUser = (name) => api.post('/users', { name });

// Message API calls
export const getMessages = () => api.get('/messages');
export const sendMessage = (message) => api.post('/messages', message); 

// Message API Delete call
export const deleteMessage = (id) => api.delete(`/messages/${id}`);

// Message API Update call
export const updateMessage = (id, newText) => api.put(`/messages/${id}`, { text: newText });

export default api;