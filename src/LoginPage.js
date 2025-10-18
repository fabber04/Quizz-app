import React, { useState } from 'react';
import './LoginPage.css';

const USERS = [
  { username: 'kaytee', password: 'kayteethegreat' },
  { username: 'user2', password: 'pass2' },
  { username: 'user3', password: 'pass3' },
  { username: 'user4', password: 'pass4' },
  { username: 'user5', password: 'pass5' },
  { username: 'user6', password: 'pass6' },
  { username: 'user7', password: 'pass7' },
  { username: 'user8', password: 'pass8' },
  { username: 'user9', password: 'pass9' },
  { username: 'user10', password: 'pass10' },
  { username: 'user11', password: 'pass11' },
  { username: 'user12', password: 'pass12' },
];

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-glass">
        <div className="login-header">
          <span className="login-logo">🎉</span>
          <h1>Welcome to Quiz Master</h1>
          <p className="login-subtitle">Sign in to test your knowledge!</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button className="login-btn" type="submit">
            Login
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
        <div className="login-footer">
          <span>Only authorized users can access the quiz.</span>
        </div>
      </div>
    </div>
  );
}