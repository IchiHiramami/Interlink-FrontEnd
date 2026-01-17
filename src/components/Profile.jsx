// src/components/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // reuse same styles

export default function Profile() {
const navigate = useNavigate();
const { user, logout } = useAuth();
const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    idNumber: user?.idNumber || ''
});
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

// navigation handlers
const switchProfile = () => navigate('/profile');
const switchSettings = () => navigate('/settings');
const switchStats = () => navigate('/stats');

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
    const res = await API.put(`/email/${user.email}`, {
        ...formData, 
        email : user.email
    });
    setMessage('Profile updated successfully!');
    // Optionally update local user state if AuthContext supports it
    } catch (err) {
    console.error('Failed to update profile', err);
    setMessage('Error updating profile.');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="dashboard-container">
    {/* Sidebar */}
    <aside className="sidebar">
        <h3>{user?.firstName} {user?.lastName}</h3>
        <p>{user?.email}</p>
        <nav>
        <ul>
            <li onClick={switchProfile}>Profile</li>
            <li onClick={switchStats}>Stats</li>
            <li onClick={switchSettings}>Settings</li>
            <li onClick={logout} className="logout">Logout</li>
        </ul>
        </nav>
    </aside>

    {/* Main Content */}
    <main className="main-content">
        <h2>Your Profile</h2>

        <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Email (read-only)</label>
            <input type="text" value={user?.email} disabled />
        </div>

        <div className="form-group">
            <label>First Name</label>
            <input
            type="text"
            name="firstName"
            placeholder={user?.firstName}
            value={formData.firstName}
            onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label>Last Name</label>
            <input
            type="text"
            name="lastName"
            placeholder={user?.lastName}
            value={formData.lastName}
            onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label>ID Number</label>
            <input
            type="text"
            name="idNumber"
            placeholder={user?.idNumber}
            value={formData.idNumber}
            onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label>Role (read-only)</label>
            <input type="text" value={user?.role} disabled />
        </div>

        <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
        </button>
        </form>

        {message && <p className="status-message">{message}</p>}
    </main>
    </div>
);
}
