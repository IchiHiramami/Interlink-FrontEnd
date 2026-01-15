import './Landing.css'
import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <div className="landing">
        <h1>Welcome to Interlink Dashboard</h1>
        <p>
            Manage your projects, track progress, and collaborate with your peers.
            Sign up to get started or log in if you already have an account.
        </p>
        <div className="landing-buttons">
            <Link to="/create" className="primary">Sign Up</Link>
            <Link to="/login" className="secondary">Log In</Link>
        </div>
        </div>
    );
}

