/*
 * orders.js
 * Logic for the user orders page, including displaying orders, filtering, sorting, and viewing details.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
import { openModal, closeModal } from '../../components/modal.js';
// import { getOrders, cancelOrder, reorderItems } from '../../core/api.js'; // Assuming these API functions exist

const ordersListContainer = document.getElementById('orders-list');
const ordersPaginationContainer = document.getElementById('orders-pagination');
const orderDetailsModal = document.getElementById('orderDetailsModal');
const modalOrderId = document.getElementById('modal-order-id');
const modalCustomerName = document.getElementById('modal-customer-name');
const modalDeliveryAddress = document.getElementById('modal-delivery-address');
const modalPaymentMethod = document.getElementById('modal-payment-method');
const modalTrackingInfo = document.getElementById('modal-tracking-info');
const modalOrderItems = document.getElementById('modal-order-items');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const reorderBtn = document.getElementById('reorderBtn');

const orderStatusFilter = document.getElementById('order-status-filter');
const orderDateFilter = document.getElementById('order-date-filter');
const orderSortBy = document.getElementById('order-sort-by');

let currentOrderData = null; // To store data of the order currently in modal

/**
 * Initializes the user orders page.
 */
export async function initOrdersPage() {
    console.log('Initializing Orders Page...');
    setupEventListeners();
    await loadUserOrders();
}

/**
 * Sets up event listeners for filters, sorting, and modal actions.
 */
function setupEventListeners() {
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', () => loadUserOrders());
    }
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', () => loadUserOrders());
    }
    if (orderSortBy) {
        orderSortBy.addEventListener('change', () => loadUserOrders());
    }

    if (ordersListContainer) {
        ordersListContainer.addEventListener('click', (event) => {
            const viewDetailsBtn = event.target.closest('.view-order-details');
            if (viewDetailsBtn) {
                const orderId = viewDetailsBtn.dataset.orderId; // Assuming data-order-id attribute on button
                displayOrderDetails(orderId);
            }
        });
    }

    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', handleCancelOrder);
    }
    if (reorderBtn) {
        reorderBtn.addEventListener('click', handleReorder);
    }
}

/**
 * Loads and displays user orders based on current filters and sorting.
 * @param {number} [page=1] - The current page number.
 */
async function loadUserOrders(page = 1) {
    const filters = {
        status: orderStatusFilter ? orderStatusFilter.value : 'all',
        date: orderDateFilter ? orderDateFilter.value : '',
        sortBy: orderSortBy ? orderSortBy.value : 'recent',
        page: page,
        limit: 10 // Items per page
    };

    try {
        // In a real app, fetch orders from API:
        // const response = await getOrders(filters);
        // const orders = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const allOrders = [
            { id: 'ORD001', date: '2025-07-01', total: 5000, status: 'pending', customer: 'John Doe', address: '123 Main St', payment: 'Card', tracking: 'TRK001', items: [{name: 'Item 1', qty: 1, price: 2000}, {name: 'Item 2', qty: 1, price: 3000}] },
            { id: 'ORD002', date: '2025-06-25', total: 12500, status: 'delivered', customer: 'Jane Smith', address: '456 Oak Ave', payment: 'Cash', tracking: 'TRK002', items: [{name: 'Item 3', qty: 2, price: 6000}, {name: 'Item 4', qty: 1, price: 500}] },
            { id: 'ORD003', date: '2025-06-20', total: 3000, status: 'shipped', customer: 'Peter Jones', address: '789 Pine Ln', payment: 'Card', tracking: 'TRK003', items: [{name: 'Item 5', qty: 1, price: 3000}] },
            { id: 'ORD004', date: '2025-06-15', total: 8000, status: 'cancelled', customer: 'Alice Brown', address: '101 Elm Rd', payment: 'Card', tracking: 'N/A', items: [{name: 'Item 6', qty: 1, price: 8000}] },
        ];

        const filteredOrders = allOrders.filter(order => {
            const statusMatch = filters.status === 'all' || order.status === filters.status;
            // Add date filtering logic here if needed
            return statusMatch;
        }).sort((a, b) => {
            if (filters.sortBy === 'recent') return new Date(b.date) - new Date(a.date);
            if (filters.sortBy === 'amount_desc') return b.total - a.total;
            if (filters.sortBy === 'amount_asc') return a.total - b.total;
            return 0;
        });

        const startIndex = (page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const orders = filteredOrders.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredOrders.length / filters.limit);

        renderOrdersList(orders);
        renderPagination(ordersPaginationContainer, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadUserOrders(newPage)
        });

    } catch (error) {
        console.error('Failed to load user orders:', error);
        showToast('Failed to load orders. Please try again.', 'error');
    }
}

/**
 * Renders the list of orders in card view.
 * @param {Array<object>} orders - An array of order objects.
 */
function renderOrdersList(orders) {
    if (!ordersListContainer) return;

    ordersListContainer.innerHTML = '';
    if (orders.length === 0) {
        ordersListContainer.innerHTML = '<p class="text-center">No orders found matching your criteria.</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="status-badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <p>Date: ${order.date}</p>
            <p>Total: ₦${order.total.toLocaleString()}</p>
            <button class="btn btn-primary btn-sm view-order-details" data-order-id="${order.id}">View Details</button>
        `;
        ordersListContainer.appendChild(orderCard);
    });
}

/**
 * Displays the details of a specific order in a modal.
 * @param {string} orderId - The ID of the order to display.
 */
async function displayOrderDetails(orderId) {
    // In a real app, fetch single order details from API if not already loaded
    const allOrders = [
        { id: 'ORD001', date: '2025-07-01', total: 5000, status: 'pending', customer: 'John Doe', address: '123 Main St', payment: 'Card', tracking: 'TRK001', items: [{name: 'Item 1', qty: 1, price: 2000}, {name: 'Item 2', qty: 1, price: 3000}] },
        { id: 'ORD002', date: '2025-06-25', total: 12500, status: 'delivered', customer: 'Jane Smith', address: '456 Oak Ave', payment: 'Cash', tracking: 'TRK002', items: [{name: 'Item 3', qty: 2, price: 6000}, {name: 'Item 4', qty: 1, price: 500}] },
        { id: 'ORD003', date: '2025-06-20', total: 3000, status: 'shipped', customer: 'Peter Jones', address: '789 Pine Ln', payment: 'Card', tracking: 'TRK003', items: [{name: 'Item 5', qty: 1, price: 3000}] },
        { id: 'ORD004', date: '2025-06-15', total: 8000, status: 'cancelled', customer: 'Alice Brown', address: '101 Elm Rd', payment: 'Card', tracking: 'N/A', items: [{name: 'Item 6', qty: 1, price: 8000}] },
    ];
    currentOrderData = allOrders.find(order => order.id === orderId);

    if (currentOrderData) {
        if (modalOrderId) modalOrderId.textContent = currentOrderData.id;
        if (modalCustomerName) modalCustomerName.textContent = currentOrderData.customer;
        if (modalDeliveryAddress) modalDeliveryAddress.textContent = currentOrderData.address;
        if (modalPaymentMethod) modalPaymentMethod.textContent = currentOrderData.payment;
        if (modalTrackingInfo) modalTrackingInfo.textContent = currentOrderData.tracking;

        if (modalOrderItems) {
            modalOrderItems.innerHTML = '';
            currentOrderData.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} (x${item.qty}) - ₦${item.price.toLocaleString()}`;
                modalOrderItems.appendChild(li);
            });
        }

        // Enable/disable cancel button based on status
        if (cancelOrderBtn) {
            cancelOrderBtn.disabled = !(currentOrderData.status === 'pending' || currentOrderData.status === 'shipped');
        }

        openModal('orderDetailsModal');
    } else {
        showToast('Order details not found.', 'error');
    }
}

/**
 * Handles the cancellation of an order.
 */
async function handleCancelOrder() {
    if (!currentOrderData) return;

    if (confirm(`Are you sure you want to cancel Order #${currentOrderData.id}?`)) {
        try {
            // await cancelOrder(currentOrderData.id);
            showToast(`Order #${currentOrderData.id} cancelled successfully.`, 'success');
            closeModal('orderDetailsModal');
            await loadUserOrders(); // Refresh orders list
        } catch (error) {
            console.error('Failed to cancel order:', error);
            showToast('Failed to cancel order. Please try again.', 'error');
        }
    }
}

/**
 * Handles the reordering of items from an order.
 */
async function handleReorder() {
    if (!currentOrderData) return;

    try {
        // await reorderItems(currentOrderData.id);
        showToast(`Items from Order #${currentOrderData.id} added to cart for reorder.`, 'success');
        closeModal('orderDetailsModal');
        // TODO: Redirect to cart or show cart preview
    } catch (error) {
        console.error('Failed to reorder:', error);
        showToast('Failed to reorder items. Please try again.', 'error');
    }
}

// Call initOrdersPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initOrdersPage);
