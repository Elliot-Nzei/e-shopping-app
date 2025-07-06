/*
 * analytics.js
 * Handles the logic for the seller's analytics page.
 * This includes displaying various charts and metrics for sales, product performance, etc.
 */

import { showToast } from '../../components/toast.js';
// import { getSalesData, getProductPerformance, getTrafficSources } from '../../core/api.js'; // Assuming these API functions exist

const dateRangeFilter = document.getElementById('date-range-filter');
const exportAnalyticsBtn = document.getElementById('export-analytics-btn');

/**
 * Initializes the seller analytics page.
 */
export async function initSellerAnalyticsPage() {
    console.log('Initializing Seller Analytics Page...');
    setupEventListeners();
    await loadAnalyticsData();
}

/**
 * Sets up event listeners for filters and export button.
 */
function setupEventListeners() {
    if (dateRangeFilter) {
        dateRangeFilter.addEventListener('change', () => loadAnalyticsData());
    }
    if (exportAnalyticsBtn) {
        exportAnalyticsBtn.addEventListener('click', handleExportAnalytics);
    }
}

/**
 * Loads and displays various analytics data and charts.
 */
async function loadAnalyticsData() {
    const selectedDateRange = dateRangeFilter ? dateRangeFilter.value : 'last_30_days';
    console.log(`Loading analytics data for: ${selectedDateRange}`);

    try {
        // Mock data for demonstration
        const salesData = { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [10000, 12000, 9000, 15000] };
        const productPerformance = { labels: ['Product A', 'Product B', 'Product C'], data: [50000, 30000, 20000] };
        const trafficSources = { labels: ['Direct', 'Social', 'Search'], data: [40, 30, 30] };
        const customerDemographics = { labels: ['18-24', '25-34', '35-44'], data: [25, 45, 30] };

        // Update summary cards
        document.querySelector('.analytics-card:nth-child(1) .metric').textContent = `₦${(salesData.data.reduce((a, b) => a + b, 0)).toLocaleString()}`;
        document.querySelector('.analytics-card:nth-child(2) .metric').textContent = '50'; // Placeholder
        document.querySelector('.analytics-card:nth-child(3) .metric').textContent = '5.2%'; // Placeholder
        document.querySelector('.analytics-card:nth-child(4) .metric').textContent = `₦${(salesData.data.reduce((a, b) => a + b, 0) / 50).toLocaleString(undefined, { maximumFractionDigits: 0 })}`; // Placeholder

        // Render charts
        renderSalesTrendChart(salesData);
        renderProductPerformanceChart(productPerformance);
        renderTrafficSourceChart(trafficSources);
        renderCustomerDemographicsChart(customerDemographics);

    } catch (error) {
        console.error('Failed to load analytics data:', error);
        showToast('Failed to load analytics data. Please try again.', 'error');
    }
}

/**
 * Renders the Sales Trends chart.
 * @param {object} data - Chart data.
 */
function renderSalesTrendChart(data) {
    const ctx = document.getElementById('salesTrendChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sales',
                    data: data.data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

/**
 * Renders the Product Performance chart.
 * @param {object} data - Chart data.
 */
function renderProductPerformanceChart(data) {
    const ctx = document.getElementById('productPerformanceChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.data,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

/**
 * Renders the Traffic Sources chart.
 * @param {object} data - Chart data.
 */
function renderTrafficSourceChart(data) {
    const ctx = document.getElementById('trafficSourceChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
}

/**
 * Renders the Customer Demographics chart.
 * @param {object} data - Chart data.
 */
function renderCustomerDemographicsChart(data) {
    const ctx = document.getElementById('customerDemographicsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
}

/**
 * Handles the export analytics data action.
 */
function handleExportAnalytics() {
    const selectedDateRange = dateRangeFilter ? dateRangeFilter.value : 'last_30_days';
    showToast(`Exporting analytics data for ${selectedDateRange}...`, 'info');
    // TODO: Implement actual data export logic (e.g., generate CSV/PDF)
}

// Call initSellerAnalyticsPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSellerAnalyticsPage);
