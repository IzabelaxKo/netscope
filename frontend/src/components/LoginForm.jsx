import { useState } from 'react';
import './components.css';
import { ShieldCheck } from "lucide-react";
// import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
    }
    
    return (    
        <div className="login-form">
        <form onSubmit={handleSubmit}>
            <div className="login-icon">
            <ShieldCheck size={27} />
            </div>

            <h2>Welcome back</h2>
            <p className="login-subtitle">Sign in to NetScope</p>

            <label htmlFor="username">Username</label>
            <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />

            <label htmlFor="password">Password</label>
            <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <button type="submit">Sign in</button>
        </form>
        </div>
    );
}
    
