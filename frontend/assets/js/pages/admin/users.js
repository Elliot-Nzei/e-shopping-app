/*
 * users.js
 * Handles the logic for the admin user management page.
 * This includes listing users, filtering, searching, and actions like edit/delete/bulk actions.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
// import { getUsers, updateUserStatus, deleteUser, bulkUpdateUsers } from '../../core/api.js'; // Assuming these API functions exist

const adminUsersTableBody = document.getElementById('admin-users-table-body');
const adminUsersPaginationContainer = document.getElementById('admin-users-pagination');

const userStatusFilter = document.getElementById('user-status-filter');
const registrationDateFilter = document.getElementById('registration-date-filter');
const userSearchInput = document.getElementById('user-search');
const selectAllUsersCheckbox = document.getElementById('select-all-users');
const bulkActivateUsersBtn = document.getElementById('bulk-activate-users-btn');
const bulkDeactivateUsersBtn = document.getElementById('bulk-deactivate-users-btn');
const exportUsersBtn = document.getElementById('export-users-btn');

/**
 * Initializes the admin users page.
 */
export async function initAdminUsersPage() {
    console.log('Initializing Admin Users Page...');
    setupEventListeners();
    await loadAdminUsers();
}

/**
 * Sets up event listeners for filters, search, and action buttons.
 */
function setupEventListeners() {
    if (userStatusFilter) {
        userStatusFilter.addEventListener('change', () => loadAdminUsers());
    }
    if (registrationDateFilter) {
        registrationDateFilter.addEventListener('change', () => loadAdminUsers());
    }
    if (userSearchInput) {
        userSearchInput.addEventListener('input', () => loadAdminUsers()); // Debounce in a real app
    }

    if (selectAllUsersCheckbox) {
        selectAllUsersCheckbox.addEventListener('change', (event) => {
            document.querySelectorAll('.user-select-checkbox').forEach(checkbox => {
                checkbox.checked = event.target.checked;
            });
        });
    }

    if (bulkActivateUsersBtn) {
        bulkActivateUsersBtn.addEventListener('click', () => handleBulkAction('active'));
    }
    if (bulkDeactivateUsersBtn) {
        bulkDeactivateUsersBtn.addEventListener('click', () => handleBulkAction('suspended'));
    }
    if (exportUsersBtn) {
        exportUsersBtn.addEventListener('click', handleExportUsers);
    }

    if (adminUsersTableBody) {
        adminUsersTableBody.addEventListener('click', async (event) => {
            const target = event.target;
            const userId = target.closest('tr')?.dataset.userId; // Assuming data-user-id on table row

            if (!userId) return;

            if (target.classList.contains('view-user-btn')) {
                console.log(`View user: ${userId}`);
                // navigateTo(`/admin/user-details.html?id=${userId}`);
            } else if (target.classList.contains('edit-user-btn')) {
                console.log(`Edit user: ${userId}`);
                // navigateTo(`/admin/user-edit.html?id=${userId}`);
            } else if (target.classList.contains('delete-user-btn')) {
                await handleDeleteUser(userId);
            }
        });
    }
}

/**
 * Loads and displays admin users based on current filters and search.
 * @param {number} [page=1] - The current page number.
 */
async function loadAdminUsers(page = 1) {
    const filters = {
        status: userStatusFilter ? userStatusFilter.value : 'all',
        registrationDate: registrationDateFilter ? registrationDateFilter.value : '',
        search: userSearchInput ? userSearchInput.value : '',
        page: page,
        limit: 10 // Items per page
    };

    try {
        // const response = await getUsers(filters);
        // const users = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const allUsers = [
            { id: 1, username: 'john_doe', email: 'john@example.com', status: 'active', dateJoined: '2024-01-15', lastLogin: '2025-07-05' },
            { id: 2, username: 'jane_smith', email: 'jane@example.com', status: 'active', dateJoined: '2024-02-20', lastLogin: '2025-07-04' },
            { id: 3, username: 'peter_jones', email: 'peter@example.com', status: 'suspended', dateJoined: '2024-03-10', lastLogin: '2025-06-01' },
            { id: 4, username: 'alice_brown', email: 'alice@example.com', status: 'active', dateJoined: '2024-04-01', lastLogin: '2025-07-03' },
        ];

        const filteredUsers = allUsers.filter(user => {
            const statusMatch = filters.status === 'all' || user.status === filters.status;
            const searchMatch = user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
                                user.email.toLowerCase().includes(filters.search.toLowerCase());
            // Add date filtering logic here if needed
            return statusMatch && searchMatch;
        });

        const startIndex = (page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const users = filteredUsers.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredUsers.length / filters.limit);

        renderUsersTable(users);
        renderPagination(adminUsersPaginationContainer, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadAdminUsers(newPage)
        });

    } catch (error) {
        console.error('Failed to load admin users:', error);
        showToast('Failed to load users. Please try again.', 'error');
    }
}

/**
 * Renders the list of users in a table.
 * @param {Array<object>} users - An array of user objects.
 */
function renderUsersTable(users) {
    if (!adminUsersTableBody) return;

    adminUsersTableBody.innerHTML = '';
    if (users.length === 0) {
        adminUsersTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No users found matching your criteria.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = adminUsersTableBody.insertRow();
        row.dataset.userId = user.id; // Store user ID on the row
        row.innerHTML = `
            <td><input type="checkbox" class="user-select-checkbox" data-user-id="${user.id}"></td>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="status-badge status-${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td>${user.dateJoined}</td>
            <td>${user.lastLogin}</td>
            <td>
                <button class="btn btn-sm btn-primary view-user-btn">View</button>
                <button class="btn btn-sm btn-secondary edit-user-btn">Edit</button>
                <button class="btn btn-sm btn-error delete-user-btn">Delete</button>
            </td>
        `;
    });
}

/**
 * Handles the deletion of a user.
 * @param {string} userId - The ID of the user to delete.
 */
async function handleDeleteUser(userId) {
    if (confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
        try {
            // await deleteUser(userId);
            showToast(`User ${userId} deleted successfully.`, 'success');
            await loadAdminUsers(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete user:', error);
            showToast('Failed to delete user. Please try again.', 'error');
        }
    }
}

/**
 * Handles bulk actions (activate/deactivate) for selected users.
 * @param {string} status - The status to set ('active' or 'suspended').
 */
async function handleBulkAction(status) {
    const selectedUserIds = Array.from(document.querySelectorAll('.user-select-checkbox:checked'))
                                .map(checkbox => checkbox.dataset.userId);

    if (selectedUserIds.length === 0) {
        showToast('No users selected for bulk action.', 'info');
        return;
    }

    if (confirm(`Are you sure you want to set status to '${status}' for ${selectedUserIds.length} selected users?`)) {
        try {
            // await bulkUpdateUsers(selectedUserIds, status);
            showToast(`Successfully updated status for ${selectedUserIds.length} users to '${status}'.`, 'success');
            await loadAdminUsers(); // Refresh the list
        } catch (error) {
            console.error('Failed to perform bulk action:', error);
            showToast('Failed to perform bulk action. Please try again.', 'error');
        }
    }
}

/**
 * Handles exporting user data.
 */
function handleExportUsers() {
    showToast('Exporting user data...', 'info');
    // TODO: Implement actual data export logic (e.g., generate CSV/PDF)
}

// Call initAdminUsersPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminUsersPage);
