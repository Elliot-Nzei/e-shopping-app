/*
 * dashboard.js
 * Logic for the user dashboard page, inspired by Jumia's interface.
 * This includes dynamic content loading for recent orders, recommendations, and promotions.
 */

import { showToast } from '../../components/toast.js';
import { navigateTo } from '../../core/router.js';
import { getState } from '../../core/state.js';
// import { getRecentOrders, getRecommendations, getUserProfile } from '../../core/api.js'; // Assuming these API functions exist

const dashboardUsername = document.getElementById('dashboard-username');
const recentOrdersTableBody = document.getElementById('recent-orders-table-body');
const recommendationsGrid = document.getElementById('recommendations-grid');

/**
 * Initializes the user dashboard page.
 */
export async function initUserDashboardPage() {
    console.log('Initializing User Dashboard Page...');
    await loadDashboardData();
    setupEventListeners();
}

/**
 * Loads all necessary data for the dashboard.
 */
async function loadDashboardData() {
    const currentUser = getState('user');
    if (currentUser && dashboardUsername) {
        dashboardUsername.textContent = currentUser.username || 'User';
    }

    await loadRecentOrders();
    await loadRecommendations();
    // TODO: Load other summary data (total orders, wishlist items, etc.)
}

/**
 * Loads and displays recent orders.
 */
async function loadRecentOrders() {
    try {
        // const orders = await getRecentOrders();
        const orders = [
            { id: 'ORD005', date: '2025-07-01', total: 8500, status: 'delivered' },
            { id: 'ORD006', date: '2025-06-28', total: 12000, status: 'pending' },
            { id: 'ORD007', date: '2025-06-20', total: 3000, status: 'shipped' },
        ]; // Mock data

        if (recentOrdersTableBody) {
            recentOrdersTableBody.innerHTML = '';
            if (orders.length === 0) {
                recentOrdersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No recent orders.</td></tr>';
                return;
            }
            orders.forEach(order => {
                const row = recentOrdersTableBody.insertRow();
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.date}</td>
                    <td>₦${order.total.toLocaleString()}</td>
                    <td><span class="status-badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    <td><button class="btn btn-sm btn-primary view-order-details-btn" data-order-id="${order.id}">View</button></td>
                `;
            });
        }
    } catch (error) {
        console.error('Failed to load recent orders:', error);
        showToast('Failed to load recent orders.', 'error');
    }
}

/**
 * Loads and displays personalized product recommendations.
 */
async function loadRecommendations() {
    try {
        // const recommendations = await getRecommendations();
        const recommendations = [
            { id: 'REC001', name: 'Smart Home Hub', price: 25000, imageUrl: 'https://via.placeholder.com/280x200?text=SmartHub' },
            { id: 'REC002', name: 'Fitness Tracker', price: 18000, imageUrl: 'https://via.placeholder.com/280x200?text=Tracker' },
            { id: 'REC003', name: 'Noise Cancelling Earbuds', price: 32000, imageUrl: 'https://via.placeholder.com/280x200?text=Earbuds' },
            { id: 'REC004', name: 'Portable Projector', price: 60000, imageUrl: 'https://via.placeholder.com/280x200?text=Projector' },
        ]; // Mock data

        if (recommendationsGrid) {
            recommendationsGrid.innerHTML = '';
            if (recommendations.length === 0) {
                recommendationsGrid.innerHTML = '<p class="text-center">No recommendations at the moment.</p>';
                return;
            }
            recommendations.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.productId = product.id;
                productCard.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-price">₦${product.price.toLocaleString()}</p>
                        <div class="product-actions">
                            <button class="btn btn-primary btn-sm add-to-cart-btn">Add to Cart</button>
                        </div>
                    </div>
                `;
                recommendationsGrid.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Failed to load recommendations:', error);
        showToast('Failed to load recommendations.', 'error');
    }
}

/**
 * Sets up event listeners for interactive elements on the dashboard.
 */
function setupEventListeners() {
    // Example: View Order Details button in Recent Orders
    if (recentOrdersTableBody) {
        recentOrdersTableBody.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('view-order-details-btn')) {
                const orderId = target.dataset.orderId;
                navigateTo(`/user/orders.html?orderId=${orderId}`); // Navigate to specific order detail
            }
        });
    }

    // Example: Add to Cart button in Recommendations
    if (recommendationsGrid) {
        recommendationsGrid.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('add-to-cart-btn')) {
                const productId = target.closest('.product-card').dataset.productId;
                // addProductToCart(productId);
                showToast('Product added to cart!', 'success');
                console.log(`Added recommended product ${productId} to cart.`);
            } else if (target.closest('.product-card')) {
                const productId = target.closest('.product-card').dataset.productId;
                navigateTo(`/public/product-detail.html?id=${productId}`);
            }
        });
    }

    // Example: Shop Now/View All buttons in Promotions
    document.querySelectorAll('.promotion-banner .btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetUrl = event.target.closest('a')?.href || '#';
            if (targetUrl !== '#') {
                navigateTo(targetUrl);
            } else {
                showToast('Promotion link not available.', 'info');
            }
        });
    });
}

// Call initUserDashboardPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initUserDashboardPage);
