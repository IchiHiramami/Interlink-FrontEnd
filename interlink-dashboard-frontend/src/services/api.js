import axios from 'axios';
import {API_BASE_URL} from '../config';

const API = axios.create({baseURL : API_BASE_URL});

// attach tokens
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
})

// Auth
export const login = (email, password) => API.post('users/login', {email, password});

// create users using POST
export const createUser = (data) => API.post('/users/register', data);

// return users using GET
export const getUsers = (email) => email ? API.get('/users', {params: {email}}): API.get('/users');

// user update details using PUT
export const updateUser = (email, data) => API.put(`/users/email/${encodeURIComponent(email)}`, data); 

// user update details using PUT
export const adminUpdateUsers = (email, data) => API.put(`/users/admin/email/${encodeURIComponent(email)}`, data); 

// delete user using DELETE
export const deleteUser = (email) => API.delete(`/users/email/${encodeURIComponent(email)}`)