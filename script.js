/**
 * Ahmed Saeed's Formal Portfolio
 * PREMIUM Animations Package
 * Vanilla JavaScript - No jQuery, No Inline Scripts
 * Uses IntersectionObserver & requestAnimationFrame
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
    navBreakpoint: 768,
    scrambleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    particleCount: 30,
    particleColor: 'rgba(149, 102, 240, 0.6)', // #9566f0 neon purple
    magneticStrength: 0.3
  };

  // ============================================
  // 1. TEXT SCRAMBLE EFFECT ON HERO NAME
  // ============================================
  const initTextScramble = () => {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    const originalText = heroName.textContent;
    const scrambleDuration = 1500;
    const frameDuration = 30;
    const totalFrames = scrambleDuration / frameDuration;
    let frame = 0;

    const animateScramble = () => {
      if (frame < totalFrames) {
        const progress = frame / totalFrames;
        // Easing: faster settling at the end
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        heroName.textContent = originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index / originalText.length < easedProgress) {
              return originalText[index];
            }
            return CONFIG.scrambleChars[Math.floor(Math.random() * CONFIG.scrambleChars.length)];
          })
          .join('');
        
        frame++;
        requestAnimationFrame(() => setTimeout(animateScramble, frameDuration));
      } else {
        heroName.textContent = originalText;
      }
    };

    // Start scramble after a short delay
    setTimeout(animateScramble, 500);
  };

  // ============================================
  // 2. FLOATING PARTICLES IN HERO
  // ============================================
  const initParticles = () => {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() * 30 + 260; // Purple range
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticleSystem = () => {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(149, 102, 240, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animateWithConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      drawConnections();
      animationId = requestAnimationFrame(animateWithConnections);
    };

    initParticleSystem();
    animateWithConnections();

    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  };

  // ============================================
  // 3. MAGNETIC BUTTON HOVER
  // ============================================
  const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.btn, .nav-link, .social-link, .project-card');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * CONFIG.magneticStrength;
        const moveY = y * CONFIG.magneticStrength;

        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        button.style.transition = 'transform 0.1s ease-out';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        button.style.transition = 'transform 0.3s ease-out';
      });
    });
  };

  // ============================================
  // 4. SMOOTH SECTION REVEALS (FADE + SLIDE)
  // ============================================
  const initRevealAnimations = () => {
    // Create reveal elements for all major sections
    const sections = document.querySelectorAll('.about, .projects, .skills, .certificates, .contact');
    
    sections.forEach(section => {
      section.classList.add('reveal-section');
      
      // Add reveal-child class to direct children
      const children = section.querySelectorAll('.section-header, .about-grid, .projects-grid, .skills-grid, .certificates-grid, .contact-grid, .about-image, .about-content');
      children.forEach((child, index) => {
        child.classList.add('reveal-child');
        child.style.setProperty('--reveal-delay', `${index * 100}ms`);
      });
    });

    const revealElements = document.querySelectorAll('.reveal-child, .section-header, .project-card, .skill-category, .certificate-card');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: CONFIG.revealThreshold
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = entry.target.style.getPropertyValue('--reveal-delay') || 
            (CONFIG.revealDelay * index);
          
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay));

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  };

  // ============================================
  // 5. TYPING EFFECT ON HERO SUBTITLE
  // ============================================
  const initTypingEffect = () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid #9566f0';
    
    let charIndex = 0;
    const typeSpeed = 80;
    const startDelay = 2000; // Start after text scramble finishes

    const typeChar = () => {
      if (charIndex < originalText.length) {
        subtitle.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, typeSpeed);
      } else {
        // Blink cursor then hide it
        setTimeout(() => {
          subtitle.style.borderRight = 'none';
        }, 1500);
      }
    };

    setTimeout(typeChar, startDelay);
  };

  // ============================================
  // 6. IMAGE PARALLAX ON SCROLL
  // ============================================
  const initImageParallax = () => {
    const images = document.querySelectorAll('.hero-bg, .about-image img, .project-card img');
    
    if (images.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.pageYOffset;

      images.forEach(img => {
        const parent = img.closest('section') || img.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;

        if (inView) {
          const speed = img.classList.contains('hero-bg') ? CONFIG.parallaxSpeed : 0.05;
          const yPos = (scrollY - parent.offsetTop) * speed;
          img.style.transform = `translateY(${yPos}px) scale(1.02)`;
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  };

  // ============================================
  // 7. SKILL BARS ANIMATE ON SCROLL (HR-Style)
  // ============================================
  const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-hr-fill');
    
    if (skillBars.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
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
  // 8. NAVIGATION ACTIVE STATE
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
  // 9. MOBILE MENU TOGGLE
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
  // SMOOTH SCROLL
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
  // SCROLL PROGRESS INDICATOR
  // ============================================
  const initScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress, .progress-bar');

    if (!progressBar) {
      // Create one if it doesn't exist
      const bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #9566f0, #f4c842);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s linear;
      `;
      document.body.appendChild(bar);
    }

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      const existingBar = document.querySelector('.scroll-progress');
      if (existingBar) {
        existingBar.style.width = `${progress}%`;
      }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });
  };

  // ============================================
  // CURSOR GLOW EFFECT
  // ============================================
  const initCursorGlow = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(149, 102, 240, 0.15) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);

    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    const animateCursor = () => {
      cursorX += (targetX - cursorX) * 0.1;
      cursorY += (targetY - cursorY) * 0.1;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  };

  // ============================================
  // PROJECT CARD 3D TILT
  // ============================================
  const initProjectTilt = () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX * 0.1}deg) rotateY(${rotateY * 0.1}deg) scale(1.01)`;
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease-out';
      });
    });
  };

  // ============================================
  // NAVBAR HIDE/SHOW ON SCROLL
  // ============================================
  const initNavHideOnScroll = () => {
    const navbar = document.querySelector('.navbar');
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
  // COUNTER ANIMATION
  // ============================================
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (counters.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const animateCounter = (counter) => {
      if (counter.classList.contains('counted')) return;
      
      const target = parseInt(counter.getAttribute('data-counter'));
      const duration = 2000;
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * eased);
        
        counter.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
          counter.classList.add('counted');
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  };

  // ============================================
  // INITIALIZE ALL FEATURES
  // ============================================
  const init = () => {
    initSmoothScroll();
    initNavState();
    initMobileNav();
    initRevealAnimations();
    initTextScramble();
    initTypingEffect();
    initParticles();
    initMagneticButtons();
    initImageParallax();
    initSkillBars();
    initScrollProgress();
    initCursorGlow();
    initProjectTilt();
    initNavHideOnScroll();
    initCounters();
  };

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});