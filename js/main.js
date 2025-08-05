console.log('main.js is loading...'); // Test if script loads

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired'); // Test if DOM is ready
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    console.log('Found nav links:', navLinks.length); // Debug log
    
    // Log each link for debugging
    navLinks.forEach((link, index) => {
        console.log(`Link ${index}:`, link.href, link.textContent);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Link clicked:', this.href); // Debug log
            e.preventDefault();
            const targetId = this.getAttribute('href');
            console.log('Clicked link:', targetId); // Debug log
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                console.log('Target section found:', targetSection); // Debug log
                if (targetSection) {
                    console.log('Scrolling to:', targetId); // Debug log
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    console.log('Target section not found for:', targetId); // Debug log
                }
            }
            
        });
    });
    
    // Smooth scrolling for footer navigation links
    const footerNavLinks = document.querySelectorAll('.footer-bottom-links a[href^="#"]');
    console.log('Found footer nav links:', footerNavLinks.length); // Debug log
    
    footerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Footer link clicked:', this.href); // Debug log
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    console.log('Scrolling to footer target:', targetId); // Debug log
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Typing effect for hero title
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Scroll-triggered fade-in animations
    const slideInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class to trigger the fade-in animation
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe slide-in elements
    document.querySelectorAll('.slide-in-element').forEach(element => {
        slideInObserver.observe(element);
    });
    
    // Login and Comment System
    let currentUser = null;
    
    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Form elements
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const commentCard = document.getElementById('commentCard');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const commentForm = document.getElementById('commentForm');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userName = document.getElementById('userName');
    
    // Clear form fields
    function clearFormFields() {
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
        if (commentForm) commentForm.reset();
    }
    
    // Show/Hide form functions
    function showLogin() {
        loginCard.style.display = 'block';
        registerCard.style.display = 'none';
        commentCard.style.display = 'none';
        clearFormFields();
    }
    
    function showRegister() {
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
        commentCard.style.display = 'none';
        clearFormFields();
    }
    
    function showCommentForm() {
        loginCard.style.display = 'none';
        registerCard.style.display = 'none';
        commentCard.style.display = 'block';
    }
    
    // Navigation event listeners
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegister();
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogin();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentUser = null;
            showLogin();
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            submitBtn.disabled = true;
            
            // Simulate login API call
            setTimeout(() => {
                // For demo purposes, accept any email/password
                currentUser = {
                    name: email.split('@')[0],
                    email: email
                };
                userName.textContent = currentUser.name;
                showCommentForm();
                alert('Login realizado com sucesso!');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const bio = formData.get('bio');
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
            submitBtn.disabled = true;
            
            // Simulate register API call
            setTimeout(() => {
                currentUser = {
                    name: name,
                    email: email,
                    bio: bio
                };
                userName.textContent = currentUser.name;
                showCommentForm();
                alert('Registro realizado com sucesso!');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Comment form submission
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const rating = formData.get('rating');
            const comment = formData.get('comment');
            const project = formData.get('project');
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Create comment data
                const commentData = {
                    name: currentUser ? currentUser.name : 'Usuário Anônimo',
                    email: currentUser ? currentUser.email : 'anonimo@email.com',
                    rating: parseInt(rating),
                    message: comment
                };
                
                // Send comment to API
                const response = await createComment(commentData);
                
                if (response.success) {
                    alert('Comentário enviado com sucesso! Obrigado pelo feedback.');
                    this.reset();
                    
                    // Reload comments
                    const commentsResponse = await getComments();
                    console.log('Comments updated:', commentsResponse);
                    if (commentsResponse.success) {
                        await renderComments(commentsResponse.comments);
                    }
                } else {
                    alert('Erro ao enviar comentário: ' + response.error);
                }
            } catch (error) {
                console.error('Error submitting comment:', error);
                alert('Erro ao enviar comentário. Tente novamente.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Star rating interaction
    const ratingInputs = document.querySelectorAll('.rating-input input[type="radio"]');
    const ratingLabels = document.querySelectorAll('.rating-input label');
    
    ratingInputs.forEach((input, index) => {
        input.addEventListener('change', function() {
            // Reset all stars
            ratingLabels.forEach(label => {
                label.style.color = 'rgba(255, 215, 0, 0.3)';
            });
            
            // Color stars up to selected rating
            for (let i = 0; i <= index; i++) {
                ratingLabels[i].style.color = '#ffd700';
            }
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Project count will be updated by GitHubProjectsManager
    // The counter will be animated when projects are loaded from GitHub
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Skill icons hover effect
    const skillIcons = document.querySelectorAll('.skill-icon');
    skillIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Project cards hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Contact form validation
    const contactFormInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    contactFormInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ff4444';
            } else {
                this.style.borderColor = 'rgba(0, 255, 65, 0.3)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--accent-color)';
        });
    });
    
    // Smooth reveal animation for sections
    const revealSections = document.querySelectorAll('.slide-in');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });
    
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });
    
    // Initialize tooltips for social links
    const socialLinks = document.querySelectorAll('.social-icon-link');
    socialLinks.forEach(link => {
        const title = link.getAttribute('title');
        if (title) {
            link.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    z-index: 1000;
                    pointer-events: none;
                `;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
                
                this.tooltip = tooltip;
            });
            
            link.addEventListener('mouseleave', function() {
                if (this.tooltip) {
                    this.tooltip.remove();
                    this.tooltip = null;
                }
            });
        }
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Enter key for form submissions
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const form = e.target.closest('form');
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        }
    });
    
    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could be used for navigation
                console.log('Swipe up detected');
            } else {
                // Swipe down - could be used for navigation
                console.log('Swipe down detected');
            }
        }
    }
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Update any scroll-based animations here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Initialize the page
    console.log('Portfolio website loaded successfully!');
}); 