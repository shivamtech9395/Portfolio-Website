// Project Filtering
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        if (category === 'all' || project.classList.contains(category)) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });

    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        if (button.getAttribute('data-filter') === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let count = 0;
        const increment = target / 100;
        const updateCount = () => {
            count += increment;
            if (count < target) {
                stat.textContent = Math.ceil(count);
                setTimeout(updateCount, 20);
            } else {
                stat.textContent = target;
            }
        };
        updateCount();
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formResponse = document.getElementById('form-response');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        console.log('Sending data:', data); // Debug log

        try {
            const response = await fetch('http://localhost:8000/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                formResponse.innerHTML = `<p class="text-success">${result.message}</p>`;
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formResponse.innerHTML = `<p class="text-danger">Error submitting message: ${error.message}. Please try again.</p>`;
        } finally {
            setTimeout(() => {
                formResponse.innerHTML = '';
            }, 3000);
        }
    });
}

// Project Views Counter (Local Counter)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const viewCount = card.querySelector('.view-count');
        let views = parseInt(viewCount.textContent);
        viewCount.textContent = views + 1;
    });
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
});