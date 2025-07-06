/*
 * shop-profile.js
 * Handles the logic for the seller's shop profile page.
 * This includes displaying shop information, managing branding assets (logo, banner),
 * and updating shop details.
 */

import { showToast } from '../../components/toast.js';
import { serializeForm } from '../../components/forms.js';
// import { getShopProfile, updateShopProfile, uploadShopAsset } from '../../core/api.js'; // Assuming these API functions exist

const shopProfileForm = document.getElementById('shop-profile-form');
const shopLogoPreview = document.getElementById('shop-logo-preview');
const logoUploadInput = document.getElementById('logo-upload');
const shopBannerPreview = document.getElementById('shop-banner-preview');
const bannerUploadInput = document.getElementById('banner-upload');

/**
 * Initializes the shop profile page.
 */
export async function initShopProfilePage() {
    console.log('Initializing Shop Profile Page...');
    await loadShopProfileData();
    setupEventListeners();
}

/**
 * Loads and displays the shop profile data.
 */
async function loadShopProfileData() {
    try {
        // In a real app, fetch shop profile from API:
        // const profileData = await getShopProfile();
        const profileData = {
            name: 'My Awesome Shop',
            description: 'Welcome to My Awesome Shop! We sell quality products and provide excellent service.',
            phone: '08012345678',
            email: 'shop@example.com',
            address: '123 Shop Lane, City, State',
            website: 'https://www.myawesomeshop.com',
            logoUrl: 'https://via.placeholder.com/100x100?text=ShopLogo',
            bannerUrl: 'https://via.placeholder.com/800x200?text=ShopBanner',
        }; // Mock data

        displayShopProfile(profileData);
    } catch (error) {
        console.error('Failed to load shop profile:', error);
        showToast('Failed to load shop profile. Please try again.', 'error');
    }
}

/**
 * Displays the shop profile data on the page.
 * @param {object} profile - The shop profile data.
 */
function displayShopProfile(profile) {
    if (shopProfileForm) {
        shopProfileForm.querySelector('#shop-name').value = profile.name || '';
        shopProfileForm.querySelector('#shop-description').value = profile.description || '';
        shopProfileForm.querySelector('#shop-phone').value = profile.phone || '';
        shopProfileForm.querySelector('#shop-email').value = profile.email || '';
        shopProfileForm.querySelector('#shop-address').value = profile.address || '';
        shopProfileForm.querySelector('#shop-website').value = profile.website || '';
    }
    if (shopLogoPreview) {
        shopLogoPreview.src = profile.logoUrl || 'https://via.placeholder.com/100x100?text=ShopLogo';
    }
    if (shopBannerPreview) {
        shopBannerPreview.src = profile.bannerUrl || 'https://via.placeholder.com/800x200?text=ShopBanner';
    }
}

/**
 * Sets up event listeners for form submission and image uploads.
 */
function setupEventListeners() {
    if (shopProfileForm) {
        shopProfileForm.addEventListener('submit', handleShopProfileSubmit);
    }
    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', (event) => handleImageUpload(event, shopLogoPreview));
    }
    if (bannerUploadInput) {
        bannerUploadInput.addEventListener('change', (event) => handleImageUpload(event, shopBannerPreview));
    }
}

/**
 * Handles the shop profile form submission.
 * @param {Event} event - The submit event.
 */
async function handleShopProfileSubmit(event) {
    event.preventDefault();
    const formData = serializeForm(shopProfileForm);

    try {
        // In a real app, send updated data to API:
        // await updateShopProfile(formData);
        console.log('Shop profile updated:', formData);
        showToast('Shop profile updated successfully!', 'success');
    } catch (error) {
        console.error('Failed to update shop profile:', error);
        showToast('Failed to update shop profile.', 'error');
    }
}

/**
 * Handles image file uploads and displays a preview.
 * @param {Event} event - The change event from the file input.
 * @param {HTMLImageElement} previewElement - The <img> element to display the preview.
 */
function handleImageUpload(event, previewElement) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Optionally, upload the file to the backend immediately
        // uploadShopAsset(file, file.name); // You might need to specify asset type (logo/banner)
    }
}

// Call initShopProfilePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initShopProfilePage);
