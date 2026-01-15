// src/components/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/users/stats'); // protected route
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>{user?.firstName} {user?.lastName}</h3>
        <p>{user?.email}</p>
        <nav>
          <ul>
            <li>Profile</li>
            <li>Stats</li>
            <li>Settings</li>
            <li onClick={logout} className="logout">Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Welcome back, {user?.firstName}!</h2>

        {!stats ? (
          <p>Loading your stats...</p>
        ) : (
          <div className="stats-grid">
            <div className="card">
              <h3>Submissions</h3>
              <p>{stats.submissions}</p>
            </div>
            <div className="card">
              <h3>Last Login</h3>
              <p>{new Date(stats.lastLogin).toLocaleString()}</p>
            </div>
            <div className="card">
              <h3>Role</h3>
              <p>{stats.role}</p>
            </div>
          </div>
        )}

        {/* Conditional rendering */}
        {user?.role === 'admin' && (
          <section className="admin-panel">
            <h3>Admin Controls</h3>
            <p>Manage users, view system stats, etc.</p>
          </section>
        )}
      </main>
    </div>
  );
}
