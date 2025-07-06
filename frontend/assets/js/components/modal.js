/*
 * modal.js
 * Handles the functionality for displaying and hiding modal dialogs.
 */

/**
 * Opens a modal dialog.
 * @param {string} modalId - The ID of the modal element to open.
 */
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open'); // Add class to body to prevent scrolling
    }
}

/**
 * Closes a modal dialog.
 * @param {string} modalId - The ID of the modal element to close.
 */
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

/**
 * Initializes modal event listeners.
 * Attaches click listeners to elements that open/close modals.
 */
export function initModals() {
    // Close modal when clicking on the close button (x)
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when pressing the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Example: Attach click listener to a button that opens a specific modal
    // document.getElementById('openMyModalBtn').addEventListener('click', () => openModal('myModal'));
}

// Call initModals on DOMContentLoaded or from your main application entry point
// document.addEventListener('DOMContentLoaded', initModals);
