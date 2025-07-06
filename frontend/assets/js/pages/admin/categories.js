/*
 * categories.js
 * Handles the logic for the admin category management page.
 * This includes displaying categories in a tree view, adding, editing, and deleting categories.
 */

import { showToast } from '../../components/toast.js';
import { openModal, closeModal } from '../../components/modal.js';
import { serializeForm, validateForm } from '../../components/forms.js';
// import { getCategories, addCategory, updateCategory, deleteCategory } from '../../core/api.js'; // Assuming these API functions exist

const categoryTreeContainer = document.getElementById('category-tree');
const addCategoryBtn = document.getElementById('add-category-btn');
const categoryModal = document.getElementById('categoryModal');
const categoryForm = document.getElementById('category-form');
const modalTitle = document.getElementById('modal-title');
const parentCategorySelect = document.getElementById('parent-category');

let editingCategoryId = null;

/**
 * Initializes the admin categories page.
 */
export async function initAdminCategoriesPage() {
    console.log('Initializing Admin Categories Page...');
    setupEventListeners();
    await loadCategories();
}

/**
 * Sets up event listeners for category actions.
 */
function setupEventListeners() {
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => openCategoryModal());
    }

    if (categoryTreeContainer) {
        categoryTreeContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const categoryItem = target.closest('.category-item');
            if (!categoryItem) return;

            const categoryId = categoryItem.dataset.categoryId;

            if (target.classList.contains('category-toggle')) {
                categoryItem.classList.toggle('expanded');
            } else if (target.classList.contains('edit-category-btn')) {
                openCategoryModal(categoryId);
            } else if (target.classList.contains('delete-category-btn')) {
                await handleDeleteCategory(categoryId);
            }
        });
    }

    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategoryFormSubmit);
    }
}

/**
 * Loads and displays categories in a tree structure.
 */
async function loadCategories() {
    try {
        // const categories = await getCategories();
        const categories = [
            { id: 1, name: 'Electronics', description: 'Electronic gadgets', parent_id: null },
            { id: 101, name: 'Laptops', description: 'Portable computers', parent_id: 1 },
            { id: 102, name: 'Smartphones', description: 'Mobile phones', parent_id: 1 },
            { id: 2, name: 'Fashion', description: 'Clothing and accessories', parent_id: null },
            { id: 201, name: 'Men's Wear', description: 'Clothing for men', parent_id: 2 },
        ]; // Mock data

        renderCategoryTree(categories);
        populateParentCategorySelect(categories);

    } catch (error) {
        console.error('Failed to load categories:', error);
        showToast('Failed to load categories. Please try again.', 'error');
    }
}

/**
 * Renders the category tree.
 * @param {Array<object>} categories - Array of category objects.
 * @param {HTMLElement} [parentElement=categoryTreeContainer] - The parent UL element to append to.
 * @param {number|null} [parentId=null] - The ID of the parent category to filter by.
 */
function renderCategoryTree(categories, parentElement = categoryTreeContainer, parentId = null) {
    if (parentElement === categoryTreeContainer) {
        parentElement.innerHTML = ''; // Clear root only
    }

    const filteredCategories = categories.filter(cat => cat.parent_id === parentId);

    filteredCategories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'category-item';
        li.dataset.categoryId = category.id;
        li.innerHTML = `
            <div class="category-header">
                <span class="category-toggle">&#9658;</span>
                <span class="category-name">${category.name}</span>
                <div class="category-controls">
                    <button class="btn btn-sm btn-secondary edit-category-btn">Edit</button>
                    <button class="btn btn-sm btn-error delete-category-btn">Delete</button>
                </div>
            </div>
        `;

        const subcategories = categories.filter(cat => cat.parent_id === category.id);
        if (subcategories.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'subcategory-list';
            li.appendChild(ul);
            renderCategoryTree(categories, ul, category.id); // Recursively render subcategories
        } else {
            // If no subcategories, remove toggle icon
            li.querySelector('.category-toggle').style.display = 'none';
        }

        parentElement.appendChild(li);
    });
}

/**
 * Populates the parent category select dropdown in the modal.
 * @param {Array<object>} categories - All category objects.
 */
function populateParentCategorySelect(categories) {
    if (!parentCategorySelect) return;

    parentCategorySelect.innerHTML = '<option value="">None (Top-level)</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        parentCategorySelect.appendChild(option);
    });
}

/**
 * Opens the category modal for adding or editing.
 * @param {string|null} categoryId - The ID of the category to edit, or null for new.
 */
async function openCategoryModal(categoryId = null) {
    editingCategoryId = categoryId;
    if (categoryForm) categoryForm.reset();

    if (modalTitle) {
        modalTitle.textContent = categoryId ? 'Edit' : 'Add New';
    }

    if (categoryId) {
        try {
            // const categoryData = await getCategory(categoryId); // Fetch category data for editing
            const categoryData = { id: categoryId, name: 'Electronics', description: 'Electronic gadgets', parent_id: null }; // Mock
            if (categoryForm) {
                categoryForm.querySelector('#category-name').value = categoryData.name;
                categoryForm.querySelector('#category-description').value = categoryData.description || '';
                if (parentCategorySelect) {
                    parentCategorySelect.value = categoryData.parent_id || '';
                }
            }
        } catch (error) {
            console.error('Failed to load category for editing:', error);
            showToast('Failed to load category data.', 'error');
            return;
        }
    }

    openModal('categoryModal');
}

/**
 * Handles the submission of the category form.
 * @param {Event} event - The form submit event.
 */
async function handleCategoryFormSubmit(event) {
    event.preventDefault();

    if (!validateForm(categoryForm)) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    const formData = serializeForm(categoryForm);
    const categoryData = {
        name: formData.name,
        description: formData.description,
        parent_id: formData.parent_id || null,
    };

    try {
        if (editingCategoryId) {
            // await updateCategory(editingCategoryId, categoryData);
            showToast('Category updated successfully!', 'success');
        } else {
            // await addCategory(categoryData);
            showToast('Category added successfully!', 'success');
        }
        closeModal('categoryModal');
        await loadCategories(); // Refresh the tree
    } catch (error) {
        console.error('Failed to save category:', error);
        showToast('Failed to save category. Please try again.', 'error');
    }
}

/**
 * Handles the deletion of a category.
 * @param {string} categoryId - The ID of the category to delete.
 */
async function handleDeleteCategory(categoryId) {
    if (confirm(`Are you sure you want to delete this category? This will also delete its subcategories.`)) {
        try {
            // await deleteCategory(categoryId);
            showToast('Category deleted successfully!', 'success');
            await loadCategories(); // Refresh the tree
        } catch (error) {
            console.error('Failed to delete category:', error);
            showToast('Failed to delete category. Please try again.', 'error');
        }
    }
}

// Call initAdminCategoriesPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminCategoriesPage);
