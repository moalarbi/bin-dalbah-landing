/**
 * بن دلباح للسيارات - JavaScript
 * Lightweight, accessible interactions
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Menu
    // ============================================
    const menuToggle = document.getElementById('menu-toggle');
    const headerNav = document.getElementById('header-nav');
    const header = document.getElementById('header');

    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        headerNav.classList.toggle('is-open');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }

    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        headerNav.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking on nav links
        const navLinks = headerNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && headerNav.classList.contains('is-open')) {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (headerNav.classList.contains('is-open') && 
                !headerNav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ============================================
    // FAQ Accordion with Animation
    // ============================================
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');

        if (question && answer) {
            // Initialize: ensure all answers are closed
            question.setAttribute('aria-expanded', 'false');
            
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other items (accordion behavior)
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq__question');
                    if (otherQuestion !== question) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                question.setAttribute('aria-expanded', !isExpanded);
            });

            // Keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });

    // ============================================
    // Header Scroll Effect
    // ============================================
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // Intersection Observer for Reveal Animations
    // ============================================
    const revealElements = document.querySelectorAll('.card, .process__step, .faq__item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ============================================
    // CTA Tracking (dataLayer)
    // ============================================
    const ctaIds = [
        'cta_whatsapp_header',
        'cta_whatsapp_hero',
        'cta_whatsapp_sticky',
        'cta_whatsapp_contact',
        'cta_whatsapp_contact_main',
        'cta_whatsapp_footer',
        'cta_call_hero',
        'cta_call_sticky',
        'cta_call_contact',
        'cta_call_contact_main',
        'cta_call_footer'
    ];

    ctaIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (e) => {
                // Push to dataLayer if available
                if (window.dataLayer) {
                    const isWhatsApp = id.includes('whatsapp');
                    const location = id.replace('cta_whatsapp_', '').replace('cta_call_', '');
                    
                    window.dataLayer.push({
                        event: 'cta_click',
                        cta_type: isWhatsApp ? 'whatsapp' : 'call',
                        cta_location: location,
                        cta_id: id
                    });
                }
            });
        }
    });

    // ============================================
    // Smooth Scroll for Anchor Links (fallback)
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // Active Nav Link on Scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('is-active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('is-active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ============================================
    // Utility: Debounce
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // Form Validation (if forms are added later)
    // ============================================
    function validatePhone(phone) {
        const saudiPhoneRegex = /^(05|5)([0-9]{8})$/;
        return saudiPhoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Expose utilities globally
    window.BinDalbah = {
        validatePhone,
        debounce,
        closeMenu,
        toggleMenu
    };

})();
