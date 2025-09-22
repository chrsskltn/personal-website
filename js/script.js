document.addEventListener('DOMContentLoaded', () => {
    const animatedSubheading = document.getElementById('animated-subheading');
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const currentYear = document.getElementById('current-year');

    // Typing animation for the hero subheading
    const phrases = [
        'design systems that scale.',
        'delightful user interfaces.',
        'human-centered products.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    const typingSpeed = 85;
    const erasingSpeed = 45;
    const delayBetweenPhrases = 1600;

    function type() {
        if (!animatedSubheading) {
            return;
        }

        if (charIndex < phrases[phraseIndex].length) {
            animatedSubheading.textContent += phrases[phraseIndex].charAt(charIndex);
            charIndex += 1;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, delayBetweenPhrases);
        }
    }

    function erase() {
        if (!animatedSubheading) {
            return;
        }

        if (charIndex > 0) {
            animatedSubheading.textContent = phrases[phraseIndex].substring(0, charIndex - 1);
            charIndex -= 1;
            setTimeout(erase, erasingSpeed);
        } else {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 350);
        }
    }

    if (animatedSubheading) {
        type();
    }

    // Responsive navigation toggle
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isVisible = navList.getAttribute('data-visible') === 'true';
            navList.setAttribute('data-visible', String(!isVisible));
            navToggle.setAttribute('aria-expanded', String(!isVisible));
        });

        navList.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navList.setAttribute('data-visible', 'false');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Contact form handling (demo only)
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const message = String(formData.get('message') || '').trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            formStatus.classList.remove('form-status--error', 'form-status--success');

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all of the fields before sending.';
                formStatus.classList.add('form-status--error');
                return;
            }

            if (!emailPattern.test(email)) {
                formStatus.textContent = 'Please enter a valid email address.';
                formStatus.classList.add('form-status--error');
                return;
            }

            formStatus.textContent = `Thanks ${name}! Your message is on its way.`;
            formStatus.classList.add('form-status--success');
            contactForm.reset();
        });
    }

    // Set the current year in the footer
    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }
});

