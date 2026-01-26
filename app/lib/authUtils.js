/**
 * Authentication utility functions for frontend
 * These functions help manage user authentication in the client-side
 */

/**
 * Sign up a new user
 * @param {string} username - User's username (3-30 characters)
 * @param {string} email - User's email address
 * @param {string} password - User's password (minimum 6 characters)
 * @returns {Promise<Object>} User data and token
 */
export async function signup(username, email, password) {
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

/**
 * Log in an existing user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data and token
 */
export async function login(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

/**
 * Log out the current user
 */
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

/**
 * Get the current user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

/**
 * Get the authentication token
 * @returns {string|null} JWT token or null if not logged in
 */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export function isAuthenticated() {
    const token = getToken();
    const user = getCurrentUser();
    return !!(token && user);
}

/**
 * Make an authenticated API request
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function authenticatedFetch(url, options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error('No authentication token found. Please login.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // If unauthorized, clear stored auth data
    if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
    }

    return response;
}

/**
 * Decode JWT token (client-side only for reading, not for validation)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload
 */
export function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export function isTokenExpired(token) {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
}

/**
 * Validate current session
 * @returns {boolean} True if session is valid
 */
export function validateSession() {
    const token = getToken();

    if (!token) return false;

    if (isTokenExpired(token)) {
        logout();
        return false;
    }

    return true;
}
