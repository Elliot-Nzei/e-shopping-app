/*
 * pagination.js
 * Handles the logic for pagination components.
 * This module provides functions to generate pagination controls and manage page changes.
 */

/**
 * Renders a pagination component into a specified container.
 * @param {HTMLElement} containerElement - The DOM element where pagination controls will be rendered.
 * @param {object} options - Configuration options for pagination.
 * @param {number} options.currentPage - The current active page number (1-indexed).
 * @param {number} options.totalPages - The total number of pages available.
 * @param {function} options.onPageChange - Callback function to execute when a page is changed.
 * @param {number} [options.maxVisiblePages=5] - Maximum number of page numbers to display.
 */
export function renderPagination(containerElement, { currentPage, totalPages, onPageChange, maxVisiblePages = 5 }) {
    if (!containerElement) {
        console.error('Pagination container element not found.');
        return;
    }

    containerElement.innerHTML = ''; // Clear existing pagination

    if (totalPages <= 1) {
        return; // No need for pagination if only one page or less
    }

    const ul = document.createElement('ul');
    ul.className = 'pagination';

    // Calculate start and end page numbers for visible range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage was capped
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    ul.appendChild(createPaginationItem('Previous', currentPage > 1, () => onPageChange(currentPage - 1), 'prev'));

    // First page (if not in visible range)
    if (startPage > 1) {
        ul.appendChild(createPaginationItem(1, true, () => onPageChange(1)));
        if (startPage > 2) {
            ul.appendChild(createPaginationItem('...', false));
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        ul.appendChild(createPaginationItem(i, true, () => onPageChange(i), i === currentPage ? 'active' : ''));
    }

    // Last page (if not in visible range)
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            ul.appendChild(createPaginationItem('...', false));
        }
        ul.appendChild(createPaginationItem(totalPages, true, () => onPageChange(totalPages)));
    }

    // Next button
    ul.appendChild(createPaginationItem('Next', currentPage < totalPages, () => onPageChange(currentPage + 1), 'next'));

    containerElement.appendChild(ul);
}

/**
 * Creates a single pagination list item (li element).
 * @param {string|number} text - The text or number to display.
 * @param {boolean} isClickable - Whether the item should be clickable.
 * @param {function} [onClick] - The click handler function.
 * @param {string} [className=''] - Additional CSS class for the item.
 * @returns {HTMLElement} - The created li element.
 */
function createPaginationItem(text, isClickable, onClick = () => {}, className = '') {
    const li = document.createElement('li');
    li.className = `page-item ${className}`;
    if (!isClickable) {
        li.classList.add('disabled');
    }

    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#'; // Prevent default navigation
    a.textContent = text;

    if (isClickable) {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            onClick();
        });
    }

    li.appendChild(a);
    return li;
}

// Basic CSS for pagination (can be moved to components.css or main.css)
/*
const paginationStyles = `
    .pagination {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 20px 0;
        justify-content: center;
    }
    .page-item {
        margin: 0 5px;
    }
    .page-link {
        display: block;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        color: #007bff;
        text-decoration: none;
    }
    .page-link:hover {
        background-color: #e9ecef;
    }
    .page-item.active .page-link {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
    }
    .page-item.disabled .page-link {
        color: #6c757d;
        pointer-events: none;
        background-color: #e9ecef;
    }
`;
const styleTag = document.createElement('style');
styleTag.textContent = paginationStyles;
document.head.appendChild(styleTag);
*/

// Example Usage:
// const paginationContainer = document.getElementById('my-pagination-container');
// renderPagination(paginationContainer, {
//     currentPage: 3,
//     totalPages: 10,
//     onPageChange: (page) => {
//         console.log('Navigating to page:', page);
//         // Fetch new data for the selected page
//     }
// });
