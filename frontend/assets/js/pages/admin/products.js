/*
 * products.js
 * Handles the logic for the admin product management page.
 * This includes listing products, filtering, searching, and actions like edit/delete/bulk actions.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
// import { getAdminProducts, deleteProduct, updateProductStatus, bulkUpdateProducts } from '../../core/api.js'; // Assuming these API functions exist

const adminProductsTableBody = document.getElementById('admin-products-table-body');
const adminProductsPaginationContainer = document.getElementById('admin-products-pagination');

const adminProductCategoryFilter = document.getElementById('admin-product-category-filter');
const adminProductSellerFilter = document.getElementById('admin-product-seller-filter');
const adminProductStatusFilter = document.getElementById('admin-product-status-filter');
const adminProductSearchInput = document.getElementById('admin-product-search');
const selectAllProductsCheckbox = document.getElementById('select-all-products');
const bulkActivateProductsBtn = document.getElementById('bulk-activate-products-btn');
const bulkDeactivateProductsBtn = document.getElementById('bulk-deactivate-products-btn');
const adminAddNewProductBtn = document.getElementById('admin-add-new-product-btn');

/**
 * Initializes the admin products page.
 */
export async function initAdminProductsPage() {
    console.log('Initializing Admin Products Page...');
    setupEventListeners();
    await loadAdminProducts();
}

/**
 * Sets up event listeners for filters, search, and action buttons.
 */
function setupEventListeners() {
    if (adminProductCategoryFilter) {
        adminProductCategoryFilter.addEventListener('change', () => loadAdminProducts());
    }
    if (adminProductSellerFilter) {
        adminProductSellerFilter.addEventListener('change', () => loadAdminProducts());
    }
    if (adminProductStatusFilter) {
        adminProductStatusFilter.addEventListener('change', () => loadAdminProducts());
    }
    if (adminProductSearchInput) {
        adminProductSearchInput.addEventListener('input', () => loadAdminProducts()); // Debounce in a real app
    }

    if (selectAllProductsCheckbox) {
        selectAllProductsCheckbox.addEventListener('change', (event) => {
            document.querySelectorAll('.product-select-checkbox').forEach(checkbox => {
                checkbox.checked = event.target.checked;
            });
        });
    }

    if (bulkActivateProductsBtn) {
        bulkActivateProductsBtn.addEventListener('click', () => handleBulkAction('active'));
    }
    if (bulkDeactivateProductsBtn) {
        bulkDeactivateProductsBtn.addEventListener('click', () => handleBulkAction('inactive'));
    }
    if (adminAddNewProductBtn) {
        adminAddNewProductBtn.addEventListener('click', () => {
            console.log('Redirecting to add new product page (admin)...');
            // navigateTo('/admin/add-product.html'); // Example redirection
        });
    }

    if (adminProductsTableBody) {
        adminProductsTableBody.addEventListener('click', async (event) => {
            const target = event.target;
            const productId = target.closest('tr')?.dataset.productId; // Assuming data-product-id on table row

            if (!productId) return;

            if (target.classList.contains('view-product-btn')) {
                console.log(`View product: ${productId}`);
                // navigateTo(`/admin/product-details.html?id=${productId}`);
            } else if (target.classList.contains('edit-product-btn')) {
                console.log(`Edit product: ${productId}`);
                // navigateTo(`/admin/product-edit.html?id=${productId}`);
            } else if (target.classList.contains('delete-product-btn')) {
                await handleDeleteProduct(productId);
            }
        });
    }
}

/**
 * Loads and displays admin products based on current filters and search.
 * @param {number} [page=1] - The current page number.
 */
async function loadAdminProducts(page = 1) {
    const filters = {
        category: adminProductCategoryFilter ? adminProductCategoryFilter.value : 'all',
        seller: adminProductSellerFilter ? adminProductSellerFilter.value : 'all',
        status: adminProductStatusFilter ? adminProductStatusFilter.value : 'all',
        search: adminProductSearchInput ? adminProductSearchInput.value : '',
        page: page,
        limit: 10 // Items per page
    };

    try {
        // const response = await getAdminProducts(filters);
        // const products = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const allProducts = [
            { id: 'P001', name: 'Laptop Pro', seller: 'Shop A', category: 'electronics', price: 150000, stock: 10, status: 'active' },
            { id: 'P002', name: 'Mechanical Keyboard', seller: 'Shop A', category: 'electronics', price: 45000, stock: 5, status: 'active' },
            { id: 'P003', name: 'Designer Dress', seller: 'Shop B', category: 'fashion', price: 30000, stock: 20, status: 'inactive' },
            { id: 'P004', name: 'Organic Honey', seller: 'Shop C', category: 'food', price: 5000, stock: 50, status: 'pending' },
            { id: 'P005', name: 'Handmade Soap', seller: 'Shop B', category: 'beauty', price: 2500, stock: 15, status: 'active' },
        ];

        const filteredProducts = allProducts.filter(product => {
            const categoryMatch = filters.category === 'all' || product.category === filters.category;
            const sellerMatch = filters.seller === 'all' || product.seller === filters.seller;
            const statusMatch = filters.status === 'all' || product.status === filters.status;
            const searchMatch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                                product.id.toLowerCase().includes(filters.search.toLowerCase());
            return categoryMatch && sellerMatch && statusMatch && searchMatch;
        });

        const startIndex = (page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const products = filteredProducts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredProducts.length / filters.limit);

        renderProductsTable(products);
        renderPagination(adminProductsPaginationContainer, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadAdminProducts(newPage)
        });

    } catch (error) {
        console.error('Failed to load admin products:', error);
        showToast('Failed to load products. Please try again.', 'error');
    }
}

/**
 * Renders the list of products in a table.
 * @param {Array<object>} products - An array of product objects.
 */
function renderProductsTable(products) {
    if (!adminProductsTableBody) return;

    adminProductsTableBody.innerHTML = '';
    if (products.length === 0) {
        adminProductsTableBody.innerHTML = '<tr><td colspan="9" class="text-center">No products found matching your criteria.</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = adminProductsTableBody.insertRow();
        row.dataset.productId = product.id;
        row.innerHTML = `
            <td><input type="checkbox" class="product-select-checkbox" data-product-id="${product.id}"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.seller}</td>
            <td>${product.category}</td>
            <td>₦${product.price.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge status-${product.status}">${product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary view-product-btn">View</button>
                <button class="btn btn-sm btn-secondary edit-product-btn">Edit</button>
                <button class="btn btn-sm btn-error delete-product-btn">Delete</button>
            </td>
        `;
    });
}

/**
 * Handles the deletion of a product.
 * @param {string} productId - The ID of the product to delete.
 */
async function handleDeleteProduct(productId) {
    if (confirm(`Are you sure you want to delete product ${productId}? This action cannot be undone.`)) {
        try {
            // await deleteProduct(productId);
            showToast(`Product ${productId} deleted successfully.`, 'success');
            await loadAdminProducts(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete product:', error);
            showToast('Failed to delete product. Please try again.', 'error');
        }
    }
}

/**
 * Handles bulk actions (activate/deactivate) for selected products.
 * @param {string} status - The status to set ('active' or 'inactive').
 */
async function handleBulkAction(status) {
    const selectedProductIds = Array.from(document.querySelectorAll('.product-select-checkbox:checked'))
                                .map(checkbox => checkbox.dataset.productId);

    if (selectedProductIds.length === 0) {
        showToast('No products selected for bulk action.', 'info');
        return;
    }

    if (confirm(`Are you sure you want to set status to '${status}' for ${selectedProductIds.length} selected products?`)) {
        try {
            // await bulkUpdateProducts(selectedProductIds, status);
            showToast(`Successfully updated status for ${selectedProductIds.length} products to '${status}'.`, 'success');
            await loadAdminProducts(); // Refresh the list
        } catch (error) {
            console.error('Failed to perform bulk action:', error);
            showToast('Failed to perform bulk action. Please try again.', 'error');
        }
    }
}

// Call initAdminProductsPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminProductsPage);
