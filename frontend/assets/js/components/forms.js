/*
 * forms.js
 * Handles form-related functionalities such as validation, submission, and data serialization.
 */

/**
 * Serializes form data into a JavaScript object.
 * @param {HTMLFormElement} form - The form element to serialize.
 * @returns {object} - An object containing form field names as keys and their values.
 */
export function serializeForm(form) {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

/**
 * Validates a form based on HTML5 validation attributes and custom rules.
 * @param {HTMLFormElement} form - The form element to validate.
 * @returns {boolean} - True if the form is valid, false otherwise.
 */
export function validateForm(form) {
    let isValid = true;
    // HTML5 built-in validation
    if (!form.checkValidity()) {
        isValid = false;
    }

    // Custom validation logic (example: check password confirmation)
    const password = form.querySelector('input[name="password"]');
    const confirmPassword = form.querySelector('input[name="confirm_password"]');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
        // TODO: Add visual feedback for validation error
        console.error('Passwords do not match.');
        isValid = false;
    }

    // You can add more custom validation rules here

    return isValid;
}

/**
 * Clears all input fields in a given form.
 * @param {HTMLFormElement} form - The form element to clear.
 */
export function clearForm(form) {
    form.reset(); // Resets all form fields to their initial values
}

/**
 * Attaches a submit event listener to a form that handles validation and submission.
 * @param {string} formSelector - CSS selector for the form.
 * @param {function} onSubmitCallback - Callback function to execute on successful form submission.
 */
export function initFormSubmission(formSelector, onSubmitCallback) {
    const form = document.querySelector(formSelector);
    if (!form) {
        console.warn(`Form with selector "${formSelector}" not found.`);
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        if (validateForm(form)) {
            const formData = serializeForm(form);
            try {
                await onSubmitCallback(formData);
                // Optionally clear form after successful submission
                // clearForm(form);
            } catch (error) {
                console.error('Form submission callback error:', error);
                // TODO: Display error to user
            }
        } else {
            console.log('Form validation failed.');
            // TODO: Display validation errors to the user
        }
    });
}

// Example Usage:
// import { initFormSubmission } from './components/forms.js';
// initFormSubmission('#loginForm', async (data) => {
//     console.log('Submitting login data:', data);
//     // Call your authentication API here
//     const success = await login(data.email, data.password);
//     if (success) {
//         showToast('Logged in successfully!', 'success');
//     } else {
//         showToast('Login failed.', 'error');
//     }
// });
