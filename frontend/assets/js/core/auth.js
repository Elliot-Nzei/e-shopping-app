/*
 * auth.js
 * Handles user authentication logic (login, registration, logout, token management).
 * Interacts with the API client to send authentication requests.
 */

import { loginUser, registerUser } from './api.js'; // Assuming api.js exports these functions
import { setState, getState } from './state.js'; // Assuming state.js for global state management
import { navigateTo } from './router.js'; // Assuming router.js for navigation

/**
 * Logs in a user.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<boolean>} - True if login is successful, false otherwise.
 */
export async function login(email, password) {
    try {
        const response = await loginUser(email, password);
        if (response && response.access_token) {
            localStorage.setItem('accessToken', response.access_token);
            setState('user', response.user); // Store user info in global state
            console.log('Login successful!', response.user);
            navigateTo('/user/dashboard.html'); // Redirect to user dashboard
            return true;
        } else {
            console.error('Login failed: No access token received.');
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        // TODO: Display error message to user (e.g., using a toast notification)
        return false;
    }
}

/**
 * Registers a new user.
 * @param {object} userData - User registration data (e.g., email, password, name).
 * @returns {Promise<boolean>} - True if registration is successful, false otherwise.
 */
export async function register(userData) {
    try {
        const response = await registerUser(userData);
        if (response && response.message === 'User registered successfully') { // Adjust based on actual API response
            console.log('Registration successful!', response);
            // Optionally, log in the user directly or redirect to login page
            navigateTo('/auth/login.html');
            return true;
        } else {
            console.error('Registration failed:', response);
            return false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        // TODO: Display error message to user
        return false;
    }
}

/**
 * Logs out the current user.
 */
export function logout() {
    localStorage.removeItem('accessToken');
    setState('user', null); // Clear user from global state
    console.log('User logged out.');
    navigateTo('/auth/login.html'); // Redirect to login page
}

/**
 * Checks if the user is currently authenticated.
 * @returns {boolean} - True if an access token exists, false otherwise.
 */
export function isAuthenticated() {
    return !!localStorage.getItem('accessToken');
}

/**
 * Initializes authentication state on page load.
 * Checks for existing token and potentially fetches user data.
 */
export async function initAuth() {
    if (isAuthenticated()) {
        // TODO: Optionally fetch user profile to ensure token is still valid and get fresh data
        console.log('User is authenticated.');
    } else {
        console.log('User is not authenticated.');
    }
}

// TODO: Add functions for password reset, email verification, etc.
