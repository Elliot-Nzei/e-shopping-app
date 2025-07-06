/*
 * add-product.js
 * Handles the logic for the seller's add new product page.
 * This includes multi-step form navigation, image uploads, variant management, and form submission.
 */

import { showToast } from '../../components/toast.js';
import { serializeForm, validateForm } from '../../components/forms.js';
// import { addProduct } from '../../core/api.js'; // Assuming this API function exists

const addProductForm = document.getElementById('add-product-form');
const formSections = document.querySelectorAll('.product-form .form-section');
const prevStepBtn = document.querySelector('.product-form .prev-step');
const nextStepBtn = document.querySelector('.product-form .next-step');
const submitProductBtn = document.querySelector('.product-form .submit-product-btn');

const productImagesInput = document.getElementById('product-images');
const imagePreviewContainer = document.getElementById('image-preview-container');
const addVariantBtn = document.getElementById('add-variant-btn');
const variantsContainer = document.getElementById('variants-container');

let currentStep = 0; // 0-indexed

/**
 * Initializes the add product page.
 */
export function initAddProductPage() {
    console.log('Initializing Add Product Page...');
    setupFormNavigation();
    setupImageUpload();
    setupVariantManagement();
    setupFormSubmission();
    updateFormVisibility();
}

/**
 * Sets up event listeners for multi-step form navigation.
 */
function setupFormNavigation() {
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                currentStep++;
                updateFormVisibility();
            }
        });
    }
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', () => {
            currentStep--;
            updateFormVisibility();
        });
    }
}

/**
 * Updates the visibility of form sections and navigation buttons.
 */
function updateFormVisibility() {
    formSections.forEach((section, index) => {
        section.style.display = (index === currentStep) ? 'block' : 'none';
    });

    if (prevStepBtn) {
        prevStepBtn.classList.toggle('hidden', currentStep === 0);
    }
    if (nextStepBtn) {
        nextStepBtn.classList.toggle('hidden', currentStep === formSections.length - 1);
    }
    if (submitProductBtn) {
        submitProductBtn.classList.toggle('hidden', currentStep !== formSections.length - 1);
    }
}

/**
 * Validates the fields in the current step.
 * @returns {boolean} - True if the current step's fields are valid, false otherwise.
 */
function validateCurrentStep() {
    const currentSection = formSections[currentStep];
    const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid'); // Add visual feedback
        } else {
            input.classList.remove('invalid');
        }
    });
    // TODO: Add more specific validation rules (e.g., price is number, stock is number)
    return isValid;
}

/**
 * Sets up image upload preview functionality.
 */
function setupImageUpload() {
    if (productImagesInput && imagePreviewContainer) {
        productImagesInput.addEventListener('change', (event) => {
            imagePreviewContainer.innerHTML = ''; // Clear previous previews
            const files = event.target.files;
            if (files) {
                Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.alt = file.name;
                            imagePreviewContainer.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        });
    }
}

/**
 * Sets up dynamic variant management (add/remove variant fields).
 */
function setupVariantManagement() {
    if (addVariantBtn && variantsContainer) {
        addVariantBtn.addEventListener('click', addVariantField);
        variantsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-variant-btn')) {
                event.target.closest('.variant-item').remove();
            }
        });
    }
}

/**
 * Adds a new variant input field set.
 */
function addVariantField() {
    const variantItem = document.createElement('div');
    variantItem.className = 'variant-item';
    variantItem.innerHTML = `
        <input type="text" name="variant_name[]" placeholder="Variant Name (e.g., Color)">
        <input type="text" name="variant_value[]" placeholder="Variant Value (e.g., Red)">
        <button type="button" class="btn btn-error btn-sm remove-variant-btn">Remove</button>
    `;
    if (variantsContainer) {
        variantsContainer.appendChild(variantItem);
    }
}

/**
 * Sets up the form submission for adding a product.
 */
function setupFormSubmission() {
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (validateCurrentStep()) { // Validate last step before final submission
                const formData = serializeForm(addProductForm);
                // Handle multiple images and variants separately if needed for API
                const productData = {
                    ...formData,
                    images: Array.from(productImagesInput.files).map(file => file.name), // Placeholder
                    variants: Array.from(variantsContainer.querySelectorAll('.variant-item')).map(item => ({
                        name: item.querySelector('input[name="variant_name[]"]').value,
                        value: item.querySelector('input[name="variant_value[]"]').value,
                    })),
                };

                try {
                    // await addProduct(productData);
                    console.log('Product data to submit:', productData);
                    showToast('Product added successfully!', 'success');
                    addProductForm.reset();
                    imagePreviewContainer.innerHTML = '';
                    variantsContainer.innerHTML = ''; // Clear variants
                    addVariantField(); // Add one empty variant field back
                    currentStep = 0; // Reset to first step
                    updateFormVisibility();
                } catch (error) {
                    console.error('Failed to add product:', error);
                    showToast('Failed to add product. Please try again.', 'error');
                }
            }
        });
    }
}

// Call initAddProductPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAddProductPage);
