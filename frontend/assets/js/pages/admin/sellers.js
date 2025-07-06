/*
 * sellers.js
 * Handles the logic for the admin seller management page.
 * This includes listing sellers, filtering, searching, and actions like approve/suspend/delete.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
// import { getSellers, updateSellerStatus, deleteSeller, bulkUpdateSellers } from '../../core/api.js'; // Assuming these API functions exist

const adminSellersTableBody = document.getElementById('admin-sellers-table-body');
const adminSellersPaginationContainer = document.getElementById('admin-sellers-pagination');

const sellerStatusFilter = document.getElementById('seller-status-filter');
const sellerSearchInput = document.getElementById('seller-search');
const selectAllSellersCheckbox = document.getElementById('select-all-sellers');
const bulkApproveSellersBtn = document.getElementById('bulk-approve-sellers-btn');
const bulkSuspendSellersBtn = document.getElementById('bulk-suspend-sellers-btn');
const addNewSellerBtn = document.getElementById('add-new-seller-btn');

/**
 * Initializes the admin sellers page.
 */
export async function initAdminSellersPage() {
    console.log('Initializing Admin Sellers Page...');
    setupEventListeners();
    await loadAdminSellers();
}

/**
 * Sets up event listeners for filters, search, and action buttons.
 */
function setupEventListeners() {
    if (sellerStatusFilter) {
        sellerStatusFilter.addEventListener('change', () => loadAdminSellers());
    }
    if (sellerSearchInput) {
        sellerSearchInput.addEventListener('input', () => loadAdminSellers()); // Debounce in a real app
    }

    if (selectAllSellersCheckbox) {
        selectAllSellersCheckbox.addEventListener('change', (event) => {
            document.querySelectorAll('.seller-select-checkbox').forEach(checkbox => {
                checkbox.checked = event.target.checked;
            });
        });
    }

    if (bulkApproveSellersBtn) {
        bulkApproveSellersBtn.addEventListener('click', () => handleBulkAction('approved'));
    }
    if (bulkSuspendSellersBtn) {
        bulkSuspendSellersBtn.addEventListener('click', () => handleBulkAction('suspended'));
    }
    if (addNewSellerBtn) {
        addNewSellerBtn.addEventListener('click', () => {
            console.log('Redirecting to add new seller page...');
            // navigateTo('/admin/add-seller.html'); // Example redirection
        });
    }

    if (adminSellersTableBody) {
        adminSellersTableBody.addEventListener('click', async (event) => {
            const target = event.target;
            const sellerId = target.closest('tr')?.dataset.sellerId; // Assuming data-seller-id on table row

            if (!sellerId) return;

            if (target.classList.contains('view-seller-btn')) {
                console.log(`View seller: ${sellerId}`);
                // navigateTo(`/admin/seller-details.html?id=${sellerId}`);
            } else if (target.classList.contains('edit-seller-btn')) {
                console.log(`Edit seller: ${sellerId}`);
                // navigateTo(`/admin/seller-edit.html?id=${sellerId}`);
            } else if (target.classList.contains('delete-seller-btn')) {
                await handleDeleteSeller(sellerId);
            }
        });
    }
}

/**
 * Loads and displays admin sellers based on current filters and search.
 * @param {number} [page=1] - The current page number.
 */
async function loadAdminSellers(page = 1) {
    const filters = {
        status: sellerStatusFilter ? sellerStatusFilter.value : 'all',
        search: sellerSearchInput ? sellerSearchInput.value : '',
        page: page,
        limit: 10 // Items per page
    };

    try {
        // const response = await getSellers(filters);
        // const sellers = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const allSellers = [
            { id: 101, businessName: 'Shop A', ownerEmail: 'shopa@example.com', status: 'approved', permissions: 'Product, Order', dateJoined: '2023-05-01' },
            { id: 102, businessName: 'Shop B', ownerEmail: 'shopb@example.com', status: 'pending', permissions: 'None', dateJoined: '2024-01-20' },
            { id: 103, businessName: 'Shop C', ownerEmail: 'shopc@example.com', status: 'suspended', permissions: 'Product', dateJoined: '2023-11-11' },
        ];

        const filteredSellers = allSellers.filter(seller => {
            const statusMatch = filters.status === 'all' || seller.status === filters.status;
            const searchMatch = seller.businessName.toLowerCase().includes(filters.search.toLowerCase()) ||
                                seller.ownerEmail.toLowerCase().includes(filters.search.toLowerCase());
            return statusMatch && searchMatch;
        });

        const startIndex = (page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const sellers = filteredSellers.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredSellers.length / filters.limit);

        renderSellersTable(sellers);
        renderPagination(adminSellersPaginationContainer, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadAdminSellers(newPage)
        });

    } catch (error) {
        console.error('Failed to load admin sellers:', error);
        showToast('Failed to load sellers. Please try again.', 'error');
    }
}

/**
 * Renders the list of sellers in a table.
 * @param {Array<object>} sellers - An array of seller objects.
 */
function renderSellersTable(sellers) {
    if (!adminSellersTableBody) return;

    adminSellersTableBody.innerHTML = '';
    if (sellers.length === 0) {
        adminSellersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No sellers found matching your criteria.</td></tr>';
        return;
    }

    sellers.forEach(seller => {
        const row = adminSellersTableBody.insertRow();
        row.dataset.sellerId = seller.id; // Store seller ID on the row
        row.innerHTML = `
            <td><input type="checkbox" class="seller-select-checkbox" data-seller-id="${seller.id}"></td>
            <td>${seller.id}</td>
            <td>${seller.businessName}</td>
            <td>${seller.ownerEmail}</td>
            <td><span class="status-badge status-${seller.status}">${seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}</span></td>
            <td>${seller.permissions}</td>
            <td>
                <button class="btn btn-sm btn-primary view-seller-btn">View</button>
                <button class="btn btn-sm btn-secondary edit-seller-btn">Edit</button>
                <button class="btn btn-sm btn-error delete-seller-btn">Delete</button>
            </td>
        `;
    });
}

/**
 * Handles the deletion of a seller.
 * @param {string} sellerId - The ID of the seller to delete.
 */
async function handleDeleteSeller(sellerId) {
    if (confirm(`Are you sure you want to delete seller ${sellerId}? This action cannot be undone.`)) {
        try {
            // await deleteSeller(sellerId);
            showToast(`Seller ${sellerId} deleted successfully.`, 'success');
            await loadAdminSellers(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete seller:', error);
            showToast('Failed to delete seller. Please try again.', 'error');
        }
    }
}

/**
 * Handles bulk actions (approve/suspend) for selected sellers.
 * @param {string} status - The status to set ('approved' or 'suspended').
 */
async function handleBulkAction(status) {
    const selectedSellerIds = Array.from(document.querySelectorAll('.seller-select-checkbox:checked'))
                                .map(checkbox => checkbox.dataset.sellerId);

    if (selectedSellerIds.length === 0) {
        showToast('No sellers selected for bulk action.', 'info');
        return;
    }

    if (confirm(`Are you sure you want to set status to '${status}' for ${selectedSellerIds.length} selected sellers?`)) {
        try {
            // await bulkUpdateSellers(selectedSellerIds, status);
            showToast(`Successfully updated status for ${selectedSellerIds.length} sellers to '${status}'.`, 'success');
            await loadAdminSellers(); // Refresh the list
        } catch (error) {
            console.error('Failed to perform bulk action:', error);
            showToast('Failed to perform bulk action. Please try again.', 'error');
        }
    }
}

// Call initAdminSellersPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminSellersPage);
