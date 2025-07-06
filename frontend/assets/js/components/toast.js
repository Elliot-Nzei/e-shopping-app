/*
 * toast.js
 * Handles the display of toast notifications (small, temporary pop-up messages).
 */

/**
 * Displays a toast notification.
 * @param {string} message - The message to display in the toast.
 * @param {string} [type='info'] - The type of toast ('success', 'error', 'warning', 'info').
 * @param {number} [duration=3000] - How long the toast should be visible in milliseconds.
 */
export function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = getOrCreateToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Animate out and remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

/**
 * Gets or creates the toast container element.
 * @returns {HTMLElement} - The toast container element.
 */
function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);

        // Add basic styling for the container
        const style = document.createElement('style');
        style.textContent = `
            #toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1050;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .toast {
                background-color: #333;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.3s ease-out, transform 0.3s ease-out;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
            .toast.hide {
                opacity: 0;
                transform: translateY(-20px);
            }
            .toast-success {
                background-color: #28a745;
            }
            .toast-error {
                background-color: #dc3545;
            }
            .toast-warning {
                background-color: #ffc107;
                color: #333;
            }
            .toast-info {
                background-color: #17a2b8;
            }
        `;
        document.head.appendChild(style);
    }
    return container;
}

// Example Usage:
// showToast('Item added to cart!', 'success');
// showToast('Login failed. Please check your credentials.', 'error', 5000);
