import './Login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard'); // redirect after login
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const signUp = () => {
        navigate('/create');
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <input
                type="email"
                placeholder="UP Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}> 
                {loading ? 'Logging in...' : 'Log In'}
            </button>
                {error && <div className="error">{error}</div>}
            <button onClick={signUp} className='link-button'>Don't have an account? Create one here</button>
            </form>
        </div>
    );
}
