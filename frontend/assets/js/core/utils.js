/*
 * utils.js
 * Provides a collection of utility functions for common tasks in the Local Shopping Web-App.
 * These functions are general-purpose and can be used across different parts of the application.
 */

/**
 * Debounces a function, so it only runs after a certain delay.
 * Useful for events that fire rapidly, like window resizing or typing in a search box.
 * @param {function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {function} - The debounced function.
 */
export function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * Throttles a function, so it only runs at most once per a given time period.
 * Useful for scroll events or other continuous events.
 * @param {function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {function} - The throttled function.
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Formats a number as a currency string.
 * @param {number} amount - The amount to format.
 * @param {string} currencyCode - The currency code (e.g., 'NGN', 'USD').
 * @param {string} locale - The locale (e.g., 'en-US', 'en-NG').
 * @returns {string} - The formatted currency string.
 */
export function formatCurrency(amount, currencyCode = 'NGN', locale = 'en-NG') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} - The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validates an email address using a simple regex.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
export function isValidEmail(email) {
    const re = /^(([^<>()[\\]\\.,;:\s@\"]+(\\.[^<>()[\\]\\.,;:\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Gets a URL parameter by name.
 * @param {string} name - The name of the URL parameter.
 * @param {string} url - The URL string (defaults to current window location).
 * @returns {string|null} - The value of the parameter, or null if not found.
 */
export function getUrlParameter(name, url = window.location.href) {
    name = name.replace(/[[\\]\\]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\\+/g, ' '));
}

// TODO: Add more utility functions as needed (e.g., date formatting, local storage helpers, DOM manipulation helpers)
