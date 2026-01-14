import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [token, setToken] = useState(null);

useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
}, []);

const login = async (email, password) => {
    const res = await loginAPI(email, password);
    const t = res.data.token;
    localStorage.setItem('token', t);
    setToken(t);
    return t;
};

const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
};

const isAuthenticated = !!token;

return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
    {children}
    </AuthContext.Provider>
);
}

    export function useAuth() {
    return useContext(AuthContext);
}