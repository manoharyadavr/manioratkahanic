document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    // Hero Slideshow
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            // Remove active class from current slide
            heroSlides[currentSlide].classList.remove('active');
            // Move to next slide, looping back to 0
            currentSlide = (currentSlide + 1) % heroSlides.length;
            // Add active class to new slide
            heroSlides[currentSlide].classList.add('active');
        }, 3000); // 3 seconds interval
    }

    // Header scroll background change
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Custom Cursor Logic
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const watermark = document.querySelector('.watermark-text');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Cursor Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Cursor Outline follows with slight delay (using animate for smooth trailing)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .card, .service-item, input, textarea');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });

        portfolioItems.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('portfolio-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('portfolio-hover');
            });
        });
    }

    // Parallax Effects
    const whyBg = document.querySelector('.why-bg-layer');

    window.addEventListener('scroll', () => {
        // Watermark Parallax
        if (watermark) {
            const speed = watermark.getAttribute('data-parallax');
            const yPos = (window.scrollY * speed);
            watermark.style.transform = `translate(-50%, calc(-50% + ${yPos}px))`;
        }

        // Why Section Parallax
        if (whyBg) {
            const section = document.querySelector('.why-immersive');
            const rect = section.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const move = (scrollPercent * 100) - 50;
                whyBg.style.transform = `translateY(${move}px)`;
            }
        }

        // Portfolio Mosaic Parallax
        const mosaicItems = document.querySelectorAll('.portfolio-item.item-tall, .portfolio-item.item-large');
        mosaicItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = (index % 2 === 0) ? 20 : -20;
                const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const shift = (scrollPercent * speed) - (speed / 2);
                const img = item.querySelector('.portfolio-img');
                if (img) {
                    img.style.transform = `scale(1.1) translateY(${shift}px)`;
                }
            }
        });
    });

    // Scroll Reveal Animation (Existing)
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

    // Form Submission (WhatsApp Redirect)
    const weddingForm = document.getElementById('wedding-form');
    if (weddingForm) {
        weddingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value;

            // Format the message for WhatsApp
            const whatsappMessage = `*New Wedding Inquiry*\n\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Phone:* ${phone}\n` +
                `*Event Date:* ${date}\n` +
                `*Message:* ${message}`;

            // Your WhatsApp number (international format without +)
            const phoneNumber = '919876543210';

            // Create the WhatsApp URL
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            // Open in a new tab
            window.open(whatsappURL, '_blank');
        });
    }

    // Cinematic Testimonial Slider
    const cinSlides = document.querySelectorAll('.cinematic-slide');
    const cinPrevBtn = document.querySelector('.cin-nav.prev');
    const cinNextBtn = document.querySelector('.cin-nav.next');
    const cinCurrentIndex = document.querySelector('.cin-index .current');
    const cinTotalIndex = document.querySelector('.cin-index .total');

    if (cinSlides.length > 0) {
        let currentCinIdx = 0;
        cinTotalIndex.textContent = String(cinSlides.length).padStart(2, '0');

        const updateCinSlider = (newIdx) => {
            // Remove active from current
            cinSlides[currentCinIdx].classList.remove('active');

            // Set new index
            currentCinIdx = newIdx;

            // Add active to new
            cinSlides[currentCinIdx].classList.add('active');

            // Update counter
            cinCurrentIndex.textContent = String(currentCinIdx + 1).padStart(2, '0');
        };

        if (cinPrevBtn && cinNextBtn) {
            cinPrevBtn.addEventListener('click', () => {
                let nextIdx = (currentCinIdx - 1 + cinSlides.length) % cinSlides.length;
                updateCinSlider(nextIdx);
            });

            cinNextBtn.addEventListener('click', () => {
                let nextIdx = (currentCinIdx + 1) % cinSlides.length;
                updateCinSlider(nextIdx);
            });
        }
    }

    // Gallery Modal Logic
    const galleryModal = document.getElementById('gallery-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalMainImg = document.getElementById('modal-main-img');
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalPrev = document.querySelector('.modal-nav.prev');
    const modalNext = document.querySelector('.modal-nav.next');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Project Data (Simulated Related Images)
    const projectData = {
        'orchard': {
            title: 'Opulent Evenings',
            images: [
                'assets/charminar1.jpeg',
                'assets/charminar2.jpeg',
                'assets/charminar3.jpeg',
                'assets/charminar4.jpeg'
            ]
        },
        'sunset': {
            title: 'Golden Hour Tales',
            images: [
                'assets/couple2.jpeg',
                'assets/couple21.jpeg',
                'assets/couple22.jpeg',
                'assets/couple23.jpeg'
            ]
        },
        'decor': {
            title: 'Elegant Ambience',
            images: [
                'assets/out1.jpeg',
                'assets/out4.jpeg',
                'assets/out7.jpeg',
                'assets/out9.jpeg',
                'assets/out2.jpeg',
                'assets/out5.jpeg',
            ]
        },
        'emotions': {
            title: 'Pure Emotions',
            images: [
                'assets/couple41.jpeg',
                'assets/couple42.jpeg',
                'assets/couple43.jpeg',
                'assets/couple44.jpeg',
            ]
        },
        'traditions': {
            title: 'Timeless Traditions',
            images: [
                'assets/couple31.jpeg',
                'assets/couple32.jpeg',
                'assets/couple33.jpeg',
                'assets/couple34.jpeg'
            ]
        },
        'grand': {
            title: 'The Heritage Vows',
            images: [
                'assets/set1.jpeg',
                'assets/out6.jpeg',
                'assets/out10.jpeg',
                'assets/out11.jpeg',
                'assets/out3.jpeg',
                'assets/out8.jpeg'
            ]
        }
    };

    let currentProjectImages = [];
    let currentImgIdx = 0;

    const updateGalleryDisplay = (index) => {
        if (index < 0 || index >= currentProjectImages.length) return;

        currentImgIdx = index;

        // Update main image with fade effect
        modalMainImg.style.opacity = '0';
        setTimeout(() => {
            modalMainImg.src = currentProjectImages[currentImgIdx];
            modalMainImg.style.opacity = '1';
        }, 200);

        // Update thumbnails
        const thumbs = modalThumbnails.querySelectorAll('.thumb-item');
        thumbs.forEach((thumb, idx) => {
            if (idx === currentImgIdx) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    };

    if (galleryModal && portfolioItems.length > 0) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.getAttribute('data-id');
                const data = projectData[projectId];

                if (data) {
                    modalTitle.textContent = data.title;
                    currentProjectImages = data.images;
                    currentImgIdx = 0;

                    modalThumbnails.innerHTML = '';

                    currentProjectImages.forEach((imgSrc, index) => {
                        const thumb = document.createElement('div');
                        thumb.classList.add('thumb-item');
                        if (index === 0) thumb.classList.add('active');

                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.alt = `Thumbnail ${index + 1}`;

                        thumb.appendChild(img);
                        thumb.addEventListener('click', () => updateGalleryDisplay(index));
                        modalThumbnails.appendChild(thumb);
                    });

                    updateGalleryDisplay(0);

                    galleryModal.style.display = 'block';
                    void galleryModal.offsetWidth;
                    galleryModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Navigation Arrows
        if (modalPrev && modalNext) {
            modalPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                let nextIdx = (currentImgIdx - 1 + currentProjectImages.length) % currentProjectImages.length;
                updateGalleryDisplay(nextIdx);
            });

            modalNext.addEventListener('click', (e) => {
                e.stopPropagation();
                let nextIdx = (currentImgIdx + 1) % currentProjectImages.length;
                updateGalleryDisplay(nextIdx);
            });
        }

        const closeModal = () => {
            galleryModal.classList.remove('active');
            setTimeout(() => {
                galleryModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (e) => {
            if (e.target === galleryModal) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (!galleryModal.classList.contains('active')) return;

            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') {
                let nextIdx = (currentImgIdx - 1 + currentProjectImages.length) % currentProjectImages.length;
                updateGalleryDisplay(nextIdx);
            }
            if (e.key === 'ArrowRight') {
                let nextIdx = (currentImgIdx + 1) % currentProjectImages.length;
                updateGalleryDisplay(nextIdx);
            }
        });
    }
});
