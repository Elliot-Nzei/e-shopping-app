/*
 * register.js
 * Handles the registration form logic, including multi-step navigation and validation.
 */

import { register } from '../../core/auth.js';
import { serializeForm, validateForm, initFormSubmission } from '../../components/forms.js';
import { showToast } from '../../components/toast.js';

const registerForm = document.getElementById('registerForm');
const registerSubmitBtn = document.getElementById('registerSubmitBtn');

let currentStep = 1;
const totalSteps = 1; // Currently single-step, adjust if multi-step is fully implemented

/**
 * Initializes the registration page logic.
 */
export function initRegisterPage() {
    console.log('Initializing Register Page...');
    updateFormVisibility();
    updateSubmitButtonState();

    // Attach form submission handler
    initFormSubmission('#registerForm', handleRegisterSubmit);

    // Add event listeners for input changes to re-validate form
    registerForm.addEventListener('input', updateSubmitButtonState);
    registerForm.addEventListener('change', updateSubmitButtonState); // For select/checkboxes

    // Password toggle for register form
    const togglePasswordBtn = registerForm.querySelector('.toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const passwordInput = registerForm.querySelector('#password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePasswordBtn.classList.add('active');
            } else {
                passwordInput.type = 'password';
                togglePasswordBtn.classList.remove('active');
            }
        });
    }
}

/**
 * Handles the registration form submission.
 * @param {object} formData - The serialized form data.
 */
async function handleRegisterSubmit(formData) {
    try {
        const success = await register(formData);
        if (success) {
            showToast('Registration successful! Please log in.', 'success');
            // Redirection handled by auth.js
        } else {
            showToast('Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error during registration submission:', error);
        showToast('An unexpected error occurred during registration.', 'error');
    }
}

/**
 * Updates the visibility of form sections based on the current step.
 */
function updateFormVisibility() {
    document.querySelectorAll('.form-section').forEach((section, index) => {
        if (parseInt(section.dataset.step) === currentStep) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    // TODO: Update progress indicator if multi-step is fully implemented
}

/**
 * Updates the disabled state of the submit button based on form validity.
 */
function updateSubmitButtonState() {
    if (registerSubmitBtn) {
        registerSubmitBtn.disabled = !validateForm(registerForm);
    }
}

// Call initRegisterPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initRegisterPage);
