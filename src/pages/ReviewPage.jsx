import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ReviewPage = () => {
  const { projectId } = useParams();
  const { user, getProjectById, getUserById, addReview } = useApp();
  const [selectedPeer, setSelectedPeer] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const project = getProjectById(parseInt(projectId));
  const peers = project?.assignedStudents.filter(id => id !== user?.id) || [];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (selectedPeer && rating > 0 && comment.trim()) {
      addReview(parseInt(projectId), {
        reviewerId: user.id,
        revieweeId: parseInt(selectedPeer),
        rating,
        comment: comment.trim()
      });
      setSelectedPeer('');
      setRating(0);
      setComment('');
      setShowForm(false);
    }
  };

  const renderStars = (currentRating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`star ${i < currentRating ? '' : 'empty'}`}
        onClick={() => setRating(i + 1)}
        style={{ cursor: 'pointer', fontSize: '1.5rem' }}
      >
        ★
      </span>
    ));
  };

  if (!project) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3>Project not found</h3>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
          ← Back to Dashboard
        </Link>
        <h1 className="page-title">CITRIQ - Review Peers - {project.title}</h1>
        <p className="page-subtitle">Provide constructive feedback to your peers</p>
      </div>

      <div className="grid grid-2">
        {/* Review Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Submit Review</h3>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(true)}
            >
              + Add Review
            </button>
          </div>
          
          {showForm && (
            <form onSubmit={handleSubmitReview} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Peer to Review</label>
                <select 
                  className="form-select"
                  value={selectedPeer}
                  onChange={(e) => setSelectedPeer(e.target.value)}
                  required
                >
                  <option value="">Choose a peer...</option>
                  {peers.map(peerId => {
                    const peer = getUserById(peerId);
                    return (
                      <option key={peerId} value={peerId}>
                        {peer?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {renderStars(rating)}
                </div>
                <small style={{ color: '#666' }}>Click on stars to rate (1-5)</small>
              </div>
              
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Provide constructive feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Submit Review</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing Reviews */}
        <div className="card">
          <h3 className="card-title">Reviews Given</h3>
          {project.reviews.filter(review => review.reviewerId === user?.id).length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews submitted yet.</p>
          ) : (
            project.reviews
              .filter(review => review.reviewerId === user?.id)
              .map(review => {
                const reviewee = getUserById(review.revieweeId);
                return (
                  <div key={review.id} className="review-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>{reviewee?.name}</strong>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < review.rating ? '' : 'empty'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                    <small style={{ color: '#666' }}>
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </small>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Reviews Received */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title">Reviews Received</h3>
        {project.reviews.filter(review => review.revieweeId === user?.id).length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews received yet.</p>
        ) : (
          project.reviews
            .filter(review => review.revieweeId === user?.id)
            .map(review => {
              const reviewer = getUserById(review.reviewerId);
              return (
                <div key={review.id} className="review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>From: {reviewer?.name}</strong>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < review.rating ? '' : 'empty'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                  <small style={{ color: '#666' }}>
                    {new Date(review.submittedAt).toLocaleDateString()}
                  </small>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
