import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, createUser as registerAPI, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token') || null,
        user: null,
        isAuthenticated: false,
        isLoading: true
    });

    useEffect(() => {
        const verifyAndLoadUser = async () => {
            const storedToken = localStorage.getItem('token');

            if (!storedToken) {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    isAuthenticated: false,
                    user: null,
                    token: null
                }));
                return;
            }

            // ────────────────────────────────────────────────
            //   Everything from here until the catch must be inside the async function
            // ────────────────────────────────────────────────
            try {
                const res = await getCurrentUser();   // assuming getStats returns current user info

                setAuthState({
                    token: storedToken,
                    user: res.data.user || res.data || res.data.data, // be flexible with response shape
                    isAuthenticated: true,
                    isLoading: false
                });
            } catch (err) {
                console.error("Token invalid or expired → logging out", err);
                localStorage.removeItem('token');

                setAuthState({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        };

        verifyAndLoadUser();

    }, []); // empty array → runs once after mount (perfect for "on refresh")

    const login = async (email, password) => {
        const res = await loginAPI(email, password);
        const { token, newUser } = res.data;

        localStorage.setItem('token', token);
        console.log('token received');

        setAuthState({
            token,
            user: newUser,
            isAuthenticated: true,
            isLoading: false
        });

        return { token, user: newUser };
    };

    const register = async (data) => {
        const res = await registerAPI(data);
        const { token, newUser } = res.data;

        localStorage.setItem('token', token);
        console.log('token received');

        setAuthState({
            token,
            user: newUser,
            isAuthenticated: true,
            isLoading: false
        });

        return { token, user: newUser };
    };

    const logout = () => {
        localStorage.removeItem('token');
        console.log('token removed');
        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
    };

    return (
        <AuthContext.Provider value={{ 
            ...authState, 
            login, 
            register, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);