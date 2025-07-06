/*
 * api.js
 * Handles all API client interactions for the Local Shopping Web-App.
 * This module provides functions for making HTTP requests to the backend API.
 */

const API_BASE_URL = 'http://localhost:8000/api/v1'; // TODO: Configure based on environment

/**
 * Generic function to make an authenticated API request.
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login', '/products').
 * @param {string} method - HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {object} [data=null] - Request body data for POST/PUT requests.
 * @param {boolean} [requiresAuth=true] - Whether the request requires an authentication token.
 * @returns {Promise<object>} - A promise that resolves with the JSON response.
 */
async function apiRequest(endpoint, method, data = null, requiresAuth = true) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = localStorage.getItem('accessToken'); // TODO: Use state management for token
        if (!token) {
            throw new Error('Authentication token not found.');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `API Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// --- Specific API Call Examples (to be implemented as needed) ---

/**
 * Fetches a list of products.
 * @returns {Promise<Array<object>>} - A promise that resolves with an array of products.
 */
export async function getProducts() {
    return apiRequest('/products', 'GET', null, false); // Products might be public
}

/**
 * Submits user login credentials.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - A promise that resolves with user data and tokens.
 */
export async function loginUser(email, password) {
    return apiRequest('/auth/login', 'POST', { email, password }, false);
}

/**
 * Registers a new user.
 * @param {object} userData - User registration details.
 * @returns {Promise<object>} - A promise that resolves with the new user's data.
 */
export async function registerUser(userData) {
    return apiRequest('/auth/register', 'POST', userData, false);
}

// TODO: Add more API functions for users, sellers, products, orders, etc.
