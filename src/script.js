// Navbar background change on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-links a');

const toggleMenu = () => {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
};

if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
if (closeMenu) closeMenu.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
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

// Pets Carousel (existing)
const petCarouselTrack = document.querySelector('.pets-carousel .carousel-track');
const petPrev = document.querySelector('.pets-carousel .carousel-prev');
const petNext = document.querySelector('.pets-carousel .carousel-next');
if (petCarouselTrack && petPrev && petNext) {
    const petSlides = Array.from(petCarouselTrack.querySelectorAll('.carousel-slide'));
    let petIndex = 0;
    const updatePetCarousel = () => {
        petCarouselTrack.style.transform = 'translateX(-' + (petIndex * 100) + '%)';
    };
    petPrev.addEventListener('click', () => {
        petIndex = (petIndex - 1 + petSlides.length) % petSlides.length;
        updatePetCarousel();
    });
    petNext.addEventListener('click', () => {
        petIndex = (petIndex + 1) % petSlides.length;
        updatePetCarousel();
    });
    window.addEventListener('resize', updatePetCarousel);
}

console.log('Mendoza Arte en Hilo - Boutique Site Loaded');
