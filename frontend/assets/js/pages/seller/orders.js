/*
 * orders.js
 * Handles the logic for the seller's orders page.
 * This includes displaying orders, filtering, searching, and actions like updating status or issuing refunds.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
import { openModal, closeModal } from '../../components/modal.js';
// import { getSellerOrders, updateOrderStatus, issueRefund } from '../../core/api.js'; // Assuming these API functions exist

const sellerOrdersTableBody = document.getElementById('seller-orders-table-body');
const sellerOrdersPaginationContainer = document.getElementById('seller-orders-pagination');
const sellerOrderDetailsModal = document.getElementById('sellerOrderDetailsModal');

const orderStatusFilter = document.getElementById('order-status-filter');
const orderDateFilter = document.getElementById('order-date-filter');
const orderSellerFilter = document.getElementById('order-seller-filter'); // This might be for admin, but keeping for consistency
const orderPaymentStatusFilter = document.getElementById('order-payment-status-filter');
const orderSearchInput = document.getElementById('order-search');

let currentOrderData = null; // To store data of the order currently in modal

/**
 * Initializes the seller orders page.
 */
export async function initSellerOrdersPage() {
    console.log('Initializing Seller Orders Page...');
    setupEventListeners();
    await loadSellerOrders();
}

/**
 * Sets up event listeners for filters, search, and table actions.
 */
function setupEventListeners() {
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', () => loadSellerOrders());
    }
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', () => loadSellerOrders());
    }
    if (orderSellerFilter) {
        orderSellerFilter.addEventListener('change', () => loadSellerOrders());
    }
    if (orderPaymentStatusFilter) {
        orderPaymentStatusFilter.addEventListener('change', () => loadSellerOrders());
    }
    if (orderSearchInput) {
        orderSearchInput.addEventListener('input', () => loadSellerOrders()); // Debounce in a real app
    }

    if (sellerOrdersTableBody) {
        sellerOrdersTableBody.addEventListener('click', async (event) => {
            const target = event.target;
            const orderId = target.closest('tr')?.dataset.orderId; // Assuming data-order-id on table row

            if (!orderId) return;

            if (target.classList.contains('view-order-details-btn')) {
                displayOrderDetails(orderId);
            } else if (target.classList.contains('update-status-btn')) {
                // Prompt for new status or open a modal for status update
                const newStatus = prompt('Enter new status (pending, shipped, delivered, cancelled):');
                if (newStatus) {
                    await handleUpdateOrderStatus(orderId, newStatus);
                }
            }
        });
    }

    if (sellerOrderDetailsModal) {
        sellerOrderDetailsModal.addEventListener('click', (event) => {
            if (event.target.id === 'issueRefundBtn') {
                handleIssueRefund();
            } else if (event.target.id === 'exportOrderBtn') {
                handleExportOrder();
            }
        });
    }
}

/**
 * Loads and displays seller orders based on current filters and search.
 * @param {number} [page=1] - The current page number.
 */
async function loadSellerOrders(page = 1) {
    const filters = {
        status: orderStatusFilter ? orderStatusFilter.value : 'all',
        date: orderDateFilter ? orderDateFilter.value : '',
        seller: orderSellerFilter ? orderSellerFilter.value : 'all',
        paymentStatus: orderPaymentStatusFilter ? orderPaymentStatusFilter.value : 'all',
        search: orderSearchInput ? orderSearchInput.value : '',
        page: page,
        limit: 10 // Items per page
    };

    try {
        // const response = await getSellerOrders(filters);
        // const orders = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const allOrders = [
            { id: 'ORD001', user: 'John Doe', seller: 'Shop A', date: '2025-07-01', status: 'pending', total: 15000, paymentStatus: 'paid', address: '123 Main St', payment: 'Card', tracking: 'TRK001', items: [{name: 'Item 1', qty: 1, price: 2000}, {name: 'Item 2', qty: 1, price: 3000}] },
            { id: 'ORD002', user: 'Jane Smith', seller: 'Shop A', date: '2025-06-25', status: 'delivered', total: 25000, paymentStatus: 'paid', address: '456 Oak Ave', payment: 'Cash', tracking: 'TRK002', items: [{name: 'Item 3', qty: 2, price: 6000}, {name: 'Item 4', qty: 1, price: 500}] },
            { id: 'ORD003', user: 'Peter Jones', seller: 'Shop B', date: '2025-06-20', status: 'shipped', total: 3000, paymentStatus: 'unpaid', address: '789 Pine Ln', payment: 'Card', tracking: 'TRK003', items: [{name: 'Item 5', qty: 1, price: 3000}] },
            { id: 'ORD004', user: 'Alice Brown', seller: 'Shop A', date: '2025-06-15', status: 'cancelled', total: 8000, paymentStatus: 'paid', address: '101 Elm Rd', payment: 'Card', tracking: 'N/A', items: [{name: 'Item 6', qty: 1, price: 8000}] },
        ];

        const filteredOrders = allOrders.filter(order => {
            const statusMatch = filters.status === 'all' || order.status === filters.status;
            const sellerMatch = filters.seller === 'all' || order.seller === filters.seller;
            const paymentStatusMatch = filters.paymentStatus === 'all' || order.paymentStatus === filters.paymentStatus;
            const searchMatch = order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                                order.user.toLowerCase().includes(filters.search.toLowerCase());
            // Add date filtering logic here if needed
            return statusMatch && sellerMatch && paymentStatusMatch && searchMatch;
        });

        const startIndex = (page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const orders = filteredOrders.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredOrders.length / filters.limit);

        renderOrdersTable(orders);
        renderPagination(sellerOrdersPaginationContainer, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadSellerOrders(newPage)
        });

    } catch (error) {
        console.error('Failed to load seller orders:', error);
        showToast('Failed to load orders. Please try again.', 'error');
    }
}

/**
 * Renders the list of orders in a table.
 * @param {Array<object>} orders - An array of order objects.
 */
function renderOrdersTable(orders) {
    if (!sellerOrdersTableBody) return;

    sellerOrdersTableBody.innerHTML = '';
    if (orders.length === 0) {
        sellerOrdersTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No orders found matching your criteria.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = sellerOrdersTableBody.insertRow();
        row.dataset.orderId = order.id; // Store order ID on the row
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.user}</td>
            <td>${order.seller}</td>
            <td>${order.date}</td>
            <td><span class="status-badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td>₦${order.total.toLocaleString()}</td>
            <td>${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</td>
            <td>
                <button class="btn btn-sm btn-primary view-order-details-btn">View</button>
                <button class="btn btn-sm btn-secondary update-status-btn">Update Status</button>
            </td>
        `;
    });
}

/**
 * Displays the details of a specific order in a modal.
 * @param {string} orderId - The ID of the order to display.
 */
async function displayOrderDetails(orderId) {
    // In a real app, fetch single order details from API if not already loaded
    const allOrders = [
        { id: 'ORD001', user: 'John Doe', seller: 'Shop A', date: '2025-07-01', status: 'pending', total: 15000, paymentStatus: 'paid', address: '123 Main St', payment: 'Card', tracking: 'TRK001', items: [{name: 'Item 1', qty: 1, price: 2000}, {name: 'Item 2', qty: 1, price: 3000}] },
        { id: 'ORD002', user: 'Jane Smith', seller: 'Shop A', date: '2025-06-25', status: 'delivered', total: 25000, paymentStatus: 'paid', address: '456 Oak Ave', payment: 'Cash', tracking: 'TRK002', items: [{name: 'Item 3', qty: 2, price: 6000}, {name: 'Item 4', qty: 1, price: 500}] },
        { id: 'ORD003', user: 'Peter Jones', seller: 'Shop B', date: '2025-06-20', status: 'shipped', total: 3000, paymentStatus: 'unpaid', address: '789 Pine Ln', payment: 'Card', tracking: 'TRK003', items: [{name: 'Item 5', qty: 1, price: 3000}] },
        { id: 'ORD004', user: 'Alice Brown', seller: 'Shop A', date: '2025-06-15', status: 'cancelled', total: 8000, paymentStatus: 'paid', address: '101 Elm Rd', payment: 'Card', tracking: 'N/A', items: [{name: 'Item 6', qty: 1, price: 8000}] },
    ];
    currentOrderData = allOrders.find(order => order.id === orderId);

    if (currentOrderData) {
        if (modalOrderId) modalOrderId.textContent = currentOrderData.id;
        if (modalCustomerName) modalCustomerName.textContent = currentOrderData.user;
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

        openModal('sellerOrderDetailsModal');
    } else {
        showToast('Order details not found.', 'error');
    }
}

/**
 * Handles updating the status of an order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} newStatus - The new status for the order.
 */
async function handleUpdateOrderStatus(orderId, newStatus) {
    try {
        // await updateOrderStatus(orderId, newStatus);
        showToast(`Order #${orderId} status updated to ${newStatus}.`, 'success');
        await loadSellerOrders(); // Refresh orders list
    } catch (error) {
        console.error('Failed to update order status:', error);
        showToast('Failed to update order status. Please try again.', 'error');
    }
}

/**
 * Handles issuing a refund for an order.
 */
async function handleIssueRefund() {
    if (!currentOrderData) return;

    if (confirm(`Are you sure you want to issue a refund for Order #${currentOrderData.id}?`)) {
        try {
            // await issueRefund(currentOrderData.id);
            showToast(`Refund issued for Order #${currentOrderData.id}.`, 'success');
            closeModal('sellerOrderDetailsModal');
            await loadSellerOrders(); // Refresh orders list
        } catch (error) {
            console.error('Failed to issue refund:', error);
            showToast('Failed to issue refund. Please try again.', 'error');
        }
    }
}

/**
 * Handles exporting order details.
 */
async function handleExportOrder() {
    if (!currentOrderData) return;

    showToast(`Exporting details for Order #${currentOrderData.id}.`, 'info');
    console.log('Exporting order:', currentOrderData);
    // TODO: Implement actual export logic (e.g., generate PDF/CSV)
}

// Call initSellerOrdersPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSellerOrdersPage);
