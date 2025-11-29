import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const { users, login } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSelectedUser('');
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  const handleLogin = () => {
    if (selectedRole && selectedUser) {
      const user = users.find(u => u.id === parseInt(selectedUser));
      if (user) {
        login(user);
        navigate('/dashboard');
      }
    }
  };

  const filteredUsers = users.filter(user => user.role === selectedRole);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          CITRIQ - Peer Review Platform
        </h1>
        
        <div className="form-group">
          <label className="form-label">Select Role:</label>
          <div className="role-selector">
            <div 
              className={`role-option ${selectedRole === 'teacher' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('teacher')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👩‍🏫</div>
              <div style={{ fontWeight: 'bold' }}>Teacher</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                Manage projects and view analytics
              </div>
            </div>
            
            <div 
              className={`role-option ${selectedRole === 'student' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🎓</div>
              <div style={{ fontWeight: 'bold' }}>Student</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                Join projects and review peers
              </div>
            </div>
          </div>
        </div>

        {selectedRole && (
          <div className="form-group">
            <label className="form-label">Select User:</label>
            <select 
              className="form-select"
              value={selectedUser}
              onChange={(e) => handleUserSelect(e.target.value)}
            >
              <option value="">Choose a {selectedRole}...</option>
              {filteredUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={!selectedRole || !selectedUser}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Login
        </button>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Demo Users:</h3>
          <div style={{ fontSize: '0.875rem' }}>
          <div><strong>Mentor:</strong> Dr. Vara Prasad</div>
          <div><strong>Students:</strong> Y Pavan Kalyan, M Achyuth Kumar, E Rishikesh Reddy, M Srishanth, M Srikanth</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
