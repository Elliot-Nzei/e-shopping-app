/*
 * router.js
 * Handles client-side routing for the Local Shopping Web-App.
 * Manages navigation between different views/pages without full page reloads.
 */

import { initHomePage } from '../pages/home.js';
import { initLoginPage } from '../pages/auth/login.js';
import { initRegisterPage } from '../pages/auth/register.js';
import { initForgotPasswordPage } from '../pages/auth/forgot-password.js';
import { initVerifyEmailPage } from '../pages/auth/verify-email.js';
import { initUserDashboardPage } from '../pages/user/dashboard.js';
import { initProfilePage } from '../pages/user/profile.js';
import { initOrdersPage } from '../pages/user/orders.js';
import { initWishlistPage } from '../pages/user/wishlist.js';
import { initSettingsPage } from '../pages/user/settings.js';
import { initSellerDashboard } from '../pages/seller.js';
import { initSellerProductsPage } from '../pages/seller/products.js';
import { initAddProductPage } from '../pages/seller/add-product.js';
import { initSellerOrdersPage } from '../pages/seller/orders.js';
import { initSellerAnalyticsPage } from '../pages/seller/analytics.js';
import { initAdminDashboard } from '../pages/admin.js';
import { initAdminUsersPage } from '../pages/admin/users.js';
import { initAdminSellersPage } from '../pages/admin/sellers.js';
import { initAdminCategoriesPage } from '../pages/admin/categories.js';
import { initAdminProductsPage } from '../pages/admin/products.js';
import { initAdminOrdersPage } from '../pages/admin/orders.js';
import { initAdminAnalyticsPage } from '../pages/admin/analytics.js';
import { initMarketplacePage } from '../pages/public/marketplace.js';
import { initProductDetailPage } from '../pages/public/product-detail.js';
import { initPublicShopProfilePage } from '../pages/public/shop-profile.js';
import { initAboutPage } from '../pages/public/about.js';
import { initContactPage } from '../pages/public/contact.js';
import { initPrivacyPolicyPage } from '../pages/privacy-policy.js';

/**
 * Navigates to a specified path within the application.
 * Uses pushState for clean URLs and history management.
 * @param {string} path - The path to navigate to (e.g., '/dashboard', '/products/123').
 * @param {object} [state=null] - Optional state object to associate with the history entry.
 */
export function navigateTo(path, state = null) {
    history.pushState(state, '', path);
    handleLocation(); // Re-render content for the new path
}

/**
 * Maps paths to corresponding content loading functions.
 * This object defines which function to call when a specific URL path is accessed.
 * TODO: Expand this mapping as more pages/views are developed.
 */
const routes = {
    '/': { page: 'index.html', init: initHomePage },
    '/auth/login.html': { page: 'auth/login.html', init: initLoginPage },
    '/auth/register.html': { page: 'auth/register.html', init: initRegisterPage },
    '/auth/forgot-password.html': { page: 'auth/forgot-password.html', init: initForgotPasswordPage },
    '/auth/verify-email.html': { page: 'auth/verify-email.html', init: initVerifyEmailPage },
    '/user/dashboard.html': { page: 'user/dashboard.html', init: initUserDashboardPage },
    '/user/profile.html': { page: 'user/profile.html', init: initProfilePage },
    '/user/orders.html': { page: 'user/orders.html', init: initOrdersPage },
    '/user/wishlist.html': { page: 'user/wishlist.html', init: initWishlistPage },
    '/user/settings.html': { page: 'user/settings.html', init: initSettingsPage },
    '/seller/dashboard.html': { page: 'seller/dashboard.html', init: initSellerDashboard },
    '/seller/products.html': { page: 'seller/products.html', init: initSellerProductsPage },
    '/seller/add-product.html': { page: 'seller/add-product.html', init: initAddProductPage },
    '/seller/orders.html': { page: 'seller/orders.html', init: initSellerOrdersPage },
    '/seller/analytics.html': { page: 'seller/analytics.html', init: initSellerAnalyticsPage },
    '/admin/dashboard.html': { page: 'admin/dashboard.html', init: initAdminDashboard },
    '/admin/users.html': { page: 'admin/users.html', init: initAdminUsersPage },
    '/admin/sellers.html': { page: 'admin/sellers.html', init: initAdminSellersPage },
    '/admin/products.html': { page: 'admin/products.html', init: initAdminProductsPage },
    '/admin/orders.html': { page: 'admin/orders.html', init: initAdminOrdersPage },
    '/admin/categories.html': { page: 'admin/categories.html', init: initAdminCategoriesPage },
    '/admin/analytics.html': { page: 'admin/analytics.html', init: initAdminAnalyticsPage },
    '/public/marketplace.html': { page: 'public/marketplace.html', init: initMarketplacePage },
    '/public/product-detail.html': { page: 'public/product-detail.html', init: initProductDetailPage },
    '/public/shop-profile.html': { page: 'public/shop-profile.html', init: initPublicShopProfilePage },
    '/public/about.html': { page: 'public/about.html', init: initAboutPage },
    '/public/contact.html': { page: 'public/contact.html', init: initContactPage },
    '/public/privacy-policy.html': { page: 'privacy-policy.html', init: initPrivacyPolicyPage },
    // Add more routes here
    '404': { page: '404.html', init: null } // Fallback for unknown routes
};

/**
 * Loads the content of a specified HTML page into the main content area.
 * This is a simplified example; a more robust router might fetch templates or use a templating engine.
 * @param {string} pageName - The name of the HTML file to load (e.g., 'index.html', 'auth/login.html').
 * @param {function} [initFunction=null] - Optional initialization function to call after page loads.
 */
async function loadPage(pageName, initFunction = null) {
    try {
        const response = await fetch(`/frontend/pages/${pageName}`);
        if (!response.ok) {
            throw new Error(`Failed to load page: ${pageName}`);
        }
        const html = await response.text();
        const appContent = document.getElementById('app-content');
        if (appContent) {
            appContent.innerHTML = html;
            // Execute page-specific JS after loading HTML
            if (initFunction) {
                initFunction();
            }
        }
    } catch (error) {
        console.error('Error loading page:', error);
        // Optionally navigate to a 404 page or display an error message
        navigateTo('/404');
    }
}

/**
 * Handles the current URL location and renders the appropriate content.
 * This function is called on initial page load and when the URL changes (e.g., via navigateTo or browser back/forward).
 *
 * @returns {void}
 */
export function handleLocation() {
    const path = window.location.pathname;
    const route = routes[path] || routes['404'];
    loadPage(route.page, route.init);
}

/**
 * Initializes the router.
 * Sets up event listeners for popstate and initial page load.
 */
export function initRouter() {
    window.addEventListener('popstate', handleLocation);
    document.addEventListener('DOMContentLoaded', handleLocation);

    // Intercept clicks on internal links to use client-side routing
    document.body.addEventListener('click', e => {
        const target = e.target.closest('a[data-internal-link]');
        if (target) {
            e.preventDefault();
            navigateTo(target.getAttribute('href'));
        }
    });
}

// Call initRouter to set up routing when this module is loaded
// initRouter(); // This might be called from main.js or similar entry point
