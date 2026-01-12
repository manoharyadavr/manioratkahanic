document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    // Header scroll background change - Removed as per request for persistent style
    /*
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    */

    // Scroll Reveal Animation
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        scrollRevealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Form Submission
    const weddingForm = document.getElementById('wedding-form');
    if (weddingForm) {
        weddingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = weddingForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                btn.innerText = 'Sent Successfully';
                btn.style.backgroundColor = '#2ecc71';
                btn.style.borderColor = '#2ecc71';
                weddingForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 3000);
            }, 1500);
        });
    }
    // Testimonial Carousel
    const sliderContainer = document.querySelector('.testimonial-container');
    const displayContainer = document.querySelector('.testimonial-display');
    const slides = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (sliderContainer && slides.length > 0) {
        let currentIndex = 0;
        let itemsPerView = window.innerWidth > 1024 ? 2 : 1; // 2 on desktop, 1 on mobile

        // Update items per view on resize
        window.addEventListener('resize', () => {
            const newItemsPerView = window.innerWidth > 1024 ? 2 : 1;
            if (newItemsPerView !== itemsPerView) {
                itemsPerView = newItemsPerView;
                updateSlider();
            }
        });

        const updateSlider = () => {
            // Calculate transform value
            // We want to show 'itemsPerView' items
            // Each item should take up 100% / itemsPerView percent of the track (minus gaps approx)
            // Simpler approach: translateX based on index * (100 / itemsPerView)%

            const percentage = -(currentIndex * (100 / itemsPerView));
            displayContainer.style.transform = `translateX(${percentage}%)`;

            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= slides.length - itemsPerView;

            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= slides.length - itemsPerView ? '0.5' : '1';
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < slides.length - itemsPerView) {
                    currentIndex++;
                    updateSlider();
                }
            });

            // Initial calculation
            updateSlider();
        }
    }
});
