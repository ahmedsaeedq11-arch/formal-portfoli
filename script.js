/**
 * Ahmed Saeed's Formal Portfolio
 * Vanilla JavaScript - No jQuery, No Inline Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    scrollOffset: 80,
    parallaxSpeed: 0.5,
    revealThreshold: 0.15,
    revealDelay: 100,
    navBreakpoint: 768
  };

  // ============================================
  // Smooth Scroll
  // ============================================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
          window.scrollTo({
            top,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ============================================
  // Navigation - Active State on Scroll
  // ============================================
  const initNavState = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const updateActiveNav = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - CONFIG.scrollOffset - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });

      // Handle bottom of page
      if (scrollY + windowHeight >= docHeight - 100) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${lastSection.getAttribute('id')}`) {
              link.classList.add('active');
            }
          });
        }
      }
    };

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateActiveNav();
  };

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const initMobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav, .navbar');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  };

  // ============================================
  // Section Reveal on Scroll (IntersectionObserver)
  // ============================================
  const initRevealAnimations = () => {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-up, .fade-in, .slide-up'
    );

    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: CONFIG.revealThreshold
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add delay for staggered animations
          const delay = entry.target.dataset.delay || CONFIG.revealDelay * 
            Array.from(entry.target.parentNode.children).filter(el => 
              el.classList.contains('reveal') || 
              el.classList.contains('reveal-left') ||
              el.classList.contains('reveal-right') ||
              el.classList.contains('reveal-up')
            ).indexOf(entry.target);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  };

  // ============================================
  // Hero Parallax Effect
  // ============================================
  const initParallax = () => {
    const hero = document.querySelector('.hero, .hero-section, header');
    const heroBg = document.querySelector('.hero-bg, .hero-background, .hero img');

    if (!hero || !heroBg) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.pageYOffset;
      const heroTop = hero.offsetTop;
      const heroHeight = hero.offsetHeight;

      // Only apply parallax when hero is in view
      if (scrollY <= heroTop + heroHeight && scrollY + window.innerHeight >= heroTop) {
        const relativeScroll = scrollY - heroTop;
        const translateY = relativeScroll * CONFIG.parallaxSpeed;
        heroBg.style.transform = `translateY(${translateY}px)`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  };

  // ============================================
  // Project Card Hover Effects
  // ============================================
  const initProjectCardHovers = () => {
    const projectCards = document.querySelectorAll('.project-card, .project-item, .work-item');

    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });

      // Add 3D tilt effect on mousemove
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  // ============================================
  // Project Card Image Overlay Effect
  // ============================================
  const initProjectOverlay = () => {
    const projectImages = document.querySelectorAll('.project-card img, .project-item img');

    projectImages.forEach(img => {
      const overlay = document.createElement('div');
      overlay.className = 'project-overlay';
      
      const parent = img.parentNode;
      if (!parent.classList.contains('project-card') && !parent.classList.contains('project-item')) {
        parent.style.position = 'relative';
        parent.appendChild(overlay);
      }
    });
  };

  // ============================================
  // Scroll Progress Indicator
  // ============================================
  const initScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress, .progress-bar');

    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });
  };

  // ============================================
  // Back to Top Button
  // ============================================
  const initBackToTop = () => {
    const backToTop = document.querySelector('.back-to-top, .scroll-top');

    if (!backToTop) return;

    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // ============================================
  // Cursor Effect for Links
  // ============================================
  const initCursorEffect = () => {
    const cursor = document.querySelector('.cursor');
    const links = document.querySelectorAll('a, button, .project-card');

    if (!cursor || links.length === 0) return;

    links.forEach(link => {
      link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  };

  // ============================================
  // Text Reveal Animation
  // ============================================
  const initTextReveal = () => {
    const textElements = document.querySelectorAll('.text-reveal, .split-text');

    textElements.forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';
      el.setAttribute('aria-label', text);

      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${i * 50}ms`;
        el.appendChild(span);
      });
    });
  };

  // ============================================
  // Navbar Hide/Show on Scroll
  // ============================================
  const initNavHideOnScroll = () => {
    const navbar = document.querySelector('.navbar, .nav, header');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        navbar.classList.remove('hidden');
        return;
      }

      if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }

      lastScroll = currentScroll;
    });
  };

  // ============================================
  // Initialize All Features
  // ============================================
  const init = () => {
    initSmoothScroll();
    initNavState();
    initMobileNav();
    initRevealAnimations();
    initParallax();
    initProjectCardHovers();
    initProjectOverlay();
    initScrollProgress();
    initBackToTop();
    initCursorEffect();
    initTextReveal();
    initNavHideOnScroll();
  };

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});
