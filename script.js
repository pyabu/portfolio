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
    }
};

// State management
const State = {
    lastScrollY: 0,
    scrollDirection: 'down',
    isScrolling: false,
    animationFrame: null
};

// Single DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
    initAll();
});

function initAll() {
    initNavigation();
    initTypingEffect();
    initIntersectionObservers();
    initScrollHandler();
    initContactForm();
    initParticles();
    initMouseEffects();
    initScrollProgress();
}

/* ===================================
   UNIFIED SCROLL HANDLER
   ================================= */

function initScrollHandler() {
    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            Utils.raf.call(window, () => {
                const scrollY = window.scrollY;
                const scrollDelta = scrollY - State.lastScrollY;

                // Update state
                State.scrollDirection = scrollDelta > 0 ? 'down' : 'up';

                // Navbar scroll effect
                DOM.navbar?.classList.toggle('scrolled', scrollY > 50);

                // Active nav link
                updateActiveNavLink(scrollY);

                // Parallax effects
                updateParallax(scrollY, scrollDelta);

                // 3D section effects
                update3DEffects(scrollDelta);

                // Text ripple on significant scroll
                if (Math.abs(scrollDelta) > 30) {
                    triggerTextRipple();
                }

                State.lastScrollY = scrollY;
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Debounced scroll end handler
    const handleScrollEnd = Utils.debounce(() => {
        resetScrollEffects();
    }, 150);

    window.addEventListener('scroll', handleScrollEnd, { passive: true });
}

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

function updateParallax(scrollY, scrollDelta) {
    DOM.orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.05;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

function update3DEffects(scrollDelta) {
    const windowHeight = window.innerHeight;

    DOM.sections.forEach(section => {
        if (!Utils.isInViewport(section)) return;

        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = sectionCenter - viewportCenter;

        const rotateX = (distanceFromCenter / windowHeight) * 8;
        const translateZ = Math.abs(distanceFromCenter / windowHeight) * -30;

        const header = section.querySelector('.section-header');
        const content = section.querySelector('.about-content, .skills-grid, .timeline, .projects-grid, .contact-content');

        if (header) {
            header.style.transform = `perspective(1000px) rotateX(${rotateX * 0.2}deg) translateZ(${translateZ * 0.3}px)`;
        }
        if (content) {
            content.style.transform = `perspective(1000px) rotateX(${rotateX * 0.1}deg) translateZ(${translateZ * 0.5}px)`;
        }
    });
}

function resetScrollEffects() {
    document.querySelectorAll('.liquid-text').forEach(el => {
        el.style.filter = '';
        el.style.transform = '';
    });

    document.querySelectorAll('.liquid-glass').forEach(el => {
        el.style.backdropFilter = '';
        el.style.transform = '';
    });
}

/* ===================================
   INTERSECTION OBSERVERS (CONSOLIDATED)
   ================================= */

function initIntersectionObservers() {
    // Impressive scroll animation effects
    const scrollEffects = ['scroll-cinematic', 'scroll-parallax-zoom', 'scroll-staggered', 'scroll-elastic', 'scroll-glow'];
    let effectIndex = 0;

    // Main animation observer with impressive effects
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply varied impressive effects
                const effect = scrollEffects[effectIndex % scrollEffects.length];
                entry.target.classList.add('visible', 'animate', effect);
                effectIndex++;

                // Staggered animation for children with impressive effects
                const items = entry.target.querySelectorAll('.skill-item, .timeline-content, .project-card, .highlight, .contact-card');
                items.forEach((item, i) => {
                    const childEffect = scrollEffects[(effectIndex + i) % scrollEffects.length];
                    setTimeout(() => {
                        item.classList.add('animate', childEffect);
                    }, i * 150);
                });
            }
        });
    }, { rootMargin: '-80px', threshold: 0.15 });

    // Observe sections
    DOM.sections.forEach(section => animObserver.observe(section));

    // Observe cards and content with varied effects
    document.querySelectorAll('.glass-card, .skill-category, .project-card, .timeline-content')
        .forEach((el, i) => {
            el.style.animationDelay = `${i * 0.1}s`;
            animObserver.observe(el);
        });

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

    // Footer ripple observer
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerCharRipple(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.footer-brand .logo-text, .footer-bottom p')
        .forEach(el => footerObserver.observe(el));
}

/* ===================================
   NAVIGATION
   ================================= */

function initNavigation() {
    DOM.navToggle?.addEventListener('click', () => {
        DOM.navToggle.classList.toggle('active');
        DOM.navMenu?.classList.toggle('active');
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
}

/* ===================================
   TEXT RIPPLE EFFECT
   ================================= */

// Initialize text splitting
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section-title, .footer-brand .logo-text, .footer-bottom p').forEach(el => {
        if (el.classList.contains('logo-text')) {
            el.innerHTML = 'Abu<span class="accent">saleem</span>'.split('').map(c =>
                c === '<' ? el.innerHTML : `<span class="char">${c}</span>`
            ).join('');
            return;
        }

        const text = el.textContent;
        el.innerHTML = text.split('').map(c =>
            `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`
        ).join('');
        el.classList.add('ripple-text');
    });
});

function triggerTextRipple() {
    document.querySelectorAll('.ripple-text').forEach(el => {
        if (!Utils.isInViewport(el)) return;
        triggerCharRipple(el);
    });
}

function triggerCharRipple(element) {
    const chars = element.querySelectorAll('.char');
    chars.forEach((char, i) => {
        setTimeout(() => {
            char.classList.add('ripple-active');
            setTimeout(() => char.classList.remove('ripple-active'), 800);
        }, i * 25);
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        const wave = document.createElement('div');
        wave.className = 'section-ripple-wave';
        section.appendChild(wave);
    });

    document.querySelector('.footer')?.classList.add('footer-water-ripple');
});

// Add notification animation keyframes
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(notifStyle);
