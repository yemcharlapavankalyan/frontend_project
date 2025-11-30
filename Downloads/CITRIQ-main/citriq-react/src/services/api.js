// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    // Silently handle network errors (API server not running)
    // Only log to console, don't show error to user
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.info('API server not available, will use localStorage fallback');
      return { data: null, error: 'API_UNAVAILABLE' };
    }
    console.error('API Call Error:', error);
    return { data: null, error: error.message };
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiCall('/users');
  },
  
  getById: async (id) => {
    return apiCall(`/users/${id}`);
  },
  
  create: async (user) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },
  
  update: async (id, user) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return apiCall('/projects');
  },
  
  getById: async (id) => {
    return apiCall(`/projects/${id}`);
  },
  
  create: async (project) => {
    return apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },
  
  update: async (id, project) => {
    return apiCall(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.projectId) queryParams.append('projectId', filters.projectId);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.reviewerId) queryParams.append('reviewerId', filters.reviewerId);
    if (filters.revieweeId) queryParams.append('revieweeId', filters.revieweeId);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/reviews?${queryString}` : '/reviews';
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/reviews/${id}`);
  },
  
  create: async (review) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },
  
  update: async (id, review) => {
    return apiCall(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    });
  },
};

// Submissions API
export const submissionsAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.projectId) queryParams.append('projectId', filters.projectId);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.studentId) queryParams.append('studentId', filters.studentId);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/submissions?${queryString}` : '/submissions';
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/submissions/${id}`);
  },
  
  create: async (submission) => {
    return apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  },
  
  update: async (id, submission) => {
    return apiCall(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(submission),
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getStats: async () => {
    return apiCall('/analytics');
  },
};

export default {
  users: usersAPI,
  projects: projectsAPI,
  reviews: reviewsAPI,
  submissions: submissionsAPI,
  analytics: analyticsAPI,
};

