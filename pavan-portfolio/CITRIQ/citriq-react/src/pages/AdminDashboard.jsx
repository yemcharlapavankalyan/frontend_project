import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { projects, users, addProject, deleteProject, isLoading } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedStudents: []
  });

  const handleAddProject = async (e) => {
    e.preventDefault();
    await addProject({
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

  const handleViewSubmissions = (projectId) => {
    setSelectedProject(projectId);
    setShowSubmissions(true);
  };

  const students = users.filter(user => user.role === 'student');

  if (isLoading && projects.length === 0) {
    return <LoadingSpinner message="Loading projects..." />;
  }

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
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
                disabled={isLoading}
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
            
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  Reviews: {project.reviews.length} | 
                  Submissions: {project.submissions.length}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleViewSubmissions(project.id)}
                  disabled={project.submissions.length === 0}
                >
                  View Submissions
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
                      await deleteProject(project.id);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
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

      {/* Submissions Modal */}
      {showSubmissions && selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '800px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-title">
                Submissions for "{projects.find(p => p.id === selectedProject)?.title}"
              </h2>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSubmissions(false)}
              >
                ✕ Close
              </button>
            </div>
            
            {projects.find(p => p.id === selectedProject)?.submissions.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-state-icon">📄</div>
                <h3>No submissions yet</h3>
                <p>Students haven't submitted their work for this project yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.find(p => p.id === selectedProject)?.submissions.map((submission, index) => {
                  const student = users.find(u => u.id === submission.studentId);
                  return (
                    <div key={submission.id || index} style={{
                      padding: '1rem',
                      backgroundColor: '#f7fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{student?.name || 'Unknown Student'}</h4>
                        <span style={{ fontSize: '0.875rem', color: '#666' }}>
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Status:</strong> 
                        <span style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#c6f6d5',
                          color: '#22543d',
                          borderRadius: '4px',
                          fontSize: '0.875rem'
                        }}>
                          {submission.status || 'Submitted'}
                        </span>
                      </div>
                      <div>
                        <strong>Content:</strong>
                        <div style={{ 
                          marginTop: '0.5rem',
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {submission.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
