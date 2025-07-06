/*
 * shop-profile.js
 * Handles the logic for the public shop profile page.
 * This includes displaying shop information, products, reviews, and contact form.
 */

import { showToast } from '../../components/toast.js';
import { renderPagination } from '../../components/pagination.js';
import { serializeForm, validateForm } from '../../components/forms.js';
import { navigateTo } from '../../core/router.js';

const publicShopProductsGrid = document.getElementById('public-shop-products-grid');
const publicShopProductsPagination = document.getElementById('public-shop-products-pagination');
const publicShopNavTabs = document.getElementById('public-shop-nav-tabs');
const publicShopContactForm = document.getElementById('public-shop-contact-form');
const followShopBtn = document.getElementById('follow-shop-btn');

/**
 * Initializes the public shop profile page.
 */
export async function initPublicShopProfilePage() {
    console.log('Initializing Public Shop Profile Page...');
    const shopId = getShopIdFromUrl(); // Function to extract shop ID from URL
    if (!shopId) {
        showToast('Shop not found.', 'error');
        return;
    }
    await loadShopDetails(shopId);
    setupEventListeners(shopId);
    // Load initial products for the shop
    await loadShopProducts(shopId);
}

/**
 * Extracts shop ID from the URL (e.g., /public/shop-profile.html?id=SHOP123).
 * @returns {string|null} - The shop ID or null if not found.
 */
function getShopIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Loads and displays shop details.
 * @param {string} shopId - The ID of the shop.
 */
async function loadShopDetails(shopId) {
    try {
        // const shopDetails = await getShopDetails(shopId);
        const shopDetails = { // Mock data
            id: shopId,
            name: 'Local Crafts & Goods',
            description: 'Your one-stop shop for handmade crafts, unique gifts, and local produce.',
            location: 'Delta, Nigeria',
            ratings: 4.5,
            reviewsCount: 125,
            logoUrl: 'https://via.placeholder.com/150x150?text=ShopLogo',
            bannerUrl: 'https://via.placeholder.com/1200x250?text=ShopBanner',
            contactEmail: 'contact@localcrafts.com',
            contactPhone: '+234 901 234 5678',
            socialMedia: { facebook: '#', instagram: '#' },
        };

        document.getElementById('public-shop-logo').src = shopDetails.logoUrl;
        document.getElementById('public-shop-banner').src = shopDetails.bannerUrl;
        document.getElementById('public-shop-name').textContent = shopDetails.name;
        document.getElementById('public-shop-location').textContent = shopDetails.location;
        document.getElementById('public-shop-reviews-count').textContent = shopDetails.reviewsCount;
        document.getElementById('public-shop-description').textContent = shopDetails.description;
        document.getElementById('public-shop-contact').textContent = `${shopDetails.contactEmail} | ${shopDetails.contactPhone}`;

        // TODO: Render star ratings
        // TODO: Render social media links

    } catch (error) {
        console.error('Failed to load shop details:', error);
        showToast('Failed to load shop details. Please try again.', 'error');
    }
}

/**
 * Sets up event listeners for tabs, follow button, and contact form.
 * @param {string} shopId - The ID of the shop.
 */
function setupEventListeners(shopId) {
    if (publicShopNavTabs) {
        publicShopNavTabs.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('tab-button')) {
                // Remove active class from all buttons and hide all sections
                document.querySelectorAll('.public-shop-nav-tabs .tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.public-shop-content-section').forEach(section => section.style.display = 'none');

                // Add active class to clicked button
                target.classList.add('active');

                // Show corresponding section
                const tabId = target.dataset.tab;
                const activeContent = document.getElementById(tabId);
                if (activeContent) {
                    activeContent.style.display = 'block';
                    // Load content for the tab if not already loaded
                    if (tabId === 'products') {
                        loadShopProducts(shopId);
                    } else if (tabId === 'reviews') {
                        loadShopReviews(shopId);
                    }
                    // 'about' and 'contact' sections are static or have their own forms
                }
            }
        });
    }

    if (followShopBtn) {
        followShopBtn.addEventListener('click', () => handleFollowShop(shopId));
    }

    if (publicShopContactForm) {
        publicShopContactForm.addEventListener('submit', (event) => handleShopContactFormSubmit(event, shopId));
    }

    if (publicShopProductsGrid) {
        publicShopProductsGrid.addEventListener('click', (event) => {
            const target = event.target;
            const productCard = target.closest('.product-card');
            if (!productCard) return;

            const productId = productCard.dataset.productId; // Assuming data-product-id attribute

            if (target.classList.contains('add-to-cart-btn')) {
                console.log(`Add to cart: ${productId}`);
                showToast('Product added to cart!', 'success');
            } else if (productCard) {
                // Click product card to go to product detail page
                navigateTo(`/public/product-detail.html?id=${productId}`);
                console.log(`Navigate to product detail for ID: ${productId}`);
            }
        });
    }
}

/**
 * Loads and displays products for the shop.
 * @param {string} shopId - The ID of the shop.
 * @param {number} [page=1] - The current page number.
 */
async function loadShopProducts(shopId, page = 1) {
    try {
        // const response = await getShopProducts(shopId, { page, limit: 12 });
        // const products = response.data;
        // const totalPages = response.totalPages;

        // Mock data
        const mockProducts = [
            { id: 'SP001', name: 'Handmade Soap', price: 2500, imageUrl: 'https://via.placeholder.com/280x200?text=Soap' },
            { id: 'SP002', name: 'Organic Shea Butter', price: 4000, imageUrl: 'https://via.placeholder.com/280x200?text=SheaButter' },
            { id: 'SP003', name: 'African Print Bag', price: 12000, imageUrl: 'https://via.placeholder.com/280x200?text=Bag' },
        ];

        const itemsPerPage = 3; // For testing pagination with mock data
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const products = mockProducts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

        renderShopProductsGrid(products);
        renderPagination(publicShopProductsPagination, {
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (newPage) => loadShopProducts(shopId, newPage)
        });

    } catch (error) {
        console.error('Failed to load shop products:', error);
        showToast('Failed to load shop products. Please try again.', 'error');
    }
}

/**
 * Renders the shop's products in a grid.
 * @param {Array<object>} products - An array of product objects.
 */
function renderShopProductsGrid(products) {
    if (!publicShopProductsGrid) return;

    publicShopProductsGrid.innerHTML = '';
    if (products.length === 0) {
        publicShopProductsGrid.innerHTML = '<p class="text-center">No products available from this shop.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id; // Store product ID
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
        publicShopProductsGrid.appendChild(productCard);
    });
}

/**
 * Loads and displays reviews for the shop.
 * @param {string} shopId - The ID of the shop.
 */
async function loadShopReviews(shopId) {
    console.log(`Loading reviews for shop: ${shopId}`);
    try {
        // const reviews = await getShopReviews(shopId);
        const reviews = [
            { id: 1, author: 'Customer A', rating: 5, comment: 'Great products and fast delivery!' },
            { id: 2, author: 'Customer B', rating: 4, comment: 'Good quality, but delivery was a bit slow.' },
        ]; // Mock data

        const reviewsList = document.getElementById('public-shop-reviews-list');
        if (reviewsList) {
            reviewsList.innerHTML = '';
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p>No reviews yet for this shop.</p>';
                return;
            }
            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.className = 'review-item';
                reviewDiv.innerHTML = `
                    <h4>${review.author} - ${review.rating} Stars</h4>
                    <p>${review.comment}</p>
                `;
                reviewsList.appendChild(reviewDiv);
            });
        }
    } catch (error) {
        console.error('Failed to load shop reviews:', error);
        showToast('Failed to load reviews. Please try again.', 'error');
    }
}

/**
 * Handles following/unfollowing a shop.
 * @param {string} shopId - The ID of the shop to follow.
 */
async function handleFollowShop(shopId) {
    try {
        // await followShop(shopId);
        showToast('Shop followed successfully!', 'success');
        console.log(`Followed shop: ${shopId}`);
        // TODO: Update button text/style
    } catch (error) {
        console.error('Failed to follow shop:', error);
        showToast('Failed to follow shop. Please try again.', 'error');
    }
}

/**
 * Handles the submission of the public shop contact form.
 * @param {Event} event - The form submit event.
 * @param {string} shopId - The ID of the shop being contacted.
 */
async function handleShopContactFormSubmit(event, shopId) {
    event.preventDefault();

    if (!validateForm(publicShopContactForm)) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    const formData = serializeForm(publicShopContactForm);
    const contactData = { ...formData, shopId: shopId };

    try {
        // await submitShopContactForm(contactData);
        showToast('Your message has been sent to the shop!', 'success');
        publicShopContactForm.reset();
    } catch (error) {
        console.error('Failed to send message to shop:', error);
        showToast('Failed to send message. Please try again.', 'error');
    }
}

// Call initPublicShopProfilePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPublicShopProfilePage);