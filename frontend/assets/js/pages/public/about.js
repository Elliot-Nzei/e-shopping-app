/*
 * about.js
 * Handles the logic for the public About Us page.
 */

import { showToast } from '../../components/toast.js';
// import { getTeamMembers, getMilestones, getTestimonials } from '../../core/api.js'; // Assuming these API functions exist

/**
 * Initializes the About Us page.
 */
export async function initAboutPage() {
    console.log('Initializing About Us Page...');
    // Optionally load dynamic content if needed
    // await loadTeamMembers();
    // await loadMilestones();
    // await loadTestimonials();
}

// Example functions for dynamic content loading (uncomment and implement if needed)
/*
async function loadTeamMembers() {
    try {
        const teamMembers = await getTeamMembers();
        const teamMembersGrid = document.querySelector('.team-members-grid');
        if (teamMembersGrid) {
            teamMembersGrid.innerHTML = '';
            teamMembers.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.className = 'team-member-card';
                memberCard.innerHTML = `
                    <img src="${member.imageUrl}" alt="${member.name}" class="team-member-avatar">
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                `;
                teamMembersGrid.appendChild(memberCard);
            });
        }
    } catch (error) {
        console.error('Failed to load team members:', error);
        showToast('Failed to load team members.', 'error');
    }
}

async function loadMilestones() {
    try {
        const milestones = await getMilestones();
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.innerHTML = '';
            milestones.forEach(milestone => {
                const li = document.createElement('li');
                li.textContent = `${milestone.year}: ${milestone.description}`;
                timeline.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Failed to load milestones:', error);
        showToast('Failed to load milestones.', 'error');
    }
}

async function loadTestimonials() {
    try {
        const testimonials = await getTestimonials();
        const testimonialsSection = document.querySelector('.testimonials-section');
        if (testimonialsSection) {
            testimonialsSection.innerHTML = '';
            testimonials.forEach(testimonial => {
                const testimonialCard = document.createElement('div');
                testimonialCard.className = 'testimonial-card';
                testimonialCard.innerHTML = `
                    <p>"${testimonial.quote}"</p>
                    <span>- ${testimonial.author}</span>
                `;
                testimonialsSection.appendChild(testimonialCard);
            });
        }
    } catch (error) {
        console.error('Failed to load testimonials:', error);
        showToast('Failed to load testimonials.', 'error');
    }
}
*/

// Call initAboutPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAboutPage);