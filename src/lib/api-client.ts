const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Include cookies for session persistence
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      // Don't log expected validation/auth errors to console to keep it clean
      if (response.status !== 422 && response.status !== 401) {
        console.error(`API Error [${endpoint}]:`, response.status, data);
      }
      // Return all data (including 'errors' field) along with standard fields
      return { success: false, ...data, message: data.message || 'Request failed', status: response.status };
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    return { success: false, message: 'Network error', error };
  }
};
