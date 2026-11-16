import { useState } from 'react';
import './components.css';
import { ShieldCheck } from "lucide-react";


export default function RegisterForm() {
    let API_URL = "127.0.0.1:5000"; // PLACEHOLDER FOR FUTURE
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        try {
            const response = await fetch(`http://${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            const userData = await response.json();
            console.log('User created:', userData);
            alert('User created successfully! You can now log in.');
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    return (
        <div className="register-form">
            <form onSubmit={handleSubmit}>
                <div className="register-icon">
                    <ShieldCheck size={27} />
                </div>
                <h2>Create an account</h2>
                <p className="register-subtitle">Sign up for NetScope</p>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}