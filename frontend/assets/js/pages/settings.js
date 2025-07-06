/*
 * settings.js
 * Handles the logic for the user settings page, including tab navigation, form submissions,
 * and confirmation dialogs for sensitive actions.
 */

import { showToast } from '../../components/toast.js';
import { serializeForm, validateForm, initFormSubmission } from '../../components/forms.js';
import { openModal, closeModal } from '../../components/modal.js';
// import { updateAccount, updateNotifications, updatePrivacy, updateSecurity, deleteAccount } from '../../core/api.js'; // Assuming these API functions exist

const settingsTabsContainer = document.querySelector('.settings-tabs');
const tabContents = document.querySelectorAll('.tab-content');
const deleteAccountBtn = document.getElementById('delete-account-btn');

/**
 * Initializes the settings page.
 */
export function initSettingsPage() {
    console.log('Initializing Settings Page...');
    setupTabNavigation();
    setupFormSubmissions();
    setupDeleteAccountConfirmation();
    // TODO: Load initial settings data from API and populate forms
}

/**
 * Sets up event listeners for tab navigation.
 */
function setupTabNavigation() {
    if (settingsTabsContainer) {
        settingsTabsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('tab-button')) {
                // Remove active class from all buttons and contents
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.style.display = 'none');

                // Add active class to clicked button
                target.classList.add('active');

                // Display corresponding tab content
                const tabId = target.dataset.tab;
                const activeContent = document.getElementById(tabId);
                if (activeContent) {
                    activeContent.style.display = 'block';
                }
            }
        });
    }

    // Ensure the first tab is active on load
    const firstTabButton = document.querySelector('.settings-tabs .tab-button');
    const firstTabContent = document.querySelector('.tab-content');
    if (firstTabButton && firstTabContent) {
        firstTabButton.classList.add('active');
        firstTabContent.style.display = 'block';
    }
}

/**
 * Sets up form submission handlers for all settings forms.
 */
function setupFormSubmissions() {
    initFormSubmission('#account-form', handleAccountFormSubmit);
    initFormSubmission('#notifications-form', handleNotificationsFormSubmit);
    initFormSubmission('#privacy-form', handlePrivacyFormSubmit);
    initFormSubmission('#security-form', handleSecurityFormSubmit);
}

/**
 * Handles submission of the account management form.
 * @param {object} formData - The form data.
 */
async function handleAccountFormSubmit(formData) {
    console.log('Account form submitted:', formData);
    // TODO: Implement password change, email/username update logic
    // Example: await updateAccount(formData);
    showToast('Account settings updated successfully!', 'success');
}

/**
 * Handles submission of the notifications form.
 * @param {object} formData - The form data.
 */
async function handleNotificationsFormSubmit(formData) {
    console.log('Notifications form submitted:', formData);
    // Example: await updateNotifications(formData);
    showToast('Notification preferences saved!', 'success');
}

/**
 * Handles submission of the privacy form.
 * @param {object} formData - The form data.
 */
async function handlePrivacyFormSubmit(formData) {
    console.log('Privacy form submitted:', formData);
    // Example: await updatePrivacy(formData);
    showToast('Privacy settings saved!', 'success');
}

/**
 * Handles submission of the security form.
 * @param {object} formData - The form data.
 */
async function handleSecurityFormSubmit(formData) {
    console.log('Security form submitted:', formData);
    // Example: await updateSecurity(formData);
    showToast('Security settings saved!', 'success');
}

/**
 * Sets up the confirmation for account deletion.
 */
function setupDeleteAccountConfirmation() {
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                handleDeleteAccount();
            }
        });
    }
}

/**
 * Handles the account deletion process.
 */
async function handleDeleteAccount() {
    try {
        // await deleteAccount();
        showToast('Your account has been successfully deleted.', 'success');
        // TODO: Redirect to homepage or login page after deletion
    } catch (error) {
        console.error('Failed to delete account:', error);
        showToast('Failed to delete account. Please try again.', 'error');
    }
}

// Call initSettingsPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSettingsPage);
