/*
 * wishlist.js
 * Handles the logic for the user's wishlist page.
 * This includes displaying wishlist items, adding/removing items, and syncing with the backend.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
import { openModal, closeModal } from '../../components/modal.js';
// import { getWishlistItems, addProductToCart, removeProductFromWishlist } from '../../core/api.js'; // Assuming these API functions exist

const wishlistProductsGrid = document.getElementById('wishlist-products-grid');
const wishlistPaginationContainer = document.getElementById('wishlist-pagination');

/**
 * Initializes the wishlist page.
 */
export async function initWishlistPage() {
    console.log('Initializing Wishlist Page...');
    setupEventListeners();
    await loadWishlistItems();
}

/**
 * Sets up event listeners for wishlist item interactions.
 */
function setupEventListeners() {
    if (wishlistProductsGrid) {
        wishlistProductsGrid.addEventListener('click', async (event) => {
            const target = event.target;
            const productCard = target.closest('.product-card');
            if (!productCard) return;

            const productId = productCard.dataset.productId; // Assuming data-product-id attribute on card

            if (target.classList.contains('add-to-cart-btn')) {
                await handleAddToCart(productId);
            } else if (target.classList.contains('remove-from-wishlist-btn')) {
                await handleRemoveFromWishlist(productId);
            } else if (target.closest('.product-card')) {
                // Click product card to go to product detail page
                // navigateTo(`/public/product-detail.html?id=${productId}`);
                console.log(`Navigate to product detail for ID: ${productId}`);
            }
        });
    }
}

/**
 * Loads and displays wishlist items.
 * @param {number} [page=1] - The current page number.
 */
async function loadWishlistItems(page = 1) {
    try {
        // In a real app, fetch wishlist items from API:
        // const response = await getWishlistItems({ page, limit: 10 });
        // const items = response.data;
        // const totalPages = response.totalPages;

        // Mock data for demonstration
        const mockItems = [
            { id: 'P001', name: 'Wireless Earbuds', seller: 'Tech Gadgets', price: 15000, imageUrl: 'https://via.placeholder.com/200/FF5733/FFFFFF?text=Earbuds' },
            { id: 'P002', name: 'Smartwatch X', seller: 'Wearable Tech', price: 25000, imageUrl: 'https://via.placeholder.com/200/33FF57/FFFFFF?text=Smartwatch' },
            { id: 'P003', name: 'Ergonomic Chair', seller: 'Office Comfort', price: 75000, imageUrl: 'https://via.placeholder.com/200/3366FF/FFFFFF?text=Chair' },
            { id: 'P004', name: 'Portable Blender', seller: 'Kitchen Essentials', price: 8000, imageUrl: 'https://via.placeholder.com/200/FFFF33/000000?text=Blender' },
        ];

        const itemsPerPage = 2; // For testing pagination with mock data
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const items = mockItems.slice(startIndex, endIndex);
        const totalPages = Math.ceil(mockItems.length / itemsPerPage);

        renderWishlistGrid(items);
        renderPagination(wishlistPaginationContainer, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadWishlistItems(newPage)
        });

    } catch (error) {
        console.error('Failed to load wishlist items:', error);
        showToast('Failed to load wishlist. Please try again.', 'error');
    }
}

/**
 * Renders the wishlist items in a grid.
 * @param {Array<object>} items - An array of wishlist item objects.
 */
function renderWishlistGrid(items) {
    if (!wishlistProductsGrid) return;

    wishlistProductsGrid.innerHTML = '';
    if (items.length === 0) {
        wishlistProductsGrid.innerHTML = '<p class="text-center">Your wishlist is empty.</p>';
        return;
    }

    items.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = item.id; // Store product ID
        productCard.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="product-image">
            <div class="product-info">
                <h3>${item.name}</h3>
                <p class="product-seller">Sold by: ${item.seller}</p>
                <p class="product-price">₦${item.price.toLocaleString()}</p>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm add-to-cart-btn">Add to Cart</button>
                    <button class="btn btn-secondary btn-sm remove-from-wishlist-btn">Remove</button>
                </div>
            </div>
        `;
        wishlistProductsGrid.appendChild(productCard);
    });
}

/**
 * Handles adding a product from the wishlist to the cart.
 * @param {string} productId - The ID of the product to add to cart.
 */
async function handleAddToCart(productId) {
    try {
        // await addProductToCart(productId);
        showToast('Product added to cart!', 'success');
        console.log(`Added product ${productId} to cart.`);
    } catch (error) {
        console.error('Failed to add to cart:', error);
        showToast('Failed to add product to cart.', 'error');
    }
}

/**
 * Handles removing a product from the wishlist.
 * @param {string} productId - The ID of the product to remove.
 */
async function handleRemoveFromWishlist(productId) {
    if (confirm('Are you sure you want to remove this item from your wishlist?')) {
        try {
            // await removeProductFromWishlist(productId);
            showToast('Item removed from wishlist.', 'info');
            console.log(`Removed product ${productId} from wishlist.`);
            await loadWishlistItems(); // Refresh the list
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            showToast('Failed to remove item from wishlist.', 'error');
        }
    }
}

// Call initWishlistPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initWishlistPage);
