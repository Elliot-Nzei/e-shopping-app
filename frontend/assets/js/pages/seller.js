/*
 * seller.js
 * Logic for the seller dashboard and related functionalities.
 * This includes managing products, orders, shop profile, and analytics for sellers.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
// import { getSellerProducts, getSellerOrders, updateShopProfile } from '../../core/api.js'; // Assuming these API functions exist

/**
 * Initializes the seller dashboard page.
 */
export async function initSellerDashboard() {
    console.log('Initializing Seller Dashboard...');
    setupSidebarNavigation();
    // Load initial overview data
    loadOverviewData();
    // TODO: Initialize analytics charts, other seller-specific modules
}

/**
 * Sets up the sidebar navigation for the seller dashboard.
 */
function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.dashboard-sidebar .sidebar-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Remove active class from all links and hide all sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            dashboardSections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding section
            const targetSectionId = link.dataset.section;
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Call specific load functions for each section
                switch (targetSectionId) {
                    case 'overview':
                        loadOverviewData();
                        break;
                    case 'products':
                        loadSellerProducts();
                        break;
                    case 'orders':
                        loadSellerOrders();
                        break;
                    case 'analytics':
                        loadSellerAnalytics();
                        break;
                    case 'shop-profile':
                        loadShopProfile();
                        break;
                    case 'add-product':
                        // No specific load function, just display form
                        break;
                }
            }
        });
    });
}

/**
 * Loads data for the overview section of the dashboard.
 */
function loadOverviewData() {
    console.log('Loading overview data...');
    // Mock data for now
    const sales = 150000;
    const orders = 50;
    const products = 25;
    const pendingOrders = 5;

    document.querySelector('#overview .summary-card:nth-child(1) .metric').textContent = `₦${sales.toLocaleString()}`;
    document.querySelector('#overview .summary-card:nth-child(2) .metric').textContent = orders;
    document.querySelector('#overview .summary-card:nth-child(3) .metric').textContent = products;
    document.querySelector('#overview .summary-card:nth-child(4) .metric').textContent = pendingOrders;

    // Initialize Chart.js for revenue graph
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 30000, 50000, 20000, 35000],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

/**
 * Loads and displays the seller's products.
 * @param {number} [page=1] - The current page number for products.
 */
async function loadSellerProducts(page = 1) {
    console.log('Loading seller products...');
    // try {
    //     const products = await getSellerProducts({ page });
    //     renderSellerProductsTable(products);
    //     const totalPages = products.totalPages; // Assuming API returns total pages
    //     renderPagination(document.getElementById('seller-products-pagination'), {
    //         currentPage: page,
    //         totalPages: totalPages,
    //         onPageChange: (newPage) => loadSellerProducts(newPage)
    //     });
    // } catch (error) {
    //     console.error('Failed to load seller products:', error);
    //     showToast('Failed to load products.', 'error');
    // }
    // Mock data and rendering for now
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.innerHTML = `
            <h2>My Products</h2>
            <p>Product listing and management will be implemented here.</p>
            <button class="btn btn-primary">Add New Product</button>
            <!-- Example table structure -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>P001</td>
                        <td>Product A</td>
                        <td>₦10,000</td>
                        <td>100</td>
                        <td><button class="btn btn-sm btn-secondary">Edit</button> <button class="btn btn-sm btn-error">Delete</button></td>
                    </tr>
                </tbody>
            </table>
            <div id="seller-products-pagination" class="pagination-container"></div>
        `;
    }
}

/**
 * Loads and displays the seller's orders.
 * @param {number} [page=1] - The current page number for orders.
 */
async function loadSellerOrders(page = 1) {
    console.log('Loading seller orders...');
    // try {
    //     const orders = await getSellerOrders({ page });
    //     renderSellerOrdersTable(orders);
    //     const totalPages = orders.totalPages; // Assuming API returns total pages
    //     renderPagination(document.getElementById('seller-orders-pagination'), {
    //         currentPage: page,
    //         totalPages: totalPages,
    //         onPageChange: (newPage) => loadSellerOrders(newPage)
    //     });
    // } catch (error) {
    //     console.error('Failed to load seller orders:', error);
    //     showToast('Failed to load orders.', 'error');
    // }
    // Mock data and rendering for now
    const ordersSection = document.getElementById('orders');
    if (ordersSection) {
        ordersSection.innerHTML = `
            <h2>My Orders</h2>
            <p>Order listing and management will be implemented here.</p>
            <!-- Example table structure -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ORD001</td>
                        <td>John Doe</td>
                        <td>₦15,000</td>
                        <td>Pending</td>
                        <td><button class="btn btn-sm btn-primary">View</button></td>
                    </tr>
                </tbody>
            </table>
            <div id="seller-orders-pagination" class="pagination-container"></div>
        `;
    }
}

/**
 * Loads and displays seller analytics.
 */
function loadSellerAnalytics() {
    console.log('Loading seller analytics...');
    const analyticsSection = document.getElementById('analytics');
    if (analyticsSection) {
        analyticsSection.innerHTML = `
            <h2>Analytics</h2>
            <p>Interactive charts and reports for sales trends, product performance, etc. will be here.</p>
            <canvas id="salesChart"></canvas>
        `;
        // Example Chart.js for sales chart
        const ctx = document.getElementById('salesChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Sales',
                        data: [100, 200, 150, 300, 250, 400],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
}

/**
 * Loads and displays the shop profile management section.
 */
function loadShopProfile() {
    console.log('Loading shop profile...');
    const shopProfileSection = document.getElementById('shop-profile');
    if (shopProfileSection) {
        shopProfileSection.innerHTML = `
            <h2>Shop Profile</h2>
            <p>Manage your shop's public profile, branding, and contact information.</p>
            <form id="shop-profile-form">
                <div class="form-group">
                    <label for="shop-name">Shop Name</label>
                    <input type="text" id="shop-name" name="shop_name" value="My Awesome Shop">
                </div>
                <div class="form-group">
                    <label for="shop-description">Description</label>
                    <textarea id="shop-description" name="shop_description" rows="5">Welcome to My Awesome Shop! We sell quality products.</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Save Shop Profile</button>
            </form>
        `;
        // TODO: Attach form submission listener for shop profile
    }
}

// Call initSellerDashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSellerDashboard);