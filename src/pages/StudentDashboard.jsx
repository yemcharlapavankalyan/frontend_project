import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const StudentDashboard = () => {
  const { user, getProjectsByUserId, getSubmissionsByUserId } = useApp();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');

  const userProjects = getProjectsByUserId(user?.id || 0);
  const userSubmissions = getSubmissionsByUserId(user?.id || 0);

  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (selectedProject && submissionContent) {
      // This would be handled by the context in a real app
      console.log('Submitting work:', { projectId: selectedProject, content: submissionContent });
      setShowSubmitForm(false);
      setSelectedProject(null);
      setSubmissionContent('');
    }
  };

  return (
    <div>
      <h1 className="page-title">CITRIQ - Student Dashboard</h1>
      <p className="page-subtitle">View your assigned projects and submit your work</p>

      <div className="grid grid-2">
        {userProjects.map(project => (
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
              <strong>Your Submissions:</strong> {project.submissions.filter(s => s.studentId === user?.id).length}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Reviews Received:</strong> {project.reviews.filter(r => r.revieweeId === user?.id).length}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedProject(project.id);
                  setShowSubmitForm(true);
                }}
              >
                Submit Work
              </button>
              
              <Link 
                to={`/reviews/${project.id}`}
                className="btn btn-secondary btn-sm"
              >
                View Reviews
              </Link>
              
              <Link 
                to={`/review/${project.id}`}
                className="btn btn-success btn-sm"
              >
                Review Peers
              </Link>
            </div>
          </div>
        ))}
      </div>

      {userProjects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No assigned projects</h3>
          <p>You haven't been assigned to any projects yet. Check back later or contact your teacher.</p>
        </div>
      )}

      {showSubmitForm && (
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
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h2 className="card-title">Submit Work</h2>
            <form onSubmit={handleSubmitWork}>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select 
                  className="form-select"
                  value={selectedProject || ''}
                  onChange={(e) => setSelectedProject(parseInt(e.target.value))}
                  required
                >
                  <option value="">Select a project...</option>
                  {userProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Work Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Describe your work, include links, or paste your content here..."
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
