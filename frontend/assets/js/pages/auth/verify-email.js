/*
 * verify-email.js
 * Handles the email verification page logic, including resending verification emails.
 */

import { showToast } from '../../components/toast.js';
// import { resendVerificationEmail } from '../../core/api.js'; // Assuming this API function exists

const resendEmailBtn = document.getElementById('resendEmailBtn');
const resendMessage = document.getElementById('resendMessage');

/**
 * Initializes the verify email page logic.
 */
export function initVerifyEmailPage() {
    console.log('Initializing Verify Email Page...');

    if (resendEmailBtn) {
        resendEmailBtn.addEventListener('click', handleResendEmail);
    }
}

/**
 * Handles the resend verification email action.
 */
async function handleResendEmail() {
    if (!resendEmailBtn) return;

    resendEmailBtn.disabled = true; // Prevent multiple clicks
    resendEmailBtn.textContent = 'Sending...';

    try {
        // In a real application, you would call an API here:
        // const success = await resendVerificationEmail();
        // For now, simulate success after a delay
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call delay
        const success = true;

        if (success) {
            if (resendMessage) {
                resendMessage.classList.remove('hidden');
                resendMessage.textContent = 'Verification email resent. Please check your inbox.';
                resendMessage.classList.add('success-message');
            }
            showToast('Verification email sent!', 'success');
            // Disable button for a longer period to prevent spam
            setTimeout(() => {
                resendEmailBtn.disabled = false;
                resendEmailBtn.textContent = 'Resend Verification Email';
                if (resendMessage) resendMessage.classList.add('hidden');
            }, 60000); // Disable for 1 minute
        } else {
            showToast('Failed to resend email. Please try again.', 'error');
            resendEmailBtn.disabled = false;
            resendEmailBtn.textContent = 'Resend Verification Email';
        }
    } catch (error) {
        console.error('Error resending verification email:', error);
        showToast('An unexpected error occurred.', 'error');
        resendEmailBtn.disabled = false;
        resendEmailBtn.textContent = 'Resend Verification Email';
    }
}

// Call initVerifyEmailPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initVerifyEmailPage);
