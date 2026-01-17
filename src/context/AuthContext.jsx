import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, createUser as registerAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token') || null,
        user: null,
        isAuthenticated: !!localStorage.getItem('token')
    });

    const login = async (email, password) => {
        const res = await loginAPI(email, password);
        const { token, newUser } = res.data;

        localStorage.setItem('token', token)
        console.log('token received')

        setAuthState({
            token,
            user : newUser,
            isAuthenticated: true
        });
        return { token, user: newUser };
    };

    const register = async (data) => {
        const res = await registerAPI(data);
        const { token, newUser} = res.data;

        localStorage.setItem('token', token)
        console.log('token received')

        setAuthState({
            token,
            user : newUser,
            isAuthenticated: true
        });
        return { token, user: newUser };
    };

    const logout = () => {
        localStorage.removeItem('token');
        console.log('token removed')
        setAuthState({
            token: null,
            user: null,
            isAuthenticated : false
        });
    };

    return (
        <AuthContext.Provider value = {{ ...authState, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)