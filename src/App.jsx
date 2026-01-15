import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import UserUpdate from './components/UserUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import './assets/app.css'

export default function App() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }


  return (
    <div style={{ padding: 16 }}>
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Interlink</Link>
      <div className="navbar-links">
        <Link to="/create">Sign Up</Link>
        <Link to="/login">Log In</Link>
        <Link to="/list">Users</Link>
        <Link to="/update">Update</Link>
        <button className="navbar-button" onClick={handleLogOut}>Logout</button>
      </div>
    </nav>


      <Routes>
        <Route path="/" element={<div><Landing /></div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<UserForm />} />

        <Route path="/list" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="/update" element={<ProtectedRoute><UserUpdate /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}