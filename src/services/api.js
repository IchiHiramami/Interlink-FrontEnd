import axios from 'axios';
import { API_BASE_URL } from '../config';

export const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
})

// API.interceptors.response.use((res) => res.data);

// Auth with login
export const login = (email, password) => API.post('/login', {email, password});

// create users using POST with Auth
export const createUser = (data) => {API.post('/register', data); console.log('Front-end has attempted to register')};

// fetch user stat data in home
export const getCurrentUser = () => API.get('/dashboard');

// post tasks at this time
export const postTask = (taskData) => API.post('/tasks', taskData);

// fetch tasks available
export const getTasks = () => API.get('/tasks');


// a bunch of stuff i probably might not use but is still there regardless
// return users using GET
export const getUsers = (email) => email ? API.get('/users', {params: {email}}): API.get('/users');

// user update details using PUT
export const updateUser = (email, data) => API.put(`/users/email/${encodeURIComponent(email)}`, data); 

// user update details using PUT
export const adminUpdateUsers = (email, data) => API.put(`/users/admin/email/${encodeURIComponent(email)}`, data); 

// delete user using DELETE
export const deleteUser = (email) => API.delete(`/users/email/${encodeURIComponent(email)}`)