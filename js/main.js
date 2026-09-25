document.addEventListener('DOMContentLoaded', () => {
    let particleRGB = '0, 0, 0'; // default light

    const updateParticleColors = (theme) => {
        particleRGB = theme === 'dark' ? '255, 255, 255' : '0, 0, 0';
    };

    // ============================================
    // Theme Toggle
    // ============================================
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        // Update particles color
        updateParticleColors(theme);
    };

    // Check saved theme or default to light
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // 1. Particle Background (Canvas)
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 2 + 1;
                this.dx = (Math.random() - 0.5) * 1;
                this.dy = (Math.random() - 0.5) * 1;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = `rgba(${particleRGB}, ${this.opacity})`;
                ctx.fill();
            }

            update() {
                if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
                if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

                this.x += this.dx;
                this.y += this.dy;

                this.draw();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = 80;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const connectParticles = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                                   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (120 * 120)) {
                        opacityValue = 1 - (distance / 14400);
                        ctx.strokeStyle = `rgba(${particleRGB}, ${opacityValue * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connectParticles();
            animationFrameId = requestAnimationFrame(animateParticles);
        };

        resizeCanvas();
        initParticles();
        animateParticles();
    }

    // 2. Navbar & Smooth Scroll
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinksList = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (hamburger && navLinksList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            if (hamburger && navLinksList) {
                hamburger.classList.remove('active');
                navLinksList.classList.remove('active');
            }
        });
    });

    // Active link highlighting
    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }


    // GSAP Setup
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // 4. GSAP Hero Animation
        const heroTimeline = gsap.timeline();
        
        const heroElements = [
            '.hero-greeting',
            '.hero-name',
            '.hero-description',
            '.hero-cta'
        ];

        heroElements.forEach((selector, index) => {
            const el = document.querySelector(selector);
            if (el) {
                heroTimeline.fromTo(el, 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                    index * 0.15
                );
            }
        });

        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroTimeline.fromTo(heroImage,
                { opacity: 0, scale: 0.8, x: 50 },
                { opacity: 1, scale: 1, x: 0, duration: 0.8, ease: 'power3.out' },
                "-=0.6" // overlap with previous
            );
        }

        // 5. GSAP Scroll Animations
        if (typeof ScrollTrigger !== 'undefined') {
            // Section Headers
            gsap.utils.toArray('.section-header').forEach(header => {
                gsap.fromTo(header,
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: header,
                            start: 'top 80%',
                            once: true
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    }
                );
            });

            // General Reveals
            gsap.utils.toArray('.reveal').forEach(el => {
                gsap.fromTo(el,
                    { opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 80%',
                            once: true
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        stagger: 0.1
                    }
                );
            });

            // 6. Stats Counter
            const statNumbers = gsap.utils.toArray('.stat-number');
            if (statNumbers.length > 0) {
                const aboutSection = document.querySelector('#about') || statNumbers[0].closest('section');
                
                if (aboutSection) {
                    ScrollTrigger.create({
                        trigger: aboutSection,
                        start: 'top 80%',
                        once: true,
                        onEnter: () => {
                            statNumbers.forEach(stat => {
                                const target = parseInt(stat.getAttribute('data-count') || 0, 10);
                                gsap.to(stat, {
                                    textContent: target,
                                    duration: 2,
                                    ease: 'power1.out',
                                    snap: { textContent: 1 },
                                    onUpdate: function() {
                                        stat.textContent = Math.ceil(this.targets()[0].textContent);
                                    }
                                });
                            });
                        }
                    });
                }
            }

            // Skill Categories
            const skillSection = document.querySelector('#skills');
            if (skillSection) {
                gsap.fromTo('.skill-category',
                    { opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: skillSection,
                            start: 'top 80%',
                            once: true
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out'
                    }
                );
            }

            // Timeline Items
            const expSection = document.querySelector('#experience');
            if (expSection) {
                gsap.utils.toArray('.timeline-item').forEach((item, index) => {
                    gsap.fromTo(item,
                        { opacity: 0, x: index % 2 === 0 ? -30 : 30 }, 
                        {
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 85%',
                                once: true
                            },
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: 'power3.out'
                        }
                    );
                });
            }

            const eduSection = document.querySelector('#education');
            if (eduSection) {
                 gsap.utils.toArray('.edu-item').forEach((item, index) => {
                    gsap.fromTo(item,
                        { opacity: 0, x: index % 2 === 0 ? -30 : 30 }, 
                        {
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 85%',
                                once: true
                            },
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: 'power3.out'
                        }
                    );
                });
            }

            // Project Cards
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                gsap.fromTo('.project-card',
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: projectsSection,
                            start: 'top 80%',
                            once: true
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out'
                    }
                );
            }
        }
    }

    // 7. 3D Tilt on Project Cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        let bounds;
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovered = false;

        const updateTransform = () => {
            if (isHovered) {
                currentX += (mouseX - currentX) * 0.1;
                currentY += (mouseY - currentY) * 0.1;
                card.style.transform = `perspective(1000px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
                requestAnimationFrame(updateTransform);
            } else {
                currentX += (0 - currentX) * 0.1;
                currentY += (0 - currentY) * 0.1;
                card.style.transform = `perspective(1000px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
                if (Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
                    requestAnimationFrame(updateTransform);
                } else {
                    card.style.transform = 'none';
                }
            }
        };

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            isHovered = true;
            requestAnimationFrame(updateTransform);
        });

        card.addEventListener('mousemove', (e) => {
            if (!bounds) return;
            // Calculate mouse position relative to center of card
            const x = e.clientX - bounds.left - bounds.width / 2;
            const y = e.clientY - bounds.top - bounds.height / 2;
            
            // Map to -10 to 10 degrees
            mouseX = (x / (bounds.width / 2)) * 10;
            mouseY = -(y / (bounds.height / 2)) * 10; // Invert Y for rotateX
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            mouseX = 0;
            mouseY = 0;
            requestAnimationFrame(updateTransform);
        });
    });

    // 9. Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.querySelector('.form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
            let isValid = true;
            let emailValue = '';

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                }
                if (input.type === 'email') {
                    emailValue = input.value.trim();
                }
            });

            // Basic Email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailValue && !emailRegex.test(emailValue)) {
                isValid = false;
            }

            if (formStatus) {
                if (isValid) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';
                    contactForm.reset();

                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 3000);
                } else {
                    formStatus.textContent = 'Please fill all fields correctly.';
                    formStatus.className = 'form-status error';
                    formStatus.style.display = 'block';
                }
            }
        });
    }
});
