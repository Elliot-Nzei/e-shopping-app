/*
 * products.js
 * Handles the logic for the seller's product management page.
 * This includes listing products, filtering, searching, and actions like edit/delete.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
// import { getSellerProducts, deleteProduct, updateProductStatus } from '../../core/api.js'; // Assuming these API functions exist

const sellerProductsGrid = document.getElementById('seller-products-grid');
const sellerProductsPagination = document.getElementById('seller-products-pagination');
const addProductBtn = document.getElementById('add-new-product-btn');

const productCategoryFilter = document.getElementById('product-category-filter');
const productStatusFilter = document.getElementById('product-status-filter');
const productSearchInput = document.getElementById('product-search');

/**
 * Initializes the seller products page.
 */
export async function initSellerProductsPage() {
    console.log('Initializing Seller Products Page...');
    setupEventListeners();
    await loadSellerProducts();
}

/**
 * Sets up event listeners for filters, search, and action buttons.
 */
function setupEventListeners() {
    if (productCategoryFilter) {
        productCategoryFilter.addEventListener('change', () => loadSellerProducts());
    }
    if (productStatusFilter) {
        productStatusFilter.addEventListener('change', () => loadSellerProducts());
    }
    if (productSearchInput) {
        productSearchInput.addEventListener('input', () => loadSellerProducts()); // Debounce in a real app
    }
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            // Redirect to add-product page or open a modal
            console.log('Redirecting to add new product page...');
            // navigateTo('/seller/add-product.html'); // Example redirection
        });
    }

    if (sellerProductsGrid) {
        sellerProductsGrid.addEventListener('click', async (event) => {
            const target = event.target;
            const productCard = target.closest('.product-card');
            if (!productCard) return;

            const productId = productCard.dataset.productId; // Assuming data-product-id attribute

            if (target.classList.contains('edit-product-btn')) {
                console.log(`Edit product: ${productId}`);
                // navigateTo(`/seller/edit-product.html?id=${productId}`);
            } else if (target.classList.contains('delete-product-btn')) {
                await handleDeleteProduct(productId);
            }
        });
    }
}

/**
 * Loads and displays the seller's products based on filters and search.
 * @param {number} [page=1] - The current page number.
 */
async function loadSellerProducts(page = 1) {
    const filters = {
        category: productCategoryFilter ? productCategoryFilter.value : 'all',
        status: productStatusFilter ? productStatusFilter.value : 'all',
        search: productSearchInput ? productSearchInput.value : '',
        page: page,
        limit: 10 // Items per page
    };

    try {
        // const response = await getSellerProducts(filters);
        // const products = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const allProducts = [
            { id: 'P001', name: 'Laptop Pro', category: 'electronics', price: 150000, stock: 10, status: 'active', imageUrl: 'https://via.placeholder.com/200' },
            { id: 'P002', name: 'Mechanical Keyboard', category: 'electronics', price: 45000, stock: 5, status: 'active', imageUrl: 'https://via.placeholder.com/200' },
            { id: 'P003', name: 'Designer Dress', category: 'fashion', price: 30000, stock: 20, status: 'inactive', imageUrl: 'https://via.placeholder.com/200' },
            { id: 'P004', name: 'Organic Honey', category: 'food', price: 5000, stock: 50, status: 'active', imageUrl: 'https://via.placeholder.com/200' },
            { id: 'P005', name: 'Handmade Soap', category: 'beauty', price: 2500, stock: 15, status: 'draft', imageUrl: 'https://via.placeholder.com/200' },
        ];

        const filteredProducts = allProducts.filter(product => {
            const categoryMatch = filters.category === 'all' || product.category === filters.category;
            const statusMatch = filters.status === 'all' || product.status === filters.status;
            const searchMatch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                                product.id.toLowerCase().includes(filters.search.toLowerCase());
            return categoryMatch && statusMatch && searchMatch;
        });

        const startIndex = (page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const products = filteredProducts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredProducts.length / filters.limit);

        renderProductsGrid(products);
        renderPagination(sellerProductsPagination, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadSellerProducts(newPage)
        });

    } catch (error) {
        console.error('Failed to load seller products:', error);
        showToast('Failed to load products. Please try again.', 'error');
    }
}

/**
 * Renders the products in a grid/card view.
 * @param {Array<object>} products - An array of product objects.
 */
function renderProductsGrid(products) {
    if (!sellerProductsGrid) return;

    sellerProductsGrid.innerHTML = '';
    if (products.length === 0) {
        sellerProductsGrid.innerHTML = '<p class="text-center">No products found matching your criteria.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">₦${product.price.toLocaleString()}</p>
                <p class="product-stock">Stock: ${product.stock}</p>
                <p class="product-status status-${product.status}">${product.status.charAt(0).toUpperCase() + product.status.slice(1)}</p>
                <div class="product-actions">
                    <button class="btn btn-secondary btn-sm edit-product-btn">Edit</button>
                    <button class="btn btn-error btn-sm delete-product-btn">Delete</button>
                </div>
            </div>
        `;
        sellerProductsGrid.appendChild(productCard);
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
            await loadSellerProducts(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete product:', error);
            showToast('Failed to delete product. Please try again.', 'error');
        }
    }
}

// Call initSellerProductsPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSellerProductsPage);
