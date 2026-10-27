// PulseBeat API Service Layer - Direct REST API integration with Node.js & MongoDB Atlas
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('pulsebeat_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Check Backend Health & Database Connectivity
export async function checkServerStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { online: false };
    const data = await res.json();
    return {
      online: true,
      database: data.database,
      prn: data.studentPRN,
    };
  } catch {
    return { online: false };
  }
}

// Fetch Tracks from MongoDB Atlas (Supports Genre Filter & Search Query)
export async function fetchTracks(genreFilter = '', searchQuery = '') {
  const query = new URLSearchParams();
  if (genreFilter && genreFilter !== 'All') {
    query.append('genre', genreFilter);
  }
  if (searchQuery) {
    query.append('search', searchQuery);
  }

  const url = `${API_BASE_URL}/tracks${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch tracks from backend');
  }

  const data = await response.json();
  return { data, isLive: true };
}

// Fetch single track by ID from MongoDB Atlas
export async function fetchTrackById(id) {
  const response = await fetch(`${API_BASE_URL}/tracks/${id}`);
  if (!response.ok) {
    throw new Error('Track not found in database');
  }
  return await response.json();
}

// Create new audio track in MongoDB Atlas (POST /api/tracks)
export async function createTrack(trackData) {
  const response = await fetch(`${API_BASE_URL}/tracks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(trackData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create track in database');
  }

  const savedTrack = await response.json();
  return { data: savedTrack, isLive: true };
}

// Update existing audio track in MongoDB Atlas (PUT /api/tracks/:id)
export async function updateTrack(id, updateData) {
  const response = await fetch(`${API_BASE_URL}/tracks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update track in database');
  }

  const updatedTrack = await response.json();
  return { data: updatedTrack, isLive: true };
}

// Delete audio track from MongoDB Atlas (DELETE /api/tracks/:id)
export async function deleteTrack(id) {
  const response = await fetch(`${API_BASE_URL}/tracks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete track from database');
  }

  return { success: true, isLive: true };
}

// User Authentication: Login (POST /api/auth/login)
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }

  return {
    user: data.user,
    token: data.token,
    isLive: true,
  };
}

// User Authentication: Register (POST /api/auth/register)
export async function registerUser(name, email, password, prn) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, prn }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to register account');
  }

  return {
    user: data.user,
    token: data.token,
    isLive: true,
  };
}
