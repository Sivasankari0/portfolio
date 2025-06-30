// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Modal functions
function showContact() {
    document.getElementById('contactModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function showHireMe() {
    document.getElementById('hireMeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showResumeOptions() {
    document.getElementById('resumeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Enhanced modal close functionality
window.onclick = function(event) {
    const modals = ['contactModal', 'hireMeModal', 'resumeModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            closeModal(modalId);
        }
    });
}

// Resume functions with enhanced error handling
function viewResume() {
    const resumeUrl = './siva sankari resume.pdf';
    
    // Show loading notification
    showLoadingNotification('📄 Loading resume...');
    
    // Check if file exists before opening
    fetch(resumeUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const newWindow = window.open(resumeUrl, '_blank');
                
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    showNotification('❌ Please allow pop-ups to view the resume or try downloading instead', 'error');
                } else {
                    showNotification('📄 Resume opened successfully!', 'success');
                    closeModal('resumeModal');
                }
            } else {
                throw new Error('Resume file not found');
            }
        })
        .catch(error => {
            console.error('Resume loading error:', error);
            handleResumeError();
        });
}

function downloadResume() {
    const resumeUrl = './siva sankari resume.pdf';
    
    // Show loading notification
    showLoadingNotification('⬇️ Preparing download...');
    
    // Check if file exists before downloading
    fetch(resumeUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const link = document.createElement('a');
                link.href = resumeUrl;
                link.download = 'Siva_Sankari_Resume.pdf';
                link.target = '_blank';
                
                // Append to body, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification('⬇️ Resume download started successfully!', 'success');
                closeModal('resumeModal');
            } else {
                throw new Error('Resume file not found');
            }
        })
        .catch(error => {
            console.error('Resume download error:', error);
            handleResumeError();
        });
}

// Enhanced copy functions with better feedback
function copyEmail() {
    const email = 'sivasankarimasa@gmail.com';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function() {
            showNotification('✅ Email copied to clipboard!', 'success');
            closeModal('hireMeModal');
        }).catch(function(error) {
            console.error('Clipboard error:', error);
            fallbackCopy(email, 'email');
        });
    } else {
        fallbackCopy(email, 'email');
    }
}

function copyPhone() {
    const phone = '+91 9059800230';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(phone).then(function() {
            showNotification('✅ Phone number copied to clipboard!', 'success');
            closeModal('contactModal');
        }).catch(function(error) {
            console.error('Clipboard error:', error);
            fallbackCopy(phone, 'phone');
        });
    } else {
        fallbackCopy(phone, 'phone');
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text, type) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            const message = type === 'email' ? 'Email' : 'Phone number';
            showNotification(`✅ ${message} copied to clipboard!`, 'success');
            closeModal(type === 'email' ? 'hireMeModal' : 'contactModal');
        } else {
            throw new Error('Copy command failed');
        }
    } catch (error) {
        console.error('Fallback copy error:', error);
        const message = type === 'email' ? 'Email: sivasankarimasa@gmail.com' : 'Phone: +91 9059800230';
        showNotification(`❌ Copy failed. ${message}`, 'error');
    }
}

// Enhanced notification system with different types
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    let gradient;
    switch (type) {
        case 'success':
            gradient = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
            break;
        case 'error':
            gradient = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            break;
        case 'warning':
            gradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            break;
        default:
            gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${gradient};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 320px;
        word-wrap: break-word;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove notification
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

// Loading notification for async operations
function showLoadingNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div class="spinner"></div>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    `;
    
    // Add spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    if (!document.querySelector('.spinner-styles')) {
        style.classList.add('spinner-styles');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 2500);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
        });
    });
}

// Enhanced navigation scroll effect
function initializeNavScrollEffect() {
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            nav.style.background = 'rgba(15, 15, 35, 0.95)';
            nav.style.backdropFilter = 'blur(15px)';
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'blur(10px)';
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            nav.style.boxShadow = 'none';
        }
        
        nav.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        lastScrollTop = scrollTop;
    });
}

// Keyboard accessibility enhancements
function initializeKeyboardAccessibility() {
    document.addEventListener('keydown', function(e) {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            const openModals = ['contactModal', 'hireMeModal', 'resumeModal'];
            openModals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.style.display === 'block') {
                    closeModal(modalId);
                }
            });
        }
        
        // Toggle mobile menu with Enter/Space when focused
        if ((e.key === 'Enter' || e.key === ' ') && e.target === mobileMenuBtn) {
            e.preventDefault();
            navLinks.classList.toggle('active');
        }
    });
    
    // Trap focus in modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    });
}

// Enhanced interactive effects for decorative shapes
function initializeShapeEffects() {
    document.querySelectorAll('.decorative-shape').forEach((shape, index) => {
        shape.addEventListener('mouseenter', () => {
            const randomRotation = Math.random() * 20 - 10; // Random rotation between -10 and 10 degrees
            shape.style.transform = `scale(1.1) rotate(${randomRotation}deg)`;
            shape.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            shape.style.filter = 'brightness(1.2)';
        });
        
        shape.addEventListener('mouseleave', () => {
            shape.style.transform = 'scale(1) rotate(0deg)';
            shape.style.filter = 'brightness(1)';
        });
        
        // Add subtle floating animation
        shape.style.animation = `float 6s ease-in-out infinite ${index * 0.5}s`;
    });
}

// Logo hover effect enhancement
function initializeLogoEffects() {
    const logoContainer = document.querySelector('.logo-container');
    const logoShape = document.querySelector('.logo-shape');
    
    if (logoContainer && logoShape) {
        logoContainer.addEventListener('mouseenter', () => {
            logoShape.style.transform = 'translateY(-3px) rotateY(15deg) scale(1.05)';
            logoShape.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5)';
        });
        
        logoContainer.addEventListener('mouseleave', () => {
            logoShape.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            logoShape.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
        });
    }
}

// Error handling for resume operations
function handleResumeError() {
    showNotification('❌ Resume file not found. Please contact me directly at sivasankarimasa@gmail.com', 'error');
    closeModal('resumeModal');
}

// Initialize parallax effect for hero section
function initializeParallaxEffect() {
    const heroImage = document.querySelector('.hero-image');
    const decorativeShapes = document.querySelectorAll('.decorative-shape');
    
    if (window.innerWidth > 768) { // Only on desktop
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (heroImage) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
            
            decorativeShapes.forEach((shape, index) => {
                const shapeRate = scrolled * (-0.1 - index * 0.05);
                shape.style.transform = `translateY(${shapeRate}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }
}

// Performance optimization - throttle scroll events
function throttle(func, wait) {
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSmoothScrolling();
    initializeNavScrollEffect();
    initializeKeyboardAccessibility();
    initializeShapeEffects();
    initializeLogoEffects();
    initializeParallaxEffect();
    
    // Welcome message with delay
    setTimeout(() => {
        showNotification('🎉 Welcome to my portfolio! Explore my work and get in touch.', 'success');
    }, 1500);
    
    // Preload resume for better UX
    const resumeUrl = './siva sankari resume.pdf';
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resumeUrl;
    link.as = 'document';
    document.head.appendChild(link);
    
    // Add loading state management
    window.addEventListener('beforeunload', () => {
        document.body.style.opacity = '0.8';
    });
    
    // Enhanced mobile menu close on outside click
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
    
    // Add intersection observer for animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.hero-content, .hero-image').forEach(el => {
            observer.observe(el);
        });
    }
    
    console.log('🚀 Portfolio initialized successfully!');
});

// about page

// About Page JavaScript Functions

// Initialize about page animations and interactions
function initializeAboutPage() {
    // Animate info cards on scroll
    initializeCardAnimations();
    
    // Add interactive hover effects
    initializeCardInteractions();
    
    // Initialize typing animation for section title
    initializeTitleAnimation();
    
    // Add parallax effect to about section
    initializeAboutParallax();
    
    // Initialize counter animations
    initializeCounterAnimations();
    
    console.log('📄 About page initialized successfully!');
}

// Animate info cards when they come into view
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.info-card');
    
    if ('IntersectionObserver' in window) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.classList.add('animated');
                    }, index * 200);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        cards.forEach(card => {
            // Set initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            cardObserver.observe(card);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 200);
        });
    }
}

// Enhanced card interactions
function initializeCardInteractions() {
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
        const icon = card.querySelector('.info-icon');
        
        // Enhanced hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.25)';
            
            // Animate icon
            if (icon) {
                icon.style.transform = 'scale(1.2) rotateY(180deg)';
                icon.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }
            
            // Add glow effect
            card.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.25), 0 0 30px rgba(102, 126, 234, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            
            // Reset icon
            if (icon) {
                icon.style.transform = 'scale(1) rotateY(0deg)';
            }
        });
        
        // Click effect
        card.addEventListener('click', () => {
            card.style.transform = 'translateY(-10px) scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            }, 150);
            
            // Show card details notification
            const cardTitle = card.querySelector('h3').textContent;
            showNotification(`📋 ${cardTitle} details viewed!`, 'info');
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

// Create ripple effect for cards
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        z-index: 1000;
    `;
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Typing animation for section title
function initializeTitleAnimation() {
    const titleElement = document.querySelector('.section-title');
    if (!titleElement) return;
    
    const titleText = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.borderRight = '3px solid #667eea';
    
    let index = 0;
    const typingSpeed = 100;
    
    function typeWriter() {
        if (index < titleText.length) {
            titleElement.textContent += titleText.charAt(index);
            index++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                titleElement.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing animation when title comes into view
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeWriter, 500);
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    titleObserver.observe(titleElement);
}

// Parallax effect for about section
function initializeAboutParallax() {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Check if section is in viewport
        if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
            const progress = (scrolled - sectionTop + windowHeight) / (sectionHeight + windowHeight);
            
            // Apply parallax to cards
            const cards = aboutSection.querySelectorAll('.info-card');
            cards.forEach((card, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled - sectionTop) * speed;
                card.style.transform = `translateY(${yPos}px)`;
            });
        }
    }, 16));
}

// Counter animations for numerical values
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.info-card .year');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const numbers = text.match(/\d+/g);
        
        if (numbers) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumbers(entry.target, numbers);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counterObserver.observe(counter);
        }
    });
}

// Animate numerical values
function animateNumbers(element, numbers) {
    const originalText = element.textContent;
    let currentNumbers = numbers.map(() => 0);
    const targetNumbers = numbers.map(num => parseInt(num));
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        currentNumbers = targetNumbers.map(target => 
            Math.floor(target * easeProgress)
        );
        
        let newText = originalText;
        numbers.forEach((original, index) => {
            newText = newText.replace(original, currentNumbers[index]);
        });
        
        element.textContent = newText;
        
        if (step >= steps) {
            clearInterval(timer);
            element.textContent = originalText; // Ensure final accuracy
        }
    }, stepDuration);
}

// Add smooth scrolling to about section
function scrollToAbout() {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        aboutSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add floating animation to icons
function initializeIconAnimations() {
    const icons = document.querySelectorAll('.info-icon');
    
    icons.forEach((icon, index) => {
        // Add subtle floating animation
        icon.style.animation = `iconFloat 3s ease-in-out infinite ${index * 0.5}s`;
    });
    
    // Add CSS animation if not exists
    if (!document.querySelector('#icon-animations')) {
        const style = document.createElement('style');
        style.id = 'icon-animations';
        style.textContent = `
            @keyframes iconFloat {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                }
                25% {
                    transform: translateY(-5px) rotate(2deg);
                }
                50% {
                    transform: translateY(0px) rotate(0deg);
                }
                75% {
                    transform: translateY(-3px) rotate(-2deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced card click functionality
function handleCardClick(cardElement) {
    const cardType = cardElement.querySelector('h3').textContent.toLowerCase();
    
    switch(cardType) {
        case 'education':
            showEducationDetails();
            break;
        case 'intern':
            showInternDetails();
            break;
        case 'training':
            showTrainingDetails();
            break;
        default:
            showNotification('📋 Card details viewed!', 'info');
    }
}

// Show detailed information modals (you can expand these)
function showEducationDetails() {
    showNotification('🎓 B.Tech in Computer Science from Annamacharya Institute of Technology and Sciences (2020-2024) with CGPA: 8.37', 'info');
}

function showInternDetails() {
    showNotification('💼 Currently working as Software Development Intern at THworks Startup (Feb 2025 - Apr 2025)', 'info');
}

function showTrainingDetails() {
    showNotification('🚀 Completed Python Full Stack training from Besant Technologies, Bangalore (Jun 2024 - Dec 2024)', 'info');
}

// Initialize about page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize about page after a short delay to ensure all elements are rendered
    setTimeout(() => {
        initializeAboutPage();
        initializeIconAnimations();
    }, 500);
});

// Add to existing scroll event listener for about section highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add scroll listener for section highlighting
window.addEventListener('scroll', throttle(highlightActiveSection, 100));

// Export functions for use in main portfolio.js
window.aboutPageFunctions = {
    initializeAboutPage,
    scrollToAbout,
    handleCardClick,
    showEducationDetails,
    showInternDetails,
    showTrainingDetails
};

// social media

 function initializeSocialLinks() {
            const socialLinks = document.querySelectorAll('.social-link');
            
            socialLinks.forEach(link => {
                // Add click tracking
                link.addEventListener('click', function(e) {
                    const platform = this.classList.contains('linkedin') ? 'LinkedIn' : 'GitHub';
                    
                    // Show notification
                    showNotification(`🔗 Opening ${platform} profile...`, 'info');
                    
                    // Add ripple effect
                    createSocialRipple(e, this);
                });
                
                // Enhanced hover effects
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.15) rotate(5deg)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                });
            });
        }
        
        // Create ripple effect for social links
        function createSocialRipple(event, element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: socialRipple 0.6s ease-out;
                z-index: 1000;
            `;
            
            // Add ripple animation
            if (!document.querySelector('#social-ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'social-ripple-styles';
                style.textContent = `
                    @keyframes socialRipple {
                        0% {
                            transform: scale(0);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        }
        
        // Copy social links functionality
        function copySocialLink(platform) {
            let url = '';
            if (platform === 'linkedin') {
                url = 'https://linkedin.com/in/your-linkedin-username';
            } else if (platform === 'github') {
                url = 'https://github.com/your-github-username';
            }
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url).then(function() {
                    showNotification(`✅ ${platform} link copied to clipboard!`, 'success');
                }).catch(function(error) {
                    console.error('Clipboard error:', error);
                    fallbackCopy(url, platform);
                });
            } else {
                fallbackCopy(url, platform);
            }
        }
        
        // Add to your existing DOMContentLoaded event listener
        document.addEventListener('DOMContentLoaded', function() {
            // ... your existing code ...
            
            // Initialize social links
            setTimeout(() => {
                initializeSocialLinks();
            }, 1000);
        });

//project page

 // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializeProjects();
        });

        function initializeProjects() {
            setupScrollAnimations();
            setupProjectCards();
            setupProjectModals();
            setupTechTags();
        }

        // Scroll animations for project cards
        function setupScrollAnimations() {
            const projectCards = document.querySelectorAll('.project-card');
            
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 200);
                    }
                });
            }, observerOptions);
            
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }

        // Enhanced project card interactions
        function setupProjectCards() {
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
                
                card.addEventListener('click', (e) => {
                    createRippleEffect(e, card);
                });
            });
        }

        // Create ripple effect on card click
        function createRippleEffect(e, element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // Setup project demo modals
        function setupProjectModals() {
            const modal = document.getElementById('projectModal');
            const closeBtn = document.querySelector('.modal-close');
            
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        }

        // Show project demo modal
        function showProjectDemo(projectType) {
            const modal = document.getElementById('projectModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            const projectData = getProjectData(projectType);
            
            modalTitle.textContent = projectData.title;
            modalContent.innerHTML = projectData.content;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Close modal
        function closeModal() {
            const modal = document.getElementById('projectModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Get project demo data
        function getProjectData(projectType) {
            const projects = {
                hotel: {
                    title: 'Hotel Management System Demo',
                    content: `
                        <div class="demo-screenshot">
                            🏨 Hotel Management Interface Preview
                        </div>
                        <div class="demo-feature">
                            <h4>🏠 Room Booking System</h4>
                            <p>Automated room reservation with real-time availability, pricing calculations, and booking confirmations.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>👥 Customer Database</h4>
                            <p>Complete customer information management with booking history and contact details.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>💰 Billing & Payments</h4>
                            <p>Integrated billing system with invoice generation, payment tracking, and financial reports.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>📊 Admin Dashboard</h4>
                            <p>Comprehensive dashboard with occupancy statistics, revenue tracking, and operational insights.</p>
                        </div>
                        <p><strong>Technologies:</strong> Python, Tkinter GUI, MySQL Database</p>
                    `
                },
                matrix: {
                    title: 'Matrix Calculator Demo',
                    content: `
                        <div class="demo-screenshot">
                            🧮 Advanced Matrix Calculator Interface
                        </div>
                        <div class="demo-feature">
                            <h4>➕ Basic Operations</h4>
                            <p>Matrix addition, subtraction, and scalar multiplication with step-by-step solutions.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>✖️ Advanced Functions</h4>
                            <p>Matrix multiplication, determinant calculation, and inverse matrix computation.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>📐 Mathematical Tools</h4>
                            <p>Eigenvalue calculation, matrix rank determination, and system solving capabilities.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>📱 User Interface</h4>
                            <p>Intuitive GUI with error handling, result visualization, and calculation history.</p>
                        </div>
                        <p><strong>Technologies:</strong> Python, Tkinter, NumPy Mathematical Library</p>
                    `
                },
                barber: {
                    title: 'Barber Shop Website Demo',
                    content: `
                        <div class="demo-screenshot">
                            ✂️ Modern Barber Shop Website
                        </div>
                        <div class="demo-feature">
                            <h4>🎨 Modern Design</h4>
                            <p>Responsive, mobile-first design with smooth animations and contemporary styling.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>📅 Appointment System</h4>
                            <p>Online booking system with calendar integration and automated email confirmations.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>🖼️ Portfolio Gallery</h4>
                            <p>Professional showcase of services with high-quality image galleries and testimonials.</p>
                        </div>
                        <div class="demo-feature">
                            <h4>📱 Cross-Platform</h4>
                            <p>Fully responsive across all devices with optimized performance and fast loading times.</p>
                        </div>
                        <p><strong>Technologies:</strong> HTML5, CSS3, JavaScript, Responsive Web Design</p>
                    `
                }
            };
            
            return projects[projectType] || {
                title: 'Project Demo',
                content: '<p>Demo content not available.</p>'
            };
        }

        // Setup tech tag interactions
        function setupTechTags() {
            const techTags = document.querySelectorAll('.tech-tag');
            
            techTags.forEach(tag => {
                tag.addEventListener('mouseenter', () => {
                    tag.style.animation = 'pulse 1s infinite';
                });
                
                tag.addEventListener('mouseleave', () => {
                    tag.style.animation = '';
                });
                
                tag.addEventListener('click', () => {
                    const clone = tag.cloneNode(true);
                    clone.style.position = 'fixed';
                    clone.style.zIndex = '9999';
                    clone.style.pointerEvents = 'none';
                    
                    const rect = tag.getBoundingClientRect();
                    clone.style.left = rect.left + 'px';
                    clone.style.top = rect.top + 'px';
                    
                    document.body.appendChild(clone);
                    
                    clone.animate([
                        { transform: 'translateY(0) scale(1)', opacity: 1 },
                        { transform: 'translateY(-50px) scale(1.2)', opacity: 0 }
                    ], {
                        duration: 800,
                        easing: 'ease-out'
                    }).onfinish = () => {
                        clone.remove();
                    };
                });
            });
        }

        // Modal functionality JavaScript

// Function to show resume options
function showResumeOptions() {
    document.getElementById('resumeModal').style.display = 'block';
}

// Function to show contact modal
function showContact() {
    document.getElementById('contactModal').style.display = 'block';
}

// Function to show hire me modal
function showHireMe() {
    document.getElementById('hireMeModal').style.display = 'block';
}

// Universal close modal function
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modals = ['resumeModal', 'contactModal', 'hireMeModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = ['resumeModal', 'contactModal', 'hireMeModal'];
        modals.forEach(modalId => {
            document.getElementById(modalId).style.display = 'none';
        });
    }
});

// Resume functions
function viewResume() {
    // Add your resume viewing logic here
    alert('Opening resume viewer...');
    // You can replace this with actual resume viewing functionality
}

function downloadResume() {
    // Add your resume download logic here
    alert('Downloading resume...');
    // You can replace this with actual download functionality
}

// Copy phone number function
function copyPhone() {
    const phoneNumber = '+91 9059800230';
    navigator.clipboard.writeText(phoneNumber).then(function() {
        alert('Phone number copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = phoneNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Phone number copied to clipboard!');
    });
}

// Copy email function
function copyEmail() {
    const email = 'sivasankarimasa@gmail.com';
    navigator.clipboard.writeText(email).then(function() {
        alert('Email address copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Email address copied to clipboard!');
    });
}