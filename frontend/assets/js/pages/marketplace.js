/*
 * marketplace.js
 * Logic for the product browsing and marketplace features.
 * This includes product listing, search, filtering, and sorting.
 */

import { getProducts } from '../core/api.js';
import { showToast } from '../components/toast.js';
import { renderPagination } from '../components/pagination.js';

const marketplaceProductsGrid = document.getElementById('marketplace-products-grid');
const marketplacePaginationContainer = document.getElementById('marketplace-pagination');

const marketplaceSearchInput = document.getElementById('marketplace-search-input');
const categoryList = document.getElementById('category-list');
const priceRangeInput = document.getElementById('price-range');
const priceRangeDisplay = document.getElementById('price-range-display');
const brandFilter = document.getElementById('brand-filter');
const shopFilter = document.getElementById('shop-filter');
const sortBySelect = document.getElementById('sort-by');

/**
 * Initializes the marketplace page.
 */
export async function initMarketplacePage() {
    console.log('Initializing Marketplace Page...');
    setupEventListeners();
    await loadMarketplaceProducts();
    // TODO: Load categories, brands, shops dynamically
}

/**
 * Sets up event listeners for search, filters, and sorting.
 */
function setupEventListeners() {
    if (marketplaceSearchInput) {
        marketplaceSearchInput.addEventListener('input', () => loadMarketplaceProducts()); // Debounce in real app
    }
    if (categoryList) {
        categoryList.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'A' && target.dataset.category) {
                event.preventDefault();
                // Remove active class from previous category
                categoryList.querySelector('.active')?.classList.remove('active');
                target.classList.add('active');
                loadMarketplaceProducts();
            }
        });
    }
    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', () => {
            if (priceRangeDisplay) {
                priceRangeDisplay.textContent = `₦0 - ₦${parseInt(priceRangeInput.value).toLocaleString()}`;
            }
            loadMarketplaceProducts();
        });
    }
    if (brandFilter) {
        brandFilter.addEventListener('change', () => loadMarketplaceProducts());
    }
    if (shopFilter) {
        shopFilter.addEventListener('change', () => loadMarketplaceProducts());
    }
    if (sortBySelect) {
        sortBySelect.addEventListener('change', () => loadMarketplaceProducts());
    }

    if (marketplaceProductsGrid) {
        marketplaceProductsGrid.addEventListener('click', (event) => {
            const target = event.target;
            const productCard = target.closest('.product-card');
            if (!productCard) return;

            const productId = productCard.dataset.productId; // Assuming data-product-id attribute

            if (target.classList.contains('add-to-cart-btn')) {
                console.log(`Add to cart: ${productId}`);
                showToast('Product added to cart!', 'success');
            } else if (target.classList.contains('add-to-wishlist-btn')) {
                console.log(`Add to wishlist: ${productId}`);
                showToast('Product added to wishlist!', 'info');
            } else if (productCard) {
                // Click product card to go to product detail page
                // navigateTo(`/public/product-detail.html?id=${productId}`);
                console.log(`Navigate to product detail for ID: ${productId}`);
            }
        });
    }
}

/**
 * Loads products for the marketplace, applying search, filter, and pagination parameters.
 * @param {object} [params={}] - Parameters for fetching products (e.g., search query, category, page, limit).
 */
async function loadMarketplaceProducts(page = 1) {
    const filters = {
        search: marketplaceSearchInput ? marketplaceSearchInput.value : '',
        category: categoryList ? categoryList.querySelector('.active')?.dataset.category || 'all' : 'all',
        maxPrice: priceRangeInput ? parseInt(priceRangeInput.value) : 100000,
        brand: brandFilter ? brandFilter.value : 'all',
        shop: shopFilter ? shopFilter.value : 'all',
        sortBy: sortBySelect ? sortBySelect.value : 'popularity',
        page: page,
        limit: 12 // Items per page
    };

    try {
        // const response = await getProducts(filters);
        // const products = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const allProducts = [
            { id: 'MP001', name: 'Fresh Organic Apples', seller: 'Green Farms', price: 1500, imageUrl: 'https://via.placeholder.com/280x200?text=Apples', category: 'food' },
            { id: 'MP002', name: 'Handmade Leather Wallet', seller: 'Crafty Creations', price: 8000, imageUrl: 'https://via.placeholder.com/280x200?text=Wallet', category: 'fashion' },
            { id: 'MP003', name: 'Bluetooth Speaker', seller: 'Sound Blasters', price: 12000, imageUrl: 'https://via.placeholder.com/280x200?text=Speaker', category: 'electronics' },
            { id: 'MP004', name: 'Local Honey (500g)', seller: 'Bee Keepers', price: 3500, imageUrl: 'https://via.placeholder.com/280x200?text=Honey', category: 'food' },
            { id: 'MP005', name: 'Custom T-Shirt', seller: 'Print Masters', price: 4000, imageUrl: 'https://via.placeholder.com/280x200?text=T-Shirt', category: 'fashion' },
            { id: 'MP006', name: 'Gaming Mouse', seller: 'PC Peripherals', price: 7000, imageUrl: 'https://via.placeholder.com/280x200?text=Mouse', category: 'electronics' },
        ];

        const filteredProducts = allProducts.filter(product => {
            const searchMatch = product.name.toLowerCase().includes(filters.search.toLowerCase());
            const categoryMatch = filters.category === 'all' || product.category === filters.category;
            const priceMatch = product.price <= filters.maxPrice;
            // Add brand and shop filtering here
            return searchMatch && categoryMatch && priceMatch;
        }).sort((a, b) => {
            if (filters.sortBy === 'price_asc') return a.price - b.price;
            if (filters.sortBy === 'price_desc') return b.price - a.price;
            // Add other sorting logic
            return 0;
        });

        const startIndex = (page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const products = filteredProducts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredProducts.length / filters.limit);

        renderMarketplaceProductGrid(products);
        renderPagination(marketplacePaginationContainer, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadMarketplaceProducts(newPage)
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
    if (!marketplaceProductsGrid) return;

    marketplaceProductsGrid.innerHTML = '';

    if (products.length === 0) {
        marketplaceProductsGrid.innerHTML = '<p class="text-center">No products found matching your criteria.</p>';
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
                <p class="product-seller">Sold by: ${product.seller}</p>
                <p class="product-price">₦${product.price.toLocaleString()}</p>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm add-to-cart-btn">Add to Cart</button>
                    <button class="btn btn-secondary btn-sm add-to-wishlist-btn">Wishlist</button>
                </div>
            </div>
        `;
        marketplaceProductsGrid.appendChild(productCard);
    });
}

// Call initMarketplacePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initMarketplacePage);