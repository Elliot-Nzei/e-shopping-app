/*
 * marketplace.js
 * Logic for the product browsing and marketplace features.
 * This includes product listing, search, filtering, and sorting.
 */

import { getProducts } from '../core/api.js';
import { showToast } from '../components/toast.js';
import { renderPagination } from '../components/pagination.js';

/**
 * Initializes the marketplace page.
 */
export async function initMarketplacePage() {
    console.log('Initializing Marketplace Page...');
    await loadMarketplaceProducts();
    setupSearchAndFilters();
    // TODO: Add event listeners for sorting, category selection, etc.
}

/**
 * Loads products for the marketplace, applying search, filter, and pagination parameters.
 * @param {object} [params={}] - Parameters for fetching products (e.g., search query, category, page, limit).
 */
async function loadMarketplaceProducts(params = {}) {
    try {
        // Example: Fetch products from API with parameters
        const products = await getProducts(params); // Assuming getProducts can take params
        console.log('Loaded marketplace products:', products);
        renderMarketplaceProductGrid(products); // Function to render products on the page

        // Example pagination setup (assuming API returns total pages/count)
        const totalPages = 10; // Placeholder, get from API response
        const currentPage = params.page || 1;
        renderPagination(document.getElementById('marketplace-pagination'), {
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: (newPage) => {
                loadMarketplaceProducts({ ...params, page: newPage });
            }
        });

    } catch (error) {
        console.error('Failed to load marketplace products:', error);
        showToast('Failed to load products. Please try again.', 'error');
    }
}

/**
 * Renders the product grid for the marketplace.
 * @param {Array<object>} products - An array of product objects.
 */
function renderMarketplaceProductGrid(products) {
    const productGridContainer = document.getElementById('marketplace-product-grid');
    if (!productGridContainer) return;

    productGridContainer.innerHTML = '';

    if (products.length === 0) {
        productGridContainer.innerHTML = '<p>No products found matching your criteria.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: ${product.price}</p>
            <button class="btn btn-primary">View Details</button>
        `;
        // TODO: Add more product details, images, and proper styling
        productGridContainer.appendChild(productCard);
    });
}

/**
 * Sets up event listeners for search input and filter options.
 */
function setupSearchAndFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceRangeFilter = document.getElementById('price-range-filter');

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            // Debounce this input to avoid too many requests
            const searchQuery = event.target.value;
            console.log('Search query:', searchQuery);
            // TODO: Trigger product load with search query
            // loadMarketplaceProducts({ search: searchQuery });
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            console.log('Category selected:', selectedCategory);
            // TODO: Trigger product load with category filter
            // loadMarketplaceProducts({ category: selectedCategory });
        });
    }

    // TODO: Add more filter event listeners (price range, location, rating, etc.)
}

// Call initMarketplacePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initMarketplacePage);
