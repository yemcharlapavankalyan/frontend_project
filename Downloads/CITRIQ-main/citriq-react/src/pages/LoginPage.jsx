import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { users, login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Find user by email (case-insensitive)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      // In a real app, we would check password here.
      // For this demo, we accept any password if the email is valid.
      login(user);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  // Group users by role for the demo credentials display
  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          CITRIQ - Peer Review Platform
        </h1>

        {error && (
          <div className="alert alert-error" style={{
            backgroundColor: '#fee2e2',
            color: '#c53030',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '6px', fontSize: '0.875rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>Demo Credentials:</h3>
          <p style={{ marginBottom: '0.5rem', color: '#666' }}>Password: Any value (e.g., "password")</p>

          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Teacher:</strong>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: '0.25rem' }}>
              {teachers.map(u => (
                <li key={u.id} style={{ marginBottom: '0.25rem' }}>
                  <code style={{ backgroundColor: '#edf2f7', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>{u.email}</code>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Students:</strong>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: '0.25rem' }}>
              {students.slice(0, 3).map(u => ( // Show only first 3 students to save space
                <li key={u.id} style={{ marginBottom: '0.25rem' }}>
                  <code style={{ backgroundColor: '#edf2f7', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>{u.email}</code>
                </li>
              ))}
              {students.length > 3 && <li style={{ color: '#666', fontStyle: 'italic' }}>...and {students.length - 3} more</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
