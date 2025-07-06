/*
 * forgot-password.js
 * Handles the forgot password form logic.
 */

import { initFormSubmission, serializeForm } from '../../components/forms.js';
import { showToast } from '../../components/toast.js';
// import { requestPasswordReset } from '../../core/api.js'; // Assuming this API function exists

/**
 * Initializes the forgot password page logic.
 */
export function initForgotPasswordPage() {
    console.log('Initializing Forgot Password Page...');

    // Attach form submission handler
    initFormSubmission('#forgotPasswordForm', handleForgotPasswordSubmit);
}

/**
 * Handles the forgot password form submission.
 * @param {object} formData - The serialized form data (should contain email).
 */
async function handleForgotPasswordSubmit(formData) {
    const confirmationMessage = document.getElementById('confirmationMessage');
    try {
        // In a real application, you would call an API here:
        // const success = await requestPasswordReset(formData.email);
        // For now, simulate success
        const success = true; 

        if (success) {
            if (confirmationMessage) {
                confirmationMessage.classList.remove('hidden');
                confirmationMessage.classList.add('success-message');
            }
            showToast('Password reset instructions sent if email exists.', 'success', 5000);
            // Optionally clear the form
            document.getElementById('forgotPasswordForm').reset();
        } else {
            // This else block might not be reached if API always returns success for security reasons
            showToast('Failed to send reset instructions. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error during forgot password submission:', error);
        showToast('An unexpected error occurred.', 'error');
    }
}

// Call initForgotPasswordPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initForgotPasswordPage);
