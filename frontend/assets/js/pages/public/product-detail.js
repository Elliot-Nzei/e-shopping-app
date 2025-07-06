/*
 * product-detail.js
 * Handles the logic for the public product detail page.
 * This includes displaying product information, image gallery, tabs, and related products.
 */

import { showToast } from '../../components/toast.js';
import { navigateTo } from '../../core/router.js';
// import { getProductDetails, getRelatedProducts, addProductToCart, addProductToWishlist, submitReview } from '../../core/api.js'; // Assuming these API functions exist

const mainProductImage = document.getElementById('main-product-image');
const thumbnailGallery = document.getElementById('thumbnail-gallery');
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');
const productStock = document.getElementById('product-stock');
const sellerShopLink = document.getElementById('seller-shop-link');
const reviewsCount = document.getElementById('reviews-count');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');
const productTabs = document.getElementById('product-tabs');
const productDescriptionContent = document.getElementById('product-description-content');
const productSpecificationsList = document.getElementById('product-specifications-list');
const productFeaturesList = document.getElementById('product-features-list');
const reviewsList = document.getElementById('reviews-list');
const writeReviewBtn = document.getElementById('write-review-btn');
const relatedProductsGrid = document.getElementById('related-products-grid');

/**
 * Initializes the product detail page.
 */
export async function initProductDetailPage() {
    console.log('Initializing Product Detail Page...');
    const productId = getProductIdFromUrl();
    if (!productId) {
        showToast('Product not found.', 'error');
        return;
    }
    await loadProductDetails(productId);
    await loadRelatedProducts(productId);
    setupEventListeners();
}

/**
 * Extracts product ID from the URL (e.g., /public/product-detail.html?id=PROD123).
 * @returns {string|null} - The product ID or null if not found.
 */
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Loads and displays product details.
 * @param {string} productId - The ID of the product.
 */
async function loadProductDetails(productId) {
    try {
        // const product = await getProductDetails(productId);
        const product = { // Mock data
            id: productId,
            name: 'Premium Wireless Headphones',
            price: 45000,
            stock: 50,
            seller: { id: 'SHOP001', name: 'Sound Haven' },
            images: [
                'https://via.placeholder.com/600x400?text=Headphones+1',
                'https://via.placeholder.com/600x400?text=Headphones+2',
                'https://via.placeholder.com/600x400?text=Headphones+3',
            ],
            description: 'Experience immersive audio with these premium wireless headphones. Featuring noise-cancellation and long-lasting battery life.',
            specifications: [
                { name: 'Connectivity', value: 'Bluetooth 5.0' },
                { name: 'Battery Life', value: '30 hours' },
                { name: 'Weight', value: '250g' },
            ],
            features: [
                'Active Noise Cancellation',
                'Comfortable Over-Ear Design',
                'Built-in Microphone',
                'Fast Charging',
            ],
            reviews: [
                { author: 'User A', rating: 5, comment: 'Amazing sound quality!' },
                { author: 'User B', rating: 4, comment: 'Comfortable for long use.' },
            ],
        };

        if (productTitle) productTitle.textContent = product.name;
        if (productPrice) productPrice.textContent = `₦${product.price.toLocaleString()}`;
        if (productStock) productStock.textContent = `Availability: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}`;
        if (sellerShopLink) {
            sellerShopLink.textContent = product.seller.name;
            sellerShopLink.href = `/public/shop-profile.html?id=${product.seller.id}`;
        }
        if (reviewsCount) reviewsCount.textContent = product.reviews.length;

        // Image Gallery
        if (mainProductImage) mainProductImage.src = product.images[0];
        if (thumbnailGallery) {
            thumbnailGallery.innerHTML = '';
            product.images.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = imgSrc.replace('600x400', '100x70'); // Use smaller version for thumbnail
                img.alt = `Thumbnail ${index + 1}`;
                img.className = `thumbnail-image ${index === 0 ? 'active' : ''}`;
                img.dataset.fullImage = imgSrc;
                thumbnailGallery.appendChild(img);
            });
        }

        // Tabs Content
        if (productDescriptionContent) productDescriptionContent.textContent = product.description;
        if (productSpecificationsList) {
            productSpecificationsList.innerHTML = '';
            product.specifications.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = `${spec.name}: ${spec.value}`;
                productSpecificationsList.appendChild(li);
            });
        }
        if (productFeaturesList) {
            productFeaturesList.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                productFeaturesList.appendChild(li);
            });
        }
        if (reviewsList) {
            reviewsList.innerHTML = '';
            if (product.reviews.length === 0) {
                reviewsList.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
            } else {
                product.reviews.forEach(review => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.className = 'review-item';
                    reviewDiv.innerHTML = `
                        <h4>${review.author} - ${review.rating} Stars</h4>
                        <p>${review.comment}</p>
                    `;
                    reviewsList.appendChild(reviewDiv);
                });
            }
        }

    } catch (error) {
        console.error('Failed to load product details:', error);
        showToast('Failed to load product details. Please try again.', 'error');
    }
}

/**
 * Loads and displays related products.
 * @param {string} currentProductId - The ID of the current product.
 */
async function loadRelatedProducts(currentProductId) {
    try {
        // const related = await getRelatedProducts(currentProductId);
        const related = [
            { id: 'RP001', name: 'Portable Charger', seller: 'Power Solutions', price: 10000, imageUrl: 'https://via.placeholder.com/280x200?text=Charger' },
            { id: 'RP002', name: 'Laptop Sleeve', seller: 'Accessory Hub', price: 5000, imageUrl: 'https://via.placeholder.com/280x200?text=Sleeve' },
        ]; // Mock data

        if (relatedProductsGrid) {
            relatedProductsGrid.innerHTML = '';
            if (related.length === 0) {
                relatedProductsGrid.innerHTML = '<p class="text-center">No related products found.</p>';
                return;
            }
            related.forEach(product => {
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
                        </div>
                    </div>
                `;
                relatedProductsGrid.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Failed to load related products:', error);
    }
}

/**
 * Sets up event listeners for image gallery, tabs, and action buttons.
 */
function setupEventListeners() {
    if (thumbnailGallery) {
        thumbnailGallery.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('thumbnail-image')) {
                // Remove active class from all thumbnails
                thumbnailGallery.querySelectorAll('.thumbnail-image').forEach(img => img.classList.remove('active'));
                // Add active class to clicked thumbnail
                target.classList.add('active');
                // Update main image
                if (mainProductImage) {
                    mainProductImage.src = target.dataset.full-image;
                }
            }
        });
    }

    if (productTabs) {
        productTabs.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('tab-button')) {
                // Remove active class from all tab buttons and hide all tab contents
                productTabs.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.product-info-section .tab-content').forEach(content => content.classList.remove('active'));

                // Add active class to clicked tab button
                target.classList.add('active');

                // Show corresponding tab content
                const tabId = target.dataset.tab;
                const activeContent = document.getElementById(tabId);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            }
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productId = getProductIdFromUrl();
            if (productId) {
                // addProductToCart(productId);
                showToast('Product added to cart!', 'success');
                console.log(`Added product ${productId} to cart.`);
            }
        });
    }

    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', () => {
            const productId = getProductIdFromUrl();
            if (productId) {
                // addProductToWishlist(productId);
                showToast('Product added to wishlist!', 'info');
                console.log(`Added product ${productId} to wishlist.`);
            }
        });
    }

    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => {
            const productId = getProductIdFromUrl();
            if (productId) {
                // navigateTo(`/public/write-review.html?productId=${productId}`);
                showToast('Opening review form...', 'info');
                console.log(`Write review for product: ${productId}`);
            }
        });
    }

    if (relatedProductsGrid) {
        relatedProductsGrid.addEventListener('click', (event) => {
            const target = event.target;
            const productCard = target.closest('.product-card');
            if (productCard && target.classList.contains('add-to-cart-btn')) {
                const productId = productCard.dataset.productId;
                // addProductToCart(productId);
                showToast('Product added to cart!', 'success');
                console.log(`Added related product ${productId} to cart.`);
            } else if (productCard) {
                const productId = productCard.dataset.productId;
                navigateTo(`/public/product-detail.html?id=${productId}`);
            }
        });
    }
}

// Call initProductDetailPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initProductDetailPage);