import { useEffect, useState } from 'react';
import { getUsers } from '../services/api';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getUsers()
            .then(res => setUsers(res.data))
            .catch(err => setError(err.response?.data?.error || err.message));
    }, []);

    if (error) return <p style = {{color : 'red'}}>{error}</p>;

    return (
        <div>
            <h2>All Users</h2>
            <ul>
                {users.map(u => (
                    <li key = {u._ud}>{u.name} ({u.email}) - {u.role}</li>
                ))}
            </ul>
        </div>
    );
}