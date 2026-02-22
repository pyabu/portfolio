/* ===================================
   ABUSALEEM PORTFOLIO - OPTIMIZED
   Performance-focused JavaScript
   ================================= */

// Utility functions for performance
const Utils = {
    // Throttle function to limit execution frequency
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Debounce function to delay execution
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    // Check if element is in viewport
    isInViewport(el, offset = 0) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight + offset && rect.bottom > -offset;
    },

    // Request animation frame with fallback
    raf: window.requestAnimationFrame || (cb => setTimeout(cb, 16))
};

// Cache DOM elements
const DOM = {
    navbar: null,
    navToggle: null,
    navMenu: null,
    navLinks: null,
    sections: null,
    typingElement: null,
    particles: null,
    hero: null,
    codeWindow: null,
    orbs: null,
    techStack: null,
    stackItems: null,
    techArch: null,
    archItems: null,
    techOrbit: null,
    customCursor: null,
    cursorGlow: null,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.typingElement = document.getElementById('typing-text');
        this.particles = document.getElementById('particles');
        this.hero = document.querySelector('.hero');
        this.codeWindow = document.querySelector('.code-window');
        this.orbs = document.querySelectorAll('.gradient-orb');
        this.techStack = document.querySelector('.tech-stack-3d');
        this.stackItems = document.querySelectorAll('.stack-item');
        this.techArch = document.querySelector('.tech-arch');
        this.archItems = document.querySelectorAll('.arch-item');
        this.techOrbit = document.querySelector('.tech-orbit');
        this.customCursor = document.querySelector('.custom-cursor');
        this.cursorGlow = document.querySelector('.cursor-glow');

        // Cache section details for 3D effects to avoid querySelector in loop
        this.sectionDetails = Array.from(this.sections).map(section => ({
            element: section,
            header: section.querySelector('.section-header'),
            content: section.querySelector('.about-content, .skills-grid, .timeline, .projects-grid, .contact-content')
        }));
    }
};

// State management
const State = {
    lastScrollY: 0,
    scrollDirection: 'down',
    isScrolling: false,
    animationFrame: null,
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,
    lenis: null
};

// Single DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
    // Mark body so CSS knows JS is active (progressive enhancement)
    document.body.classList.add('js-loaded');
    initAll();
});

function initAll() {
    initLenis();
    initNavigation();
    initTypingEffect();
    initIntersectionObservers();
    initScrollHandler();
    initContactForm();
    initParticles();
    initMouseEffects();
    initScrollProgress();
}

function initLenis() {
    try {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis not loaded, using native scroll');
            return;
        }
        State.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            State.lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    } catch (e) {
        console.warn('Lenis initialization failed, using native scroll:', e.message);
    }
}

// Global update loop — only runs when cursor moves (desktop only)
let cursorActive = false;
function updateAll() {
    if (!cursorActive) return;

    const lerp = 0.15;
    State.cursorX += (State.mouseX - State.cursorX) * lerp;
    State.cursorY += (State.mouseY - State.cursorY) * lerp;

    if (DOM.customCursor) {
        DOM.customCursor.style.left = `${State.cursorX}px`;
        DOM.customCursor.style.top = `${State.cursorY}px`;
    }
    if (DOM.cursorGlow) {
        DOM.cursorGlow.style.left = `${State.cursorX}px`;
        DOM.cursorGlow.style.top = `${State.cursorY}px`;
    }

    // Stop loop when cursor is close enough
    const dx = State.mouseX - State.cursorX;
    const dy = State.mouseY - State.cursorY;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        cursorActive = false;
        return;
    }
    requestAnimationFrame(updateAll);
}

/* ===================================
   UNIFIED SCROLL HANDLER
   ================================= */

function initScrollHandler() {
    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Navbar scroll effect
        DOM.navbar?.classList.toggle('scrolled', scrollY > 50);

        // Active nav link (throttled naturally by scroll event)
        updateActiveNavLink(scrollY);

        State.lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Removed heavy per-scroll 3D stack transforms — now CSS-animated only

function updateActiveNavLink(scrollY) {
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            DOM.navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
        }
    });
}

// Removed updateParallax, update3DEffects, resetScrollEffects — too expensive per-scroll

/* ===================================
   INTERSECTION OBSERVERS (CONSOLIDATED)
   ================================= */

function initIntersectionObservers() {
    // Simple, fast reveal animation — no heavy filter/3D classes
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'animate');

                // Fast staggered reveal for children
                const items = entry.target.querySelectorAll('.skill-item, .timeline-content, .project-card, .highlight, .contact-card');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, i * 80);
                });
            }
        });
    }, { rootMargin: '-50px', threshold: 0.1 });

    // Observe sections
    DOM.sections.forEach(section => animObserver.observe(section));

    // Observe cards
    document.querySelectorAll('.glass-card, .skill-category, .project-card, .timeline-content')
        .forEach(el => animObserver.observe(el));

    // Counter observer
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));
}

/* ===================================
   NAVIGATION
   ================================= */

function initNavigation() {
    DOM.navToggle?.addEventListener('click', () => {
        DOM.navToggle.classList.toggle('active');
        DOM.navMenu?.classList.toggle('active');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (DOM.navMenu?.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.nav-toggle')) {
            DOM.navToggle?.classList.remove('active');
            DOM.navMenu?.classList.remove('active');
        }
    });

    // Close nav on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.navMenu?.classList.contains('active')) {
            DOM.navToggle?.classList.remove('active');
            DOM.navMenu?.classList.remove('active');
        }
    });

    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            DOM.navToggle?.classList.remove('active');
            DOM.navMenu?.classList.remove('active');

            const target = document.querySelector(link.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ===================================
   TYPING EFFECT
   ================================= */

function initTypingEffect() {
    if (!DOM.typingElement) return;

    const texts = ['App Developer', 'Flutter Expert', 'Kotlin Enthusiast', 'Web Developer', 'UI/UX Designer'];
    let textIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            DOM.typingElement.textContent = currentText.substring(0, --charIndex);
        } else {
            DOM.typingElement.textContent = currentText.substring(0, ++charIndex);
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            speed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ===================================
   COUNTER ANIMATION
   ================================= */

function animateCounter(element, target) {
    const duration = 1500;
    const steps = 50;
    const increment = target / steps;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ===================================
   PROJECT FILTERS
   ================================= */

document.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (!filterBtn) return;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    filterBtn.classList.add('active');

    const filter = filterBtn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
            card.style.display = 'block';
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
});

/* ===================================
   CONTACT FORM
   ================================= */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function showNotification(message, type) {
    document.querySelector('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        background: ${type === 'success' ? 'rgba(0, 255, 100, 0.1)' : 'rgba(255, 100, 100, 0.1)'};
        border: 1px solid ${type === 'success' ? 'rgba(0, 255, 100, 0.3)' : 'rgba(255, 100, 100, 0.3)'};
        color: ${type === 'success' ? '#00ff64' : '#ff6464'};
        padding: 15px 25px; border-radius: 12px;
        display: flex; align-items: center; gap: 10px;
        z-index: 9999; animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

/* ===================================
   PARTICLES (OPTIMIZED)
   ================================= */

function initParticles() {
    if (!DOM.particles) return;

    // Reduce particle count for better performance
    const particleCount = 30;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px; height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${15 + Math.random() * 10}s ${Math.random() * 5}s infinite ease-in-out;
        `;
        fragment.appendChild(particle);
    }

    DOM.particles.appendChild(fragment);

    // Add keyframes once
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ===================================
   MOUSE EFFECTS
   ================================= */

function initMouseEffects() {
    // Skip heavy mouse effects on touch devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    window.addEventListener('mousemove', (e) => {
        State.mouseX = e.clientX;
        State.mouseY = e.clientY;
        if (!cursorActive) {
            cursorActive = true;
            requestAnimationFrame(updateAll);
        }
    });

    // Custom cursor scaling on hover
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .project-card, .skill-category, .filter-btn');
        if (target && DOM.customCursor) {
            DOM.customCursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
            DOM.customCursor.style.background = 'white';
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .project-card, .skill-category, .filter-btn');
        if (target && DOM.customCursor) {
            DOM.customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            DOM.customCursor.style.background = 'var(--primary)';
        }
    });

    // Hero parallax
    if (DOM.hero && DOM.codeWindow) {
        DOM.hero.addEventListener('mousemove', Utils.throttle((e) => {
            const rect = DOM.hero.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 50;
            const y = (e.clientY - rect.top - rect.height / 2) / 50;
            DOM.codeWindow.style.transform = `translateX(${x}px) translateY(${y}px) rotateX(${-y}deg) rotateY(${x}deg)`;
        }, 16));

        DOM.hero.addEventListener('mouseleave', () => {
            DOM.codeWindow.style.transform = '';
        });
    }

    // Magnetic buttons
    document.querySelectorAll('.btn, .social-link, .project-link').forEach(el => {
        el.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
            this.style.transform = `translate(${x}px, ${y}px)`;
        });

        el.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Click ripple effect
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, .nav-link, .filter-btn, .social-link, .project-link');
        if (!target) return;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        const rect = target.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    // 3D Tilt Effect for Project Cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

/* ===================================
   TEXT RIPPLE EFFECT;
   ================================= */

/* Text splitting removed — too expensive animating hundreds of individual chars */

/* ===================================
   SCROLL PROGRESS BAR
   ================================= */

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-3d';
    progressBar.style.cssText = `
        position: fixed; top: 70px; left: 0; height: 3px; width: 100%;
        background: linear-gradient(90deg, #fff, #888, #fff);
        transform-origin: left; transform: scaleX(0);
        z-index: 999; box-shadow: 0 0 10px rgba(255,255,255,0.5);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', Utils.throttle(() => {
        const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        progressBar.style.transform = `scaleX(${progress})`;
    }, 16), { passive: true });
}

/* ===================================
   SECTION RIPPLE WAVES
   ================================= */

/* Section ripple waves removed — too many animated pseudo-elements */

// Add notification animation keyframes
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(notifStyle);

/* ===================================
   PRELOADER
   ================================= */

(function initPreloader() {
    // Wait for DOM if not ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runPreloader);
    } else {
        runPreloader();
    }

    function runPreloader() {
        const preloader = document.getElementById('preloader');
        const progressBar = document.getElementById('preloader-progress');
        const statusText = document.getElementById('preloader-status');

        if (!preloader) return;

    const statuses = ['Loading assets...', 'Initializing modules...', 'Preparing animations...', 'Almost ready...'];
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 25 + 5;
        if (progress > 100) progress = 100;

        if (progressBar) progressBar.style.width = `${progress}%`;

        const statusIndex = Math.min(Math.floor(progress / 25), statuses.length - 1);
        if (statusText) statusText.textContent = statuses[statusIndex];

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.style.overflow = '';
            }, 400);
        }
    }, 200);

    // Fallback: remove preloader after 3 seconds max
    setTimeout(() => {
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
    }, 3000);
    } // close runPreloader
})();

/* ===================================
   BACK TO TOP BUTTON
   ================================= */

(function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', Utils.throttle(() => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }, 100), { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ===================================
   THEME TOGGLE
   ================================= */

(function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggle || !icon) return;

    // Check saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');

        if (isLight) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });
})();

/* ===================================
   TESTIMONIALS SLIDER
   ================================= */

(function initTestimonialsSlider() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const dots = dotsContainer.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoPlayInterval;

    function goToSlide(index) {
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        currentIndex = index;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(currentIndex - 1);
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(currentIndex + 1);
        startAutoPlay();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(i);
            startAutoPlay();
        });
    });

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        }
        isDragging = false;
        startAutoPlay();
    }, { passive: true });

    startAutoPlay();
})();

/* ===================================
   FUN FACTS COUNTER
   ================================= */

(function initFunFactCounters() {
    const counters = document.querySelectorAll('.funfact-number');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateFunCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateFunCounter(element, target) {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    }
})();

/* ===================================
   NEWSLETTER FORM
   ================================= */

(function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input').value;
        if (email) {
            showNotification('Thanks for subscribing! You\'ll hear from me soon.', 'success');
            form.reset();
        }
    });
})();

/* ===================================
   LAZY LOADING IMAGES
   ================================= */

(function initLazyImages() {
    const images = document.querySelectorAll('.project-placeholder img');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';
                
                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    img.addEventListener('error', () => {
                        img.style.opacity = '0.3';
                    });
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });

    images.forEach(img => imageObserver.observe(img));
})();

/* ===================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ================================= */

(function initSmoothAnchors() {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;
        
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
})();

/* ===================================
   SMOOTH SCROLL FOR NEW NAV LINKS
   ================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Observe new sections for scroll animation (light fade only)
    const newSections = document.querySelectorAll('.services, .experience, .funfacts, .testimonials, .achievements, .cta-banner');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'animate');

                const items = entry.target.querySelectorAll('.service-card, .experience-card, .funfact-item, .testimonial-card, .achievement-card');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, i * 80);
                });
            }
        });
    }, { rootMargin: '-50px', threshold: 0.1 });

    newSections.forEach(section => sectionObserver.observe(section));

    // Add tilt glow elements to interactive cards
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouchDevice) {
        document.querySelectorAll('.service-card, .achievement-card').forEach(card => {
            const glow = document.createElement('div');
            glow.className = 'tilt-glow';
            card.appendChild(glow);
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                glow.style.left = `${e.clientX - rect.left}px`;
                glow.style.top = `${e.clientY - rect.top}px`;
                glow.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });
        });

        // 3D tilt for service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});
