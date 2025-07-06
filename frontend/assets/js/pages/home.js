/*
 * home.js
 * Logic for the home page of the Local Shopping Web-App.
 * This includes dynamic content loading, event listeners for UI elements, etc.
 */

import { getProducts } from '../core/api.js';
import { showToast } from '../components/toast.js';
import { renderPagination } from '../components/pagination.js';
import { navigateTo } from '../core/router.js';

const heroCtaButton = document.querySelector('.hero-cta');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navbarNav = document.querySelector('.navbar-nav');

/**
 * Initializes the home page by loading products and setting up event listeners.
 */
export async function initHomePage() {
    console.log('Initializing Home Page...');
    setupEventListeners();
    // await loadProducts(); // Uncomment if products are displayed on the home page
    // setupLocationSelector(); // Uncomment if location selector is on home page
    // TODO: Add more initialization logic for hero section, featured categories, etc.
}

/**
 * Sets up event listeners for interactive elements on the home page.
 */
function setupEventListeners() {
    if (heroCtaButton) {
        heroCtaButton.addEventListener('click', () => {
            const targetPage = heroCtaButton.dataset.target || '/auth/register.html';
            navigateTo(targetPage);
        });
    }

    if (hamburgerMenu && navbarNav) {
        hamburgerMenu.addEventListener('click', () => {
            const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true' || false;
            hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
            navbarNav.classList.toggle('active');

            // Add/remove mobile-only links dynamically
            if (!isExpanded) {
                // Menu is opening, add mobile-specific links
                const mobileLinks = [
                    { text: 'About', href: '/public/about.html' },
                    { text: 'Contact', href: '/public/contact.html' }
                ];
                mobileLinks.forEach(link => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.textContent = link.text;
                    a.setAttribute('data-internal-link', '');
                    li.appendChild(a);
                    navbarNav.appendChild(li);
                });
            } else {
                // Menu is closing, remove mobile-specific links
                navbarNav.querySelectorAll('li').forEach(li => {
                    const a = li.querySelector('a');
                    if (a && (a.textContent === 'About' || a.textContent === 'Contact')) {
                        li.remove();
                    }
                });
            }
        });
    }

    // Example: Click handler for info cards (if they navigate)
    document.querySelectorAll('.info-card a').forEach(cardLink => {
        cardLink.addEventListener('click', (event) => {
            event.preventDefault();
            navigateTo(cardLink.getAttribute('href'));
        });
    });
}

/**
 * Loads products for the home page, potentially with filters or pagination.
 */
async function loadProducts(page = 1, limit = 10) {
    try {
        // Example: Fetch products from API
        const products = await getProducts(); // Modify getProducts to accept pagination/filters
        console.log('Loaded products:', products);
        // renderProductGrid(products); // Function to render products on the page

        // Example pagination setup
        const totalPages = 5; // This should come from API response
        // renderPagination(document.getElementById('product-pagination'), {
        //     currentPage: page,
        //     totalPages: totalPages,
        //     onPageChange: (newPage) => {
        //         loadProducts(newPage, limit);
        //     }
        // });

    } catch (error) {
        console.error('Failed to load products:', error);
        showToast('Failed to load products. Please try again later.', 'error');
    }
}

/**
 * Renders the product grid on the home page.
 * @param {Array<object>} products - An array of product objects.
 */
function renderProductGrid(products) {
    const productGridContainer = document.getElementById('product-grid');
    if (!productGridContainer) return;

    productGridContainer.innerHTML = ''; // Clear existing products

    if (products.length === 0) {
        productGridContainer.innerHTML = '<p>No products found.</p>';
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
        // TODO: Add more product details and proper styling
        productGridContainer.appendChild(productCard);
    });
}

/**
 * Sets up the location selector functionality.
 */
function setupLocationSelector() {
    const locationSelector = document.getElementById('location-selector');
    if (locationSelector) {
        locationSelector.addEventListener('change', (event) => {
            const selectedLocation = event.target.value;
            console.log('Location selected:', selectedLocation);
            // TODO: Update personalized product feed based on selected location
            showToast(`Products updated for ${selectedLocation}`, 'info');
        });
    }
}

// Call initHomePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initHomePage);