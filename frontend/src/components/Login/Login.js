import React, { useState } from 'react';
import './Login.css';
const backendBaseURL = process.env.REACT_APP_BACKEND_URL;

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendBaseURL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true)
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className='login-wrapper'>
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};


export default Login;