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

const petCarouselTrack = document.querySelector('.pets-carousel .carousel-track');
const petPrev = document.querySelector('.pets-carousel .carousel-prev');
const petNext = document.querySelector('.pets-carousel .carousel-next');
if (petCarouselTrack && petPrev && petNext) {
    const petSlides = Array.from(petCarouselTrack.querySelectorAll('.carousel-slide'));
    let petIndex = 0;
    const updatePetCarousel = () => {
        petCarouselTrack.style.transform = `translateX(-${petIndex * 100}%)`;
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
