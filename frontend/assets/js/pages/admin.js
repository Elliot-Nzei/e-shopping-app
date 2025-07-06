/*
 * admin.js
 * Logic for the admin dashboard and administrative functionalities.
 * This includes user management, seller management, product moderation, and system settings.
 */

import { showToast } from '../components/toast.js';
import { renderPagination } from '../components/pagination.js';
// import { getUsers, getSellers, getProductsForAdmin, updateUserSettings, deleteUser } from '../core/api.js'; // Assuming these API functions exist

/**
 * Initializes the admin dashboard page.
 */
export async function initAdminDashboard() {
    console.log('Initializing Admin Dashboard...');
    loadAdminUsers();
    loadAdminSellers();
    loadAdminProducts();
    // TODO: Initialize other admin modules like categories, orders, analytics, settings
}

/**
 * Loads and displays users for the admin panel.
 * @param {number} [page=1] - The current page number for users.
 */
async function loadAdminUsers(page = 1) {
    try {
        // const users = await getUsers({ page, role: 'user' });
        const users = [
            { id: 1, username: 'john_doe', email: 'john@example.com', role: 'USER' },
            { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'USER' },
        ]; // Mock data
        console.log('Admin users:', users);
        renderAdminUsersTable(users);

        const totalPages = 5; // Mock total pages
        renderPagination(document.getElementById('admin-users-pagination'), {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadAdminUsers(newPage)
        });

    } catch (error) {
        console.error('Failed to load admin users:', error);
        showToast('Failed to load users.', 'error');
    }
}

/**
 * Renders the admin users in a table.
 * @param {Array<object>} users - Array of user objects.
 */
function renderAdminUsersTable(users) {
    const tableBody = document.querySelector('#admin-users-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-sm btn-secondary">Edit</button>
                <button class="btn btn-sm btn-error">Delete</button>
            </td>
        `;
    });
}

/**
 * Loads and displays sellers for the admin panel.
 * @param {number} [page=1] - The current page number for sellers.
 */
async function loadAdminSellers(page = 1) {
    try {
        // const sellers = await getSellers({ page });
        const sellers = [
            { id: 1, business_name: 'Shop A', owner: 'Alice', status: 'Approved' },
            { id: 2, business_name: 'Shop B', owner: 'Bob', status: 'Pending' },
        ]; // Mock data
        console.log('Admin sellers:', sellers);
        renderAdminSellersTable(sellers);

        const totalPages = 2; // Mock total pages
        renderPagination(document.getElementById('admin-sellers-pagination'), {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadAdminSellers(newPage)
        });

    } catch (error) {
        console.error('Failed to load admin sellers:', error);
        showToast('Failed to load sellers.', 'error');
    }
}

/**
 * Renders the admin sellers in a table.
 * @param {Array<object>} sellers - Array of seller objects.
 */
function renderAdminSellersTable(sellers) {
    const tableBody = document.querySelector('#admin-sellers-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (sellers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No sellers found.</td></tr>';
        return;
    }

    sellers.forEach(seller => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${seller.id}</td>
            <td>${seller.business_name}</td>
            <td>${seller.owner}</td>
            <td>${seller.status}</td>
            <td>
                <button class="btn btn-sm btn-primary">View</button>
                <button class="btn btn-sm btn-secondary">Approve</button>
            </td>
        `;
    });
}

/**
 * Loads and displays products for admin moderation.
 * @param {number} [page=1] - The current page number for products.
 */
async function loadAdminProducts(page = 1) {
    try {
        // const products = await getProductsForAdmin({ page });
        const products = [
            { id: 1, name: 'Product X', seller: 'Shop A', status: 'Active' },
            { id: 2, name: 'Product Y', seller: 'Shop B', status: 'Pending Review' },
        ]; // Mock data
        console.log('Admin products:', products);
        renderAdminProductsTable(products);

        const totalPages = 3; // Mock total pages
        renderPagination(document.getElementById('admin-products-pagination'), {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadAdminProducts(newPage)
        });

    } catch (error) {
        console.error('Failed to load admin products:', error);
        showToast('Failed to load products.', 'error');
    }
}

/**
 * Renders the admin products in a table.
 * @param {Array<object>} products - Array of product objects.
 */
function renderAdminProductsTable(products) {
    const tableBody = document.querySelector('#admin-products-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No products found.</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.seller}</td>
            <td>${product.status}</td>
            <td>
                <button class="btn btn-sm btn-primary">View</button>
                <button class="btn btn-sm btn-secondary">Moderate</button>
            </td>
        `;
    });
}

// Call initAdminDashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminDashboard);
