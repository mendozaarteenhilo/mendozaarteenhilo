// Navbar background change on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// CAROUSEL SYSTEM - PRODUCT CARDS
// ============================================
class ProductCarousel {
    constructor(card) {
        this.card = card;
        this.track = card.querySelector('.carousel-track-home');
        this.slides = card.querySelectorAll('.carousel-slide-home');
        this.indicators = card.querySelectorAll('.indicator');
        this.prevBtn = card.querySelector('.carousel-btn.prev');
        this.nextBtn = card.querySelector('.carousel-btn.next');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.autoplayInterval = null;
        
        if (this.track && this.slides.length > 1) {
            this.init();
        }
    }
    
    init() {
        this.attachEventListeners();
        this.startAutoplay();
    }
    
    attachEventListeners() {
        // Button navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch events for mobile
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
        
        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause autoplay on hover/focus
        this.card.addEventListener('mouseenter', () => this.stopAutoplay());
        this.card.addEventListener('mouseleave', () => this.startAutoplay());
        this.card.addEventListener('focusin', () => this.stopAutoplay());
        this.card.addEventListener('focusout', () => this.startAutoplay());
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchEndX = this.touchStartX;
        this.stopAutoplay();
    }
    
    handleTouchMove(e) {
        if (e.changedTouches && e.changedTouches.length) {
            this.touchEndX = e.changedTouches[0].screenX;
        }
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.startAutoplay();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    updateCarousel() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const offset = -this.currentIndex * 100;
        this.track.style.transform = 'translateX(' + offset + '%)';
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Re-enable transitions after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    startAutoplay() {
        // Auto-advance every 4 seconds only on larger screens
        if (window.innerWidth >= 768 && !this.autoplayInterval) {
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, 4000);
        }
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize all product carousels
document.querySelectorAll('.product-card').forEach(card => {
    new ProductCarousel(card);
});

// Botón "+" flotante sobre la imagen: reemplaza a "Comprar" en la vista
// compacta móvil (mismo enlace de WhatsApp, solo cambia la presentación)
document.querySelectorAll('.product-card').forEach(card => {
    const buyLink = card.querySelector('.card-info .btn');
    const wrapper = card.querySelector('.card-carousel-wrapper');
    if (!buyLink || !wrapper) return;

    const title = card.querySelector('h3');
    const quickBuy = document.createElement('a');
    quickBuy.href = buyLink.href;
    quickBuy.className = 'quick-buy';
    quickBuy.setAttribute('aria-label', 'Comprar' + (title ? ' ' + title.textContent : ''));
    quickBuy.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
    wrapper.appendChild(quickBuy);
});

// ============================================
// LIGHTBOX - Expandir imágenes del carrusel de productos
// ============================================
(() => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let images = [];
    let index = 0;
    let lastFocused = null;

    const render = () => {
        const img = images[index];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightboxCounter.textContent = (index + 1) + ' / ' + images.length;
        const showNav = images.length > 1;
        prevBtn.style.display = showNav ? 'flex' : 'none';
        nextBtn.style.display = showNav ? 'flex' : 'none';
    };

    const open = (imgList, startIndex, triggerEl) => {
        images = imgList;
        index = startIndex;
        lastFocused = triggerEl || document.activeElement;
        render();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    };

    const close = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    const showNext = () => {
        index = (index + 1) % images.length;
        render();
    };

    const showPrev = () => {
        index = (index - 1 + images.length) % images.length;
        render();
    };

    // Icono de "ampliar" sobre cada carrusel de tarjeta de producto
    document.querySelectorAll('.product-card .card-carousel-wrapper').forEach(wrapper => {
        const hint = document.createElement('div');
        hint.className = 'zoom-hint';
        hint.setAttribute('aria-hidden', 'true');
        hint.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>';
        wrapper.appendChild(hint);
    });

    document.querySelectorAll('.product-card .carousel-slide-home img').forEach(img => {
        img.addEventListener('click', () => {
            const card = img.closest('.product-card');
            const imgList = Array.from(card.querySelectorAll('.carousel-slide-home img'));
            open(imgList, imgList.indexOf(img), img);
        });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50 && images.length > 1) {
            diff > 0 ? showNext() : showPrev();
        }
    }, { passive: true });
})();

// Pets Carousel (existing)
const initSlidingCarousel = (carouselSelector, prevSelector, nextSelector) => {
    document.querySelectorAll(carouselSelector).forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prev = carousel.querySelector(prevSelector);
        const next = carousel.querySelector(nextSelector);
        if (!track || !prev || !next) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        let index = 0;
        const update = () => {
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
        };

        prev.addEventListener('click', () => {
            index = (index - 1 + slides.length) % slides.length;
            update();
        });

        next.addEventListener('click', () => {
            index = (index + 1) % slides.length;
            update();
        });

        window.addEventListener('resize', update);
    });
};

initSlidingCarousel('.pets-carousel', '.carousel-prev', '.carousel-next');
initSlidingCarousel('.beach-carousel', '.carousel-prev', '.carousel-next');

// ============================================
// QUICK TABS (barra de accesos rápidos - móvil)
// ============================================
const quickTabs = document.getElementById('quick-tabs');

if (quickTabs) {
    const tabLinks = Array.from(quickTabs.querySelectorAll('.quick-tab'));
    const tabsTrack = quickTabs.querySelector('.quick-tabs-track');

    // Posiciona la barra justo debajo del navbar real (su alto cambia al hacer scroll)
    const positionQuickTabs = () => {
        if (window.innerWidth <= 768 && navbar) {
            quickTabs.style.top = navbar.offsetHeight + 'px';
        }
    };
    positionQuickTabs();
    window.addEventListener('scroll', positionQuickTabs, { passive: true });
    window.addEventListener('resize', positionQuickTabs);

    // Resalta la pestaña de la sección visible y la centra en el scroll horizontal
    const targetSections = tabLinks
        .map(link => document.getElementById(link.dataset.target))
        .filter(Boolean);

    const setActiveTab = (id) => {
        tabLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.target === id);
        });
        const activeLink = tabLinks.find(link => link.dataset.target === id);
        if (activeLink && tabsTrack) {
            const trackRect = tabsTrack.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            if (linkRect.left < trackRect.left || linkRect.right > trackRect.right) {
                activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveTab(entry.target.id);
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    targetSections.forEach(section => sectionObserver.observe(section));
}

console.log('Mendoza Arte en Hilo - Boutique Site Loaded');
