/*
 * seller.js
 * Logic for the seller dashboard and related functionalities.
 * This includes managing products, orders, shop profile, and analytics for sellers.
 */

import { showToast } from '../components/toast.js';
import { renderPagination } from '../components/pagination.js';
// import { getSellerProducts, getSellerOrders, updateShopProfile } from '../core/api.js'; // Assuming these API functions exist

/**
 * Initializes the seller dashboard page.
 */
export async function initSellerDashboard() {
    console.log('Initializing Seller Dashboard...');
    loadSellerProducts();
    loadSellerOrders();
    setupShopProfileForm();
    // TODO: Initialize analytics charts, other seller-specific modules
}

/**
 * Loads and displays the seller's products.
 * @param {number} [page=1] - The current page number for products.
 */
async function loadSellerProducts(page = 1) {
    try {
        // const products = await getSellerProducts({ page });
        const products = [
            { id: 1, name: 'Product A', price: '₦1000', stock: 10 },
            { id: 2, name: 'Product B', price: '₦2500', stock: 5 },
        ]; // Mock data
        console.log('Seller products:', products);
        renderSellerProductsTable(products);

        const totalPages = 5; // Mock total pages
        renderPagination(document.getElementById('seller-products-pagination'), {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadSellerProducts(newPage)
        });

    } catch (error) {
        console.error('Failed to load seller products:', error);
        showToast('Failed to load products.', 'error');
    }
}

/**
 * Renders the seller's products in a table.
 * @param {Array<object>} products - Array of product objects.
 */
function renderSellerProductsTable(products) {
    const tableBody = document.querySelector('#seller-products-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No products found.</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-sm btn-secondary">Edit</button>
                <button class="btn btn-sm btn-error">Delete</button>
            </td>
        `;
    });
}

/**
 * Loads and displays the seller's orders.
 * @param {number} [page=1] - The current page number for orders.
 */
async function loadSellerOrders(page = 1) {
    try {
        // const orders = await getSellerOrders({ page });
        const orders = [
            { id: 101, customer: 'John Doe', total: '₦5000', status: 'Pending' },
            { id: 102, customer: 'Jane Smith', total: '₦7500', status: 'Shipped' },
        ]; // Mock data
        console.log('Seller orders:', orders);
        renderSellerOrdersTable(orders);

        const totalPages = 3; // Mock total pages
        renderPagination(document.getElementById('seller-orders-pagination'), {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadSellerOrders(newPage)
        });

    } catch (error) {
        console.error('Failed to load seller orders:', error);
        showToast('Failed to load orders.', 'error');
    }
}

/**
 * Renders the seller's orders in a table.
 * @param {Array<object>} orders - Array of order objects.
 */
function renderSellerOrdersTable(orders) {
    const tableBody = document.querySelector('#seller-orders-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No orders found.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.total}</td>
            <td>${order.status}</td>
            <td><button class="btn btn-sm btn-primary">View</button></td>
        `;
    });
}

/**
 * Sets up the form for updating shop profile information.
 */
function setupShopProfileForm() {
    const shopProfileForm = document.getElementById('shop-profile-form');
    if (shopProfileForm) {
        shopProfileForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(shopProfileForm);
            const profileData = Object.fromEntries(formData.entries());

            try {
                // await updateShopProfile(profileData);
                console.log('Shop profile updated:', profileData);
                showToast('Shop profile updated successfully!', 'success');
            } catch (error) {
                console.error('Failed to update shop profile:', error);
                showToast('Failed to update shop profile.', 'error');
            }
        });
    }
}

// Call initSellerDashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSellerDashboard);
