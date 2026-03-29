// script.js

// Configuration for Chart Colors
const colors = {
    primary: '#2563eb',   // Blue 600
    primaryLight: 'rgba(37, 99, 235, 0.2)',
    success: '#16a34a',   // Green 600
    pending: '#cbd5e1',    // Slate 300

};

// --- Chart 1: System Completeness (Radar) ---
const ctxCompleteness = document.getElementById('completenessChart').getContext('2d');

new Chart(ctxCompleteness, {
    type: 'radar',
    data: {
        // Updated labels to reflect new modules
        labels: [
            'Database Core', 
            'Authentication', 
            'UI / UX', 
            'Admin Tools', 
            'Search Engine', 
            'Deployment'
        ],
        datasets: [{
            label: 'Completion %',
            // Notice: Auth, Admin, Search are now 100!
            data: [100, 100, 95, 100, 100, 0], 
            backgroundColor: colors.primaryLight,
            borderColor: colors.primary,
            pointBackgroundColor: colors.primary,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: colors.primary
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: 'rgba(0,0,0,0.1)' },
                grid: { color: 'rgba(0,0,0,0.1)' },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: { backdropColor: 'transparent' } // Clean look
            }
        },
        plugins: {
            legend: { display: false }
        }
    }
});

// --- Chart 2: Milestone Timeline (Bar) ---
const ctxMilestone = document.getElementById('milestoneChart').getContext('2d');

new Chart(ctxMilestone, {
    type: 'bar',
    data: {
        labels: ['Phase 1: Static', 'DB Setup', 'Phase 2: Auth', 'Voting System', 'Search & Filter', 'Phase 3: Deploy'],
        datasets: [{
            label: 'Progress',
            // Everything is done except deployment
            data: [100, 100, 100, 100, 100, 0], 
            backgroundColor: [
                colors.success,
                colors.success,
                colors.primary, // Current Phase Highlight
                colors.primary,
                colors.primary,
                colors.pending
            ],
            borderRadius: 6
        }]
    },
    options: {
        indexAxis: 'y', // Horizontal bars
        maintainAspectRatio: false,
        scales: {
            x: {
                max: 100,
                grid: { display: false }
            },
            y: {
                grid: { display: false }
            }
        },
        plugins: {
            legend: { display: false }
        }
    }
});

