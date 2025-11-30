import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ReviewsOverviewPage = () => {
  const { user, getReviewsByUserId, getProjectsByUserId, getUserById } = useApp();
  
  const userReviews = getReviewsByUserId(user?.id || 0);
  const userProjects = getProjectsByUserId(user?.id || 0);
  
  // Group reviews by project
  const reviewsByProject = {};
  userReviews.forEach(review => {
    if (!reviewsByProject[review.project.id]) {
      reviewsByProject[review.project.id] = {
        project: review.project,
        reviewsGiven: [],
        reviewsReceived: []
      };
    }
    
    if (review.reviewerId === user?.id) {
      reviewsByProject[review.project.id].reviewsGiven.push(review);
    } else if (review.revieweeId === user?.id) {
      reviewsByProject[review.project.id].reviewsReceived.push(review);
    }
  });

  return (
    <div>
      <h1 className="page-title">CITRIQ - Reviews Overview</h1>
      <p className="page-subtitle">View all your reviews across all projects</p>

      <div className="grid grid-2">
        {/* Your Projects */}
        <div className="card">
          <h3 className="card-title">Your Projects</h3>
          {userProjects.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No projects assigned.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userProjects.map(project => (
                <div key={project.id} style={{
                  padding: '1rem',
                  backgroundColor: '#f7fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{project.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                    {project.description.substring(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Link 
                      to={`/reviews/${project.id}`}
                      className="btn btn-primary btn-sm"
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
          )}
        </div>

        {/* Overall Stats */}
        <div className="card">
          <h3 className="card-title">Review Statistics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Projects Assigned:</span>
              <span style={{ fontWeight: 'bold', color: '#667eea' }}>{userProjects.length}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Reviews Given:</span>
              <span style={{ fontWeight: 'bold', color: '#48bb78' }}>
                {userReviews.filter(r => r.reviewerId === user?.id).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Reviews Received:</span>
              <span style={{ fontWeight: 'bold', color: '#ed8936' }}>
                {userReviews.filter(r => r.revieweeId === user?.id).length}
              </span>
            </div>
            
            {userReviews.filter(r => r.revieweeId === user?.id).length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Average Rating:</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                  {(userReviews
                    .filter(r => r.revieweeId === user?.id)
                    .reduce((sum, r) => sum + r.rating, 0) / 
                    userReviews.filter(r => r.revieweeId === user?.id).length
                  ).toFixed(1)} ⭐
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Reviews by Project */}
      {Object.keys(reviewsByProject).length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 className="card-title">All Reviews by Project</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {Object.values(reviewsByProject).map(({ project, reviewsGiven, reviewsReceived }) => (
              <div key={project.id}>
                <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>{project.title}</h4>
                
                <div className="grid grid-2">
                  {/* Reviews Given */}
                  <div>
                    <h5 style={{ marginBottom: '0.5rem', color: '#48bb78' }}>Reviews Given ({reviewsGiven.length})</h5>
                    {reviewsGiven.length === 0 ? (
                      <p style={{ fontSize: '0.875rem', color: '#666', fontStyle: 'italic' }}>
                        No reviews given for this project.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {reviewsGiven.map(review => (
                          <div key={review.id} style={{
                            padding: '0.75rem',
                            backgroundColor: '#f0fff4',
                            borderRadius: '4px',
                            border: '1px solid #c6f6d5'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                              <strong style={{ fontSize: '0.875rem' }}>To: {getUserById(review.revieweeId)?.name || 'Unknown'}</strong>
                              <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`star ${i < review.rating ? '' : 'empty'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{review.comment}</p>
                            <small style={{ color: '#666' }}>
                              {new Date(review.submittedAt).toLocaleDateString()}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reviews Received */}
                  <div>
                    <h5 style={{ marginBottom: '0.5rem', color: '#ed8936' }}>Reviews Received ({reviewsReceived.length})</h5>
                    {reviewsReceived.length === 0 ? (
                      <p style={{ fontSize: '0.875rem', color: '#666', fontStyle: 'italic' }}>
                        No reviews received for this project.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {reviewsReceived.map(review => (
                          <div key={review.id} style={{
                            padding: '0.75rem',
                            backgroundColor: '#fffaf0',
                            borderRadius: '4px',
                            border: '1px solid #fed7aa'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                              <strong style={{ fontSize: '0.875rem' }}>From: {getUserById(review.reviewerId)?.name || 'Unknown'}</strong>
                              <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`star ${i < review.rating ? '' : 'empty'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{review.comment}</p>
                            <small style={{ color: '#666' }}>
                              {new Date(review.submittedAt).toLocaleDateString()}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userProjects.length === 0 && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon">📝</div>
          <h3>No projects assigned</h3>
          <p>You haven't been assigned to any projects yet. Check back later or contact your teacher.</p>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      )}
    </div>
  );
};

export default ReviewsOverviewPage;
