/*
 * profile.js
 * Logic for the user profile page.
 * This includes displaying user information, allowing edits, and managing settings.
 */

import { showToast } from '../../components/toast.js';
import { getState, setState } from '../../core/state.js';
import { serializeForm, validateForm } from '../../components/forms.js';
import { isValidEmail } from '../../core/utils.js';
// import { getUserProfile, updateProfile, uploadAvatar } from '../../core/api.js'; // Assuming these API functions exist

const profileEditForm = document.getElementById('profile-edit-form');
const editProfileBtn = document.getElementById('edit-profile-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const profileFormInputs = profileEditForm ? profileEditForm.querySelectorAll('input, textarea') : [];

const avatarUploadInput = document.getElementById('avatar-upload');
const avatarPreview = document.getElementById('profile-avatar-preview');

/**
 * Initializes the user profile page.
 */
export async function initProfilePage() {
    console.log('Initializing User Profile Page...');
    await loadUserProfile();
    setupProfileEditFormListeners();
    setupAvatarUpload();
}

/**
 * Loads and displays the current user's profile information.
 */
async function loadUserProfile() {
    const currentUser = getState('user');
    if (!currentUser) {
        console.warn('No user found in state. Cannot load profile.');
        showToast('Please log in to view your profile.', 'info');
        // Optionally redirect to login page
        return;
    }

    try {
        // In a real app, fetch full profile from API:
        // const profileData = await getUserProfile(currentUser.id);
        const profileData = {
            username: currentUser.username || 'john_doe',
            email: currentUser.email || 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '123-456-7890',
            address: '123 Main St, City, Country',
            avatarUrl: 'https://via.placeholder.com/150',
            ordersCount: 5,
            wishlistCount: 12,
        }; // Mock data

        displayUserProfile(profileData);
        toggleFormFields(false); // Start in read-only mode
    } catch (error) {
        console.error('Failed to load user profile:', error);
        showToast('Failed to load profile. Please try again.', 'error');
    }
}

/**
 * Displays the user profile data on the page.
 * @param {object} profile - The user profile data.
 */
function displayUserProfile(profile) {
    if (profileEditForm) {
        profileEditForm.querySelector('#first_name').value = profile.firstName || '';
        profileEditForm.querySelector('#last_name').value = profile.lastName || '';
        profileEditForm.querySelector('#username').value = profile.username || '';
        profileEditForm.querySelector('#email').value = profile.email || '';
        profileEditForm.querySelector('#phone').value = profile.phone || '';
        profileEditForm.querySelector('#address').value = profile.address || '';
    }
    if (document.getElementById('profile-username-display')) {
        document.getElementById('profile-username-display').textContent = profile.username;
    }
    if (document.getElementById('orders-count')) {
        document.getElementById('orders-count').textContent = profile.ordersCount;
    }
    if (document.getElementById('wishlist-count')) {
        document.getElementById('wishlist-count').textContent = profile.wishlistCount;
    }
    if (avatarPreview && profile.avatarUrl) {
        avatarPreview.src = profile.avatarUrl;
    }
}

/**
 * Sets up event listeners for the profile edit form buttons.
 */
function setupProfileEditFormListeners() {
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => toggleFormFields(true));
    }
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            toggleFormFields(false);
            loadUserProfile(); // Revert changes by reloading original data
        });
    }
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', handleProfileSubmit);
    }
}

/**
 * Toggles the disabled state of form fields and visibility of action buttons.
 * @param {boolean} enable - True to enable fields and show save/cancel, false to disable and show edit.
 */
function toggleFormFields(enable) {
    profileFormInputs.forEach(input => {
        // Email and Username might remain disabled or have special handling
        if (input.id !== 'email' && input.id !== 'username') {
            input.disabled = !enable;
        }
    });

    if (editProfileBtn) editProfileBtn.classList.toggle('hidden', enable);
    if (saveProfileBtn) saveProfileBtn.classList.toggle('hidden', !enable);
    if (cancelEditBtn) cancelEditBtn.classList.toggle('hidden', !enable);
}

/**
 * Handles the profile form submission.
 * @param {Event} event - The submit event.
 */
async function handleProfileSubmit(event) {
    event.preventDefault();

    if (!validateProfileForm()) {
        showToast('Please correct the errors in the form.', 'error');
        return;
    }

    const formData = serializeForm(profileEditForm);
    // Remove disabled fields from formData if they are not meant to be updated
    delete formData.email;
    delete formData.username;

    try {
        // In a real app, send updated data to API:
        // await updateProfile(formData);
        console.log('Profile updated:', formData);
        showToast('Profile updated successfully!', 'success');
        // Update state with new profile data if API returns it
        setState('user', { ...getState('user'), ...formData });
        toggleFormFields(false); // Switch back to read-only mode
    } catch (error) {
        console.error('Failed to update profile:', error);
        showToast('Failed to update profile.', 'error');
    }
}

/**
 * Validates the profile form fields.
 * @returns {boolean} - True if the form is valid, false otherwise.
 */
function validateProfileForm() {
    let isValid = true;
    // Basic HTML5 validation
    if (!profileEditForm.checkValidity()) {
        isValid = false;
    }

    const emailInput = profileEditForm.querySelector('#email');
    if (emailInput && !isValidEmail(emailInput.value)) {
        // TODO: Add visual feedback for invalid email
        console.error('Invalid email format.');
        isValid = false;
    }

    // TODO: Add phone number format validation

    return isValid;
}

/**
 * Sets up the avatar upload functionality.
 */
function setupAvatarUpload() {
    if (avatarUploadInput && avatarPreview) {
        avatarUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);

                // Optionally, upload the file immediately or on save
                // uploadUserAvatar(file);
            }
        });
    }
}

// Ensure initProfilePage is called when the DOM is ready and this script is loaded
document.addEventListener('DOMContentLoaded', initProfilePage);