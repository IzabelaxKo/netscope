import { useState } from 'react';
import Cookies from 'js-cookie';
import './components.css';
import { ShieldCheck } from "lucide-react";
// import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onLoginSuccess }) {
    let API_URL = "127.0.0.1:5000"; // PLACEHOLDER FOR FUTURE
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://${API_URL}/login_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }
            const userData = await response.json();
            console.log('User logged in:', userData);

            if (userData.token) {
                Cookies.set('session_token', userData.token, { expires: 1, sameSite: 'lax' });
            }

            alert('Login successful! Welcome back.');

            if (onLoginSuccess) {
                onLoginSuccess(userData.user);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Failed to log in');
        }        
    }
    
    return (    
        <div className="login-form">
        <form onSubmit={handleSubmit}>
            <div className="login-icon">
            <ShieldCheck size={27} />
            </div>

            <h2>Welcome back</h2>
            <p className="login-subtitle">Sign in to NetScope</p>

            <label htmlFor="email">Email</label>
            <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
    
