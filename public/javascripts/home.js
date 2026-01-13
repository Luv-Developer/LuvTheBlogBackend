        const signinBtn = document.getElementById('signinBtn');
        const getstartedBtn = document.getElementById('getstartedBtn');
        const heroGetStarted = document.getElementById('heroGetStarted');
        const signinModal = document.getElementById('signinModal');
        const getstartedModal = document.getElementById('getstartedModal');
        const closeModal = document.getElementById('closeModal');
        const closeModal2 = document.getElementById('closeModal2');
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToSignin = document.getElementById('switchToSignin');
        const actionButtons = document.querySelectorAll('.action-btn');

        // Open Sign In Modal
        signinBtn.addEventListener('click', () => {
            signinModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // Open Get Started Modal
        getstartedBtn.addEventListener('click', () => {
            getstartedModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // Hero Get Started Button
        heroGetStarted.addEventListener('click', () => {
            getstartedModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // Close Modals
        closeModal.addEventListener('click', () => {
            signinModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        closeModal2.addEventListener('click', () => {
            getstartedModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === signinModal) {
                signinModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (e.target === getstartedModal) {
                getstartedModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Switch between Sign In and Sign Up modals
        switchToSignup.addEventListener('click', (e) => {
            signinModal.style.display = 'none';
            getstartedModal.style.display = 'flex';
        });

        switchToSignin.addEventListener('click', (e) => {
            getstartedModal.style.display = 'none';
            signinModal.style.display = 'flex';
        });

        // Form submissions
        document.getElementById('signinForm').addEventListener('submit', (e) => {
            signinModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            alert('Account created successfully! Welcome to LuvTheBlog community.');
            getstartedModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Interactive blog action buttons
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                
                // Toggle like button
                if (icon.classList.contains('fa-heart')) {
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        this.style.color = '#ff4757';
                        
                        // Update count
                        const currentText = this.textContent;
                        const count = parseInt(currentText.match(/\d+/)[0]);
                        this.innerHTML = `<i class="fas fa-heart"></i> ${count + 1}`;
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        this.style.color = '';
                        
                        // Update count
                        const currentText = this.textContent;
                        const count = parseInt(currentText.match(/\d+/)[0]);
                        this.innerHTML = `<i class="far fa-heart"></i> ${count - 1}`;
                    }
                }
                
                // Toggle follow button
                if (icon.classList.contains('fa-user-plus')) {
                    if (icon.classList.contains('fa-user-plus')) {
                        icon.classList.remove('fa-user-plus');
                        icon.classList.add('fa-user-check');
                        this.innerHTML = `<i class="fas fa-user-check"></i> Following`;
                        this.style.color = '#10b981';
                    } else {
                        icon.classList.remove('fa-user-check');
                        icon.classList.add('fa-user-plus');
                        this.innerHTML = `<i class="fas fa-user-plus"></i> Follow`;
                        this.style.color = '';
                    }
                }
                
            });
        });

        // Add scroll animation for elements
        window.addEventListener('scroll', () => {
            const elements = document.querySelectorAll('.feature-card, .blog-card');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        });

        // Initialize animation for elements on page load
        document.addEventListener('DOMContentLoaded', () => {
            const elements = document.querySelectorAll('.feature-card, .blog-card');
            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
            
            // Trigger scroll event to show initial elements
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 300);
        });