/* ========================================
   SAMEH SOBHY PORTFOLIO — MAIN JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Preloader --- */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 600);
    }
  });

  /* --- GSAP & ScrollTrigger Registration --- */
  gsap.registerPlugin(ScrollTrigger);

  /* ========== NAVIGATION ========== */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile menu
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Smooth scroll + close mobile menu
  navAnchors.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observerNav.observe(s));

  /* ========== HERO ANIMATIONS ========== */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge', { opacity: 0, y: 20, duration: 0.7, delay: 0.8 })
    .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
    .from('.hero-buttons', { opacity: 0, y: 25, duration: 0.6 }, '-=0.3');

  // Floating grid parallax
  const floatingGrid = document.querySelector('.hero-floating-grid');
  if (floatingGrid) {
    gsap.to(floatingGrid, {
      y: -80,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }

  /* ========== STATS COUNTER ========== */
  const counters = document.querySelectorAll('.stat-number');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => statsObserver.observe(c));

  /* ========== SCROLL REVEAL ANIMATIONS ========== */
  const revealElements = document.querySelectorAll('.animate-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // GSAP section reveals
  gsap.utils.toArray('.section-label, .section-title').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.7,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  /* ========== PORTFOLIO FILTERING ========== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Animate out, then in
      const tl = gsap.timeline();
      
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (!match) {
          tl.to(card, { opacity: 0, scale: 0.85, duration: 0.25 }, 0);
        }
      });

      tl.call(() => {
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.classList.remove('hidden');
            gsap.fromTo(card,
              { opacity: 0, scale: 0.9, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            card.classList.add('hidden');
          }
        });
      }, null, null, 0.3);
    });
  });

  // Staggered entrance for portfolio cards
  gsap.from('.portfolio-card', {
    opacity: 0, y: 40, scale: 0.95, duration: 0.6,
    stagger: 0.08, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.portfolio-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  /* ========== SWIPER SLIDER ========== */
  new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: { slidesPerView: 1.5, spaceBetween: 20 },
      900: { slidesPerView: 2.2, spaceBetween: 24 },
      1200: { slidesPerView: 3, spaceBetween: 28 },
    },
    effect: 'slide',
    speed: 600,
  });

  /* ========== LIGHTBOX ========== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ========== LAZY LOADING ========== */
  const lazyImages = document.querySelectorAll('img[data-src]');
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        lazyObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImages.forEach(img => lazyObserver.observe(img));

});
