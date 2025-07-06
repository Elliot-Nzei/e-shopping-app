/*
 * state.js
 * Manages the global application state for the Local Shopping Web-App.
 * Provides functions to get, set, and subscribe to changes in the application state.
 */

const state = {}; // The central state object
const subscribers = {}; // Stores functions to call when state changes

/**
 * Gets a value from the global state.
 * @param {string} key - The key of the state variable to retrieve.
 * @returns {any} - The value of the state variable, or undefined if not found.
 */
export function getState(key) {
    return state[key];
}

/**
 * Sets a value in the global state and notifies all subscribers for that key.
 * @param {string} key - The key of the state variable to set.
 * @param {any} value - The new value for the state variable.
 */
export function setState(key, value) {
    if (state[key] !== value) {
        state[key] = value;
        console.log(`State updated: ${key} =`, value);
        if (subscribers[key]) {
            subscribers[key].forEach(callback => callback(value));
        }
    }
}

/**
 * Subscribes a callback function to state changes for a specific key.
 * The callback will be called with the new value whenever the state for that key changes.
 * @param {string} key - The key of the state variable to subscribe to.
 * @param {function} callback - The function to call when the state changes.
 * @returns {function} - A function to unsubscribe the callback.
 */
export function subscribe(key, callback) {
    if (!subscribers[key]) {
        subscribers[key] = [];
    }
    subscribers[key].push(callback);

    // Return an unsubscribe function
    return () => {
        subscribers[key] = subscribers[key].filter(sub => sub !== callback);
    };
}

/**
 * Initializes the state with default values or values from persistent storage.
 * Call this once at application startup.
 */
export function initializeState() {
    // Example: Load user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            setState('user', JSON.parse(storedUser));
        } catch (e) {
            console.error('Error parsing stored user state:', e);
            localStorage.removeItem('user');
        }
    }

    // Set default state values
    setState('isLoading', false);
    setState('error', null);
    // TODO: Add more initial state variables as needed
}

// Example Usage:
// initializeState();
// subscribe('user', (user) => {
//     console.log('User state changed:', user);
//     if (user) {
//         document.getElementById('welcomeMessage').textContent = `Welcome, ${user.name}!`;
//     } else {
//         document.getElementById('welcomeMessage').textContent = 'Welcome, Guest!';
//     }
// });
// setState('user', { name: 'Alice', id: 1 });
