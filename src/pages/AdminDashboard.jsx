import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AdminDashboard = () => {
  const { projects, users, addProject, deleteProject } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedStudents: []
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    addProject({
      ...newProject,
      status: 'active',
      assignedStudents: newProject.assignedStudents.map(id => parseInt(id))
    });
    setNewProject({
      title: '',
      description: '',
      dueDate: '',
      assignedStudents: []
    });
    setShowAddForm(false);
  };

  const handleStudentToggle = (studentId) => {
    setNewProject(prev => ({
      ...prev,
      assignedStudents: prev.assignedStudents.includes(studentId.toString())
        ? prev.assignedStudents.filter(id => id !== studentId.toString())
        : [...prev.assignedStudents, studentId.toString()]
    }));
  };

  const students = users.filter(user => user.role === 'student');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">CITRIQ - Admin Dashboard</h1>
          <p className="page-subtitle">Manage peer review assignments and monitor progress</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Project
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">Add New Project</h2>
          <form onSubmit={handleAddProject}>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-input"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Assign Students</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {students.map(student => (
                  <label key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={newProject.assignedStudents.includes(student.id.toString())}
                      onChange={() => handleStudentToggle(student.id)}
                    />
                    {student.name}
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Create Project</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="card-header">
              <h3 className="card-title">{project.title}</h3>
              <span className={`project-status status-${project.status}`}>
                {project.status}
              </span>
            </div>
            
            <p style={{ marginBottom: '1rem', color: '#666' }}>{project.description}</p>
            
            <div className="card-meta" style={{ marginBottom: '1rem' }}>
              <strong>Due Date:</strong> {new Date(project.dueDate).toLocaleDateString()}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Assigned Students:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {project.assignedStudents.map(studentId => {
                  const student = users.find(u => u.id === studentId);
                  return (
                    <span key={studentId} style={{ 
                      display: 'inline-block', 
                      margin: '0.25rem', 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      {student?.name}
                    </span>
                  );
                })}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  Reviews: {project.reviews.length} | 
                  Submissions: {project.submissions.length}
                </span>
              </div>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => deleteProject(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No projects yet</h3>
          <p>Create your first peer review project to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
