// src/components/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API, postTask } from '../services/api';
import { useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('token');
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await API.get('/users/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchTasks = async () => {
      setTasksLoading(true);
      try {
        const res = await API.get('/tasks');
        
        const fetchedTasks = res.data;
        fetchedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTasks(fetchedTasks);

      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchStats();
    fetchTasks();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        createdAt: new Date().toISOString(),
      };

      if (!payload.title) throw new Error('Title is required');

      const res = await postTask(payload);
      const newTaskFromServer = res.data;

      setTasks((prev) => [newTaskFromServer, ...prev]);

      setSubmitSuccess('Task posted successfully!');
      setFormData({ title: '', content: '' });
      setShowForm(false);
      setTimeout(() => setSubmitSuccess(''), 4000);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to post task';
      setSubmitError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const goToProfile = () => navigate('/profile');
  const goToStats = () => navigate('/stats');
  const goToSettings = () => navigate('/settings');

  return (
    <div className="dashboard-container">
      {/* Sidebar - unchanged */}
      <aside className="sidebar">
        <div className="user-info">
          <h3>
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="email">{user?.email}</p>
        </div>
        <nav>
          <ul>
            <li onClick={goToProfile}>Profile</li>
            <li onClick={goToStats}>Stats</li>
            <li onClick={goToSettings}>Settings</li>
            <li onClick={logout} className="logout">
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Welcome back, {user?.firstName || 'User'}!</h2>

        {/* Stats section - unchanged */}
        {statsLoading ? (
          <div className="loading">Loading your stats...</div>
        ) : stats ? (
          <div className="stats-grid">
            <div className="card">
              <h3>Group</h3>
              <p>{stats.groupName || 'Not assigned'}</p>
            </div>
            <div className="card">
              <h3>Progress</h3>
              <p>{stats.groupProgress ?? 0}%</p>
            </div>
            <div className="card">
              <h3>Role</h3>
              <p>{stats.role || 'User'}</p>
            </div>
          </div>
        ) : (
          <p className="no-data">No stats available at the moment.</p>
        )}

        {/* ─── New: Tasks / Posts section ────────────────────────────────────── */}
        <section className="tasks-section">
          <h3>Recent Tasks / Posts</h3>

          {tasksLoading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <p className="no-data">No tasks posted yet.</p>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Admin panel */}
        {user?.role === 'admin' && (
          <section className="admin-panel">
            <h3>Admin Controls</h3>
            <p>Create tasks visible to group members</p>

            <div className="admin-actions">
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className={showForm ? 'btn-cancel' : 'btn-primary'}
              >
                {showForm ? 'Cancel' : 'New Task'}
              </button>
              <button type="button" disabled>
                See Users (coming soon)
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Task title"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content">Content / Description</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Describe the task..."
                    rows={5}
                    required
                  />
                </div>

                <small className="timestamp-preview">
                  Will be visible at:{' '}
                  {new Date().toLocaleString('en-PH', {
                    timeZone: 'Asia/Manila',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </small>

                {submitError && <p className="error-message">{submitError}</p>}
                {submitSuccess && <p className="success-message">{submitSuccess}</p>}

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={submitLoading || !formData.title.trim()}
                    className="btn-submit"
                  >
                    {submitLoading ? 'Posting...' : 'Post Task'}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </main>
    </div>
  );
}