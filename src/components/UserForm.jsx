import './UserForm.css'
import { useState } from 'react';
import { createUser } from '../services/api';
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function UserForm() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        idNumber: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        // Email domain check
        if (!/^[^@\s]+@(eee\.upd\.edu\.ph|up\.edu\.ph)$/.test(form.email)) {
            newErrors.email = 'Email must be from eee.upd.edu.ph or up.edu.ph';
        }
        // ID number format check
        if (!/^\d{4}-\d{5}$/.test(form.idNumber)) {
            newErrors.idNumber = 'ID number must match format YYYY-#####';
        }
        // Password check
        if (!form.password || form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }
        // First/last name required
        if (!form.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!form.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const res = await createUser(form);
            alert(`User created: ${res.data.firstName} ${res.data.lastName}`);
            setForm({
                email: '',
                firstName: '',
                lastName: '',
                idNumber: '',
                password: ''
            });
            setErrors({});
            const data = { email, password };
            await register(data);
            navigate('/dashboard');
            
        } catch (err) {
            alert(`Error: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-form-container">
        <form className="user-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <input
            name="email"
            placeholder="UP Email"
            value={form.email}
            onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}

            <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}

            <input
            name="idNumber"
            placeholder="ID Number"
            value={form.idNumber}
            onChange={handleChange}
            />
            {errors.idNumber && <p className="error">{errors.idNumber}</p>}

            <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
            </button>
        </form>
        </div>
    );
}
