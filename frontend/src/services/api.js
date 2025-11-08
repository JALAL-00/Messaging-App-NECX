import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getUsers = () => api.get('/users');
export const createUser = (name) => api.post('/users', { name });
export const getMessages = () => api.get('/messages');
export const sendMessage = (message) => api.post('/messages', message);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);
export const updateMessage = (id, newText) => api.put(`/messages/${id}`, { text: newText });

export const importData = (file) => {
  const formData = new FormData();
  formData.append('backup', file); 

  return api.post('/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const exportData = () => api.get('/export', {
  responseType: 'blob', 
});

export default api;
