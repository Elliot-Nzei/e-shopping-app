/*
 * main.js
 * Main entry point for the Local Shopping Web-App frontend.
 * This file initializes the application, sets up global listeners, and orchestrates other modules.
 */

import { initRouter } from './assets/js/core/router.js';
import { initializeState } from './assets/js/core/state.js';
import { initModals } from './assets/js/components/modal.js';

/**
 * Initializes the entire application.
 * This function is called once when the DOM is fully loaded.
 */
function initializeApp() {
    console.log('Initializing Local Shopping Web-App...');

    // 1. Initialize global state management
    initializeState();

    // 2. Initialize UI components (e.g., modals)
    initModals();

    // 3. Initialize client-side router (this will handle initial page load and auth init)
    initRouter();

    // 4. Register Service Worker for PWA capabilities
    registerServiceWorker();

    // TODO: Add any other global initializations here that are not page-specific
    console.log('Local Shopping Web-App initialized.');
}

/**
 * Registers the Service Worker for Progressive Web App (PWA) features.
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/frontend/sw.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
}

// Ensure the app initializes once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);