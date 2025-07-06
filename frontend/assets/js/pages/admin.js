/*
 * admin.js
 * Core logic for the admin dashboard, handling navigation between sections,
 * loading overview data, and potentially other admin-level functionalities.
 */

import { showToast } from '../../components/toast.js';
// import { getAdminOverviewData, getUsers, getSellers, getProductsForAdmin, getOrdersForAdmin, getCategories, getAnalyticsData, getAdminSettings } from '../../core/api.js'; // Assuming these API functions exist

const sidebarLinks = document.querySelectorAll('.dashboard-sidebar .sidebar-link');
const dashboardSections = document.querySelectorAll('.dashboard-section');

/**
 * Initializes the admin dashboard page.
 */
export async function initAdminDashboard() {
    console.log('Initializing Admin Dashboard...');
    setupSidebarNavigation();
    // Load initial overview data when the dashboard loads
    loadOverviewData();
}

/**
 * Sets up the sidebar navigation for the admin dashboard.
 */
function setupSidebarNavigation() {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Remove active class from all links and hide all sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            dashboardSections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding section and load its data
            const targetSectionId = link.dataset.section;
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Call specific load functions for each section
                switch (targetSectionId) {
                    case 'overview':
                        loadOverviewData();
                        break;
                    case 'users':
                        loadUserManagement();
                        break;
                    case 'sellers':
                        loadSellerManagement();
                        break;
                    case 'products':
                        loadProductManagement();
                        break;
                    case 'orders':
                        loadOrderManagement();
                        break;
                    case 'categories':
                        loadCategoryManagement();
                        break;
                    case 'analytics':
                        loadPlatformAnalytics();
                        break;
                    case 'settings':
                        loadAdminSettings();
                        break;
                }
            }
        });
    });
}

/**
 * Loads and displays overview data for the admin dashboard.
 */
async function loadOverviewData() {
    console.log('Loading admin overview data...');
    try {
        // const data = await getAdminOverviewData();
        const data = { // Mock data
            totalUsers: 1200,
            totalSellers: 150,
            totalProducts: 5000,
            totalOrders: 800,
            totalRevenue: 1250000,
            pendingApprovals: 7,
            userSignups: { labels: ['W1', 'W2', 'W3', 'W4'], data: [50, 75, 60, 90] },
            salesTrends: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], data: [100000, 120000, 110000, 150000] },
        };

        document.getElementById('total-users').textContent = data.totalUsers;
        document.getElementById('total-sellers').textContent = data.totalSellers;
        document.getElementById('total-products').textContent = data.totalProducts;
        document.getElementById('total-orders').textContent = data.totalOrders;
        document.getElementById('total-revenue').textContent = `₦${data.totalRevenue.toLocaleString()}`;
        document.getElementById('pending-approvals').textContent = data.pendingApprovals;

        renderUserSignupsChart(data.userSignups);
        renderAdminSalesTrendChart(data.salesTrends);

    } catch (error) {
        console.error('Failed to load overview data:', error);
        showToast('Failed to load overview data.', 'error');
    }
}

/**
 * Renders the User Signups Over Time chart.
 * @param {object} data - Chart data.
 */
function renderUserSignupsChart(data) {
    const ctx = document.getElementById('userSignupsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'New Signups',
                    data: data.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

/**
 * Renders the Admin Sales Trends chart.
 * @param {object} data - Chart data.
 */
function renderAdminSalesTrendChart(data) {
    const ctx = document.getElementById('adminSalesTrendChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Total Sales',
                    data: data.data,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

/**
 * Placeholder for User Management section loading.
 */
function loadUserManagement() {
    console.log('Loading User Management...');
    // TODO: Implement fetching and rendering user data, pagination, filters, etc.
    const usersSection = document.getElementById('users');
    if (usersSection) {
        usersSection.innerHTML = `
            <h2>User Management</h2>
            <p>Table of all user accounts with options to view, edit, delete, and filter.</p>
            <!-- Example table -->
            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>Username</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>user1</td><td>user1@example.com</td><td><button class="btn btn-sm">Edit</button></td></tr>
                </tbody>
            </table>
        `;
    }
}

/**
 * Placeholder for Seller Management section loading.
 */
function loadSellerManagement() {
    console.log('Loading Seller Management...');
    // TODO: Implement fetching and rendering seller data, permissions, etc.
    const sellersSection = document.getElementById('sellers');
    if (sellersSection) {
        sellersSection.innerHTML = `
            <h2>Seller Management</h2>
            <p>Table of all seller accounts with options to approve, suspend, and manage permissions.</p>
        `;
    }
}

/**
 * Placeholder for Product Management section loading.
 */
function loadProductManagement() {
    console.log('Loading Product Management...');
    // TODO: Implement fetching and rendering product data, moderation tools, etc.
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.innerHTML = `
            <h2>Product Management</h2>
            <p>Table of all products with options for moderation, editing, and bulk actions.</p>
        `;
    }
}

/**
 * Placeholder for Order Management section loading.
 */
function loadOrderManagement() {
    console.log('Loading Order Management...');
    // TODO: Implement fetching and rendering order data, status updates, refunds, etc.
    const ordersSection = document.getElementById('orders');
    if (ordersSection) {
        ordersSection.innerHTML = `
            <h2>Order Management</h2>
            <p>Table of all orders with options to view details, update status, and issue refunds.</p>
        `;
    }
}

/**
 * Placeholder for Category Management section loading.
 */
function loadCategoryManagement() {
    console.log('Loading Category Management...');
    // TODO: Implement fetching and rendering categories, adding/editing/deleting categories.
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
        categoriesSection.innerHTML = `
            <h2>Category Management</h2>
            <p>Manage product categories and subcategories.</p>
        `;
    }
}

/**
 * Placeholder for Platform Analytics section loading.
 */
function loadPlatformAnalytics() {
    console.log('Loading Platform Analytics...');
    // TODO: Implement fetching and rendering platform-wide analytics charts and reports.
    const analyticsSection = document.getElementById('analytics');
    if (analyticsSection) {
        analyticsSection.innerHTML = `
            <h2>Platform Analytics</h2>
            <p>Comprehensive analytics for the entire platform.</p>
        `;
    }
}

/**
 * Placeholder for Admin Settings section loading.
 */
function loadAdminSettings() {
    console.log('Loading Admin Settings...');
    // TODO: Implement fetching and managing system settings, user roles, permissions.
    const settingsSection = document.getElementById('settings');
    if (settingsSection) {
        settingsSection.innerHTML = `
            <h2>Admin Settings</h2>
            <p>System-wide configurations and user role management.</p>
        `;
    }
}

// Call initAdminDashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminDashboard);