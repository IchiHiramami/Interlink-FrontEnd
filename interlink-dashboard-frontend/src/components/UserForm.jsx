import './UserForm.css'
import { useState } from 'react';
import { createUser } from '../services/api';

export default function UserForm() {
    const [form, setForm] = useState({ email: '', firstName: '', lastName: '', idNumber: '' , password : ''});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await createUser(form);
        alert(`✅ User created: ${res.data.firstName} ${res.data.lastName}`);
        setForm({ email: '', firstName: '', lastName: '', idNumber: '' , password: ''});
    } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
        setLoading(false);
    }
};

return (
    <div className = "user-form-container">
    <form className ="user-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
            name="email"
            placeholder="UP Email"
            value={form.email}
            onChange={handleChange}
        />
        <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
        />
        <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
        />
        <input
            name="idNumber"
            placeholder="ID Number"
            value={form.idNumber}
            onChange={handleChange}
        />
        <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
        </button>
    </form>
    </div>
    );
}