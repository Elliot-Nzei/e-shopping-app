/*
 * settings.js
 * Handles the logic for the admin settings page, including tab navigation, form submissions,
 * and confirmation dialogs for sensitive actions.
 */

import { showToast } from '../../components/toast.js';
import { serializeForm, validateForm, initFormSubmission } from '../../components/forms.js';
import { openModal, closeModal } from '../../components/modal.js';
// import { updateAdminSettings, updateRolesPermissions, updateSystemSettings, updateSecurityConfig } from '../../core/api.js'; // Assuming these API functions exist

const settingsTabsContainer = document.querySelector('.settings-tabs');
const tabContents = document.querySelectorAll('.tab-content');

/**
 * Initializes the admin settings page.
 */
export function initAdminSettingsPage() {
    console.log('Initializing Admin Settings Page...');
    setupTabNavigation();
    setupFormSubmissions();
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
    initFormSubmission('#roles-permissions-form', handleRolesPermissionsFormSubmit);
    initFormSubmission('#system-settings-form', handleSystemSettingsFormSubmit);
    initFormSubmission('#security-config-form', handleSecurityConfigFormSubmit);

    // Example for API & Integrations (if it had a form)
    // initFormSubmission('#api-integrations-form', handleApiIntegrationsFormSubmit);
}

/**
 * Handles submission of the roles and permissions form.
 * @param {object} formData - The form data.
 */
async function handleRolesPermissionsFormSubmit(formData) {
    console.log('Roles & Permissions form submitted:', formData);
    try {
        // await updateRolesPermissions(formData);
        showToast('Roles and permissions updated successfully!', 'success');
    } catch (error) {
        console.error('Failed to update roles and permissions:', error);
        showToast('Failed to update roles and permissions. Please try again.', 'error');
    }
}

/**
 * Handles submission of the system settings form.
 * @param {object} formData - The form data.
 */
async function handleSystemSettingsFormSubmit(formData) {
    console.log('System settings form submitted:', formData);
    try {
        // await updateSystemSettings(formData);
        showToast('System settings updated successfully!', 'success');
    } catch (error) {
        console.error('Failed to update system settings:', error);
        showToast('Failed to update system settings. Please try again.', 'error');
    }
}

/**
 * Handles submission of the security configuration form.
 * @param {object} formData - The form data.
 */
async function handleSecurityConfigFormSubmit(formData) {
    console.log('Security config form submitted:', formData);
    try {
        // await updateSecurityConfig(formData);
        showToast('Security settings updated successfully!', 'success');
    } catch (error) {
        console.error('Failed to update security settings:', error);
        showToast('Failed to update security settings. Please try again.', 'error');
    }
}

// Call initAdminSettingsPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminSettingsPage);