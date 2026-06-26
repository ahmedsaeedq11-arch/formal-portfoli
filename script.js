/**
 * Ahmed Saeed's Formal Portfolio
 * MINIMAL Animations - Vanilla JavaScript, No jQuery
 * Clean redesign: smooth scroll, nav active state, skill bars, form validation, subtle grid
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    scrollOffset: 80,
    skillBarThreshold: 0.3,
    navBreakpoint: 768
  };

  // ============================================
  // 1. SMOOTH SCROLL
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
  // 2. NAVIGATION ACTIVE STATE
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
        requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateActiveNav();
  };

  // ============================================
  // 3. SKILL BARS ANIMATE ON SCROLL
  // ============================================
  const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-hr-fill');

    if (skillBars.length === 0) return;

    // Set initial state - bars at 0 width
    skillBars.forEach(bar => {
      bar.style.width = '0%';
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: CONFIG.skillBarThreshold
    };

    const animateSkillBar = (fill) => {
      if (fill.classList.contains('animated')) return;

      const targetProgress = fill.getAttribute('data-progress');
      if (!targetProgress) return;

      fill.classList.add('animated');

      // Small delay before starting animation
      setTimeout(() => {
        fill.style.width = targetProgress + '%';
      }, 100);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    skillBars.forEach(bar => observer.observe(bar));
  };

  // ============================================
  // 4. MOBILE MENU TOGGLE
  // ============================================
  const initMobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav, .navbar');
    const navMenu = document.querySelector('.nav-menu');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.classList.toggle('active');

      // Animate hamburger to X
      const hamburger = toggle.querySelector('.hamburger');
      if (hamburger) {
        hamburger.classList.toggle('active');
      }
    });

    // Close mobile nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.classList.remove('active');
        const hamburger = toggle.querySelector('.hamburger');
        if (hamburger) {
          hamburger.classList.remove('active');
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('active');
        toggle.classList.remove('active');
        const hamburger = toggle.querySelector('.hamburger');
        if (hamburger) {
          hamburger.classList.remove('active');
        }
      }
    });
  };

  // ============================================
  // 5. CONTACT FORM VALIDATION
  // ============================================
  const initFormValidation = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const validateField = (input) => {
      let isValid = true;
      const value = input.value.trim();

      // Required check
      if (input.hasAttribute('required') && !value) {
        isValid = false;
      }

      // Email validation
      if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
      }

      // Name validation - minimum 2 characters
      if (input.id === 'name' && value.length > 0 && value.length < 2) {
        isValid = false;
      }

      // Message validation - minimum 10 characters
      if (input.id === 'message' && value.length > 0 && value.length < 10) {
        isValid = false;
      }

      // Update input styling
      if (isValid) {
        input.classList.remove('error');
        input.classList.add('valid');
      } else {
        input.classList.remove('valid');
        input.classList.add('error');
      }

      return isValid;
    };

    // Real-time validation on blur
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      // Clear error on input
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      form.querySelectorAll('.form-input').forEach(input => {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Success feedback
        const submitBtn = form.querySelector('.btn-submit');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span>Message Sent!</span>';
          submitBtn.classList.add('success');

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('success');
            form.reset();
            form.querySelectorAll('.form-input').forEach(input => {
              input.classList.remove('valid');
            });
          }, 3000);
        }
      } else {
        // Focus first invalid field
        const firstError = form.querySelector('.form-input.error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  };

  // ============================================
  // 6. SUBTLE GRID BACKGROUND ANIMATION
  // ============================================
  const initGridAnimation = () => {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Grid configuration
    const gridConfig = {
      spacing: 60,
      lineColor: 'rgba(149, 102, 240, 0.08)',
      lineWidth: 1,
      animateSpeed: 0.02
    };

    let offset = 0;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridConfig.spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = gridConfig.lineColor;
        ctx.lineWidth = gridConfig.lineWidth;
        ctx.stroke();
      }

      // Horizontal lines with subtle animation
      for (let y = 0; y <= canvas.height; y += gridConfig.spacing) {
        const animatedY = y + (offset % gridConfig.spacing);
        ctx.beginPath();
        ctx.moveTo(0, animatedY);
        ctx.lineTo(canvas.width, animatedY);
        ctx.strokeStyle = gridConfig.lineColor;
        ctx.lineWidth = gridConfig.lineWidth;
        ctx.stroke();
      }

      offset += gridConfig.animateSpeed;
      animationId = requestAnimationFrame(drawGrid);
    };

    resizeCanvas();
    drawGrid();

    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  };

  // ============================================
  // INITIALIZE ALL
  // ============================================
  initSmoothScroll();
  initNavState();
  initSkillBars();
  initMobileNav();
  initFormValidation();
  initGridAnimation();
});