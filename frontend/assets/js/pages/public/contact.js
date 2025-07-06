/*
 * contact.js
 * Handles the logic for the public contact page.
 * This includes form validation and submission.
 */

import { showToast } from '../components/toast.js';
import { serializeForm, validateForm, initFormSubmission } from '../components/forms.js';
import { isValidEmail } from '../core/utils.js';
// import { submitContactForm } from '../core/api.js'; // Assuming this API function exists

const contactForm = document.getElementById('contact-form');

/**
 * Initializes the contact page.
 */
export function initContactPage() {
    console.log('Initializing Contact Page...');
    setupFormSubmission();
}

/**
 * Sets up the form submission handler for the contact form.
 */
function setupFormSubmission() {
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!validateContactForm()) {
                showToast('Please correct the errors in the form.', 'error');
                return;
            }

            const formData = serializeForm(contactForm);

            try {
                // In a real app, send data to API:
                // await submitContactForm(formData);
                console.log('Contact form submitted:', formData);
                showToast('Your message has been sent successfully!', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Failed to submit contact form:', error);
                showToast('Failed to send message. Please try again.', 'error');
            }
        });
    }
}

/**
 * Validates the contact form fields.
 * @returns {boolean} - True if the form is valid, false otherwise.
 */
function validateContactForm() {
    let isValid = true;
    // Basic HTML5 validation
    if (!contactForm.checkValidity()) {
        isValid = false;
    }

    const emailInput = contactForm.querySelector('#email');
    if (emailInput && !isValidEmail(emailInput.value)) {
        // TODO: Add visual feedback for invalid email
        console.error('Invalid email format.');
        isValid = false;
    }

    // You can add more custom validation rules here (e.g., minimum message length)

    return isValid;
}

// Call initContactPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initContactPage);
