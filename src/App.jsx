import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import UserUpdate from './components/UserUpdate';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import { useAuth } from './context/AuthContext';

import './assets/app.css'

export default function App() {
  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const homeRedirect = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }


  return (
    <div style={{ padding: 16 }}>
    <nav className="navbar">
      <button onClick={homeRedirect} className="navbar-logo">Interlink</button>
      <div className="navbar-links">
        <Link to="/create">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </div>
    </nav>


      <Routes>
        <Route path="/"           element={<div><Landing /></div>} />
        <Route path="/login"      element={<Login />} />
        <Route path="/create"     element={<UserForm />} />

        <Route path="/list"       element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="/update"     element={<ProtectedRoute><UserUpdate /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
      </Routes>
    </div>
  );
}