 const homeBtn = document.getElementById('homeBtn');
        const signoutBtn = document.getElementById('signoutBtn');
        const profileBtn = document.getElementById('profileBtn');
        const yourBlogsBtn = document.getElementById('yourBlogsBtn');
        const blogTitle = document.getElementById('blogTitle');
        const blogContent = document.getElementById('blogContent');
        const titleCharCount = document.getElementById('titleCharCount');
        const contentCharCount = document.getElementById('contentCharCount');
        const editBlogForm = document.getElementById('editBlogForm');
        const previewBtn = document.getElementById('previewBtn');
        const updateBtn = document.getElementById('updateBtn');
        const previewModal = document.getElementById('previewModal');
        const closeModal = document.getElementById('closeModal');
        const previewTitle = document.getElementById('previewTitle');
        const previewContent = document.getElementById('previewContent');
        const originalTitle = document.getElementById('originalTitle');
        const originalContent = document.getElementById('originalContent');
        const loading = document.getElementById('loading');

        // Character Counters
        function updateCharCount(element, counterElement, maxLength) {
            const length = element.value.length;
            counterElement.textContent = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                counterElement.classList.add('warning');
                counterElement.classList.remove('error');
            } else if (length > maxLength) {
                counterElement.classList.remove('warning');
                counterElement.classList.add('error');
            } else {
                counterElement.classList.remove('warning', 'error');
            }
            
            // Limit to max length
            if (length > maxLength) {
                element.value = element.value.substring(0, maxLength);
                counterElement.textContent = `${maxLength}/${maxLength} characters`;
                counterElement.classList.add('error');
            }
        }

        // Initialize character counts
        updateCharCount(blogTitle, titleCharCount, 120);
        updateCharCount(blogContent, contentCharCount, 5000);

        // Update character counts on input
        blogTitle.addEventListener('input', () => {
            updateCharCount(blogTitle, titleCharCount, 120);
        });

        blogContent.addEventListener('input', () => {
            updateCharCount(blogContent, contentCharCount, 5000);
        });

        // Input focus effects
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.querySelector('.input-focus-line').style.width = '100%';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.querySelector('.input-focus-line').style.width = '0';
            });
        });

        // Preview Functionality
        previewBtn.addEventListener('click', function() {
            animateButton(this);
            
            // Get current values
            const currentTitle = blogTitle.value || 'Your Blog Title';
            const currentContent = blogContent.value || 'Your blog content will appear here...';
            
            // Set preview content
            previewTitle.textContent = currentTitle;
            previewContent.innerHTML = currentContent.replace(/\n/g, '<br><br>');
            
            // Show modal
            previewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        closeModal.addEventListener('click', function() {
            previewModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        previewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                previewModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Form Submission
        editBlogForm.addEventListener('submit', function(e) {
            
            // Validate form
            if (!blogTitle.value.trim()) {
                showMessage('Please enter a blog title', 'error');
                blogTitle.focus();
                return;
            }
            
            if (!blogContent.value.trim()) {
                showMessage('Please enter blog content', 'error');
                blogContent.focus();
                return;
            }
            
            if (blogTitle.value.trim().length < 10) {
                showMessage('Title should be at least 10 characters long', 'error');
                blogTitle.focus();
                return;
            }
            
            if (blogContent.value.trim().length < 100) {
                showMessage('Content should be at least 100 characters long', 'error');
                blogContent.focus();
                return;
            }
            
            // Show loading state
            loading.style.display = 'block';
            updateBtn.disabled = true;
            previewBtn.disabled = true;
            
            // Simulate API call with progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 10;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    
                    // Update original preview
                    originalTitle.textContent = blogTitle.value;
                    originalContent.innerHTML = blogContent.value.replace(/\n/g, '<br><br>');
                    
                    // Hide loading
                    loading.style.display = 'none';
                    updateBtn.disabled = false;
                    previewBtn.disabled = false;
                    
                    
                    // Add visual feedback to form
                    editBlogForm.style.transform = 'scale(0.99)';
                    editBlogForm.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.3)';
                    
                    setTimeout(() => {
                        editBlogForm.style.transform = '';
                        editBlogForm.style.boxShadow = '';
                    }, 1000);
                    
                    // Update last edited time
                    const now = new Date();
                    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    document.querySelector('.original-meta strong:nth-child(2)').textContent = 
                        `${now.toLocaleDateString()} at ${timeString}`;
                }
            }, 100);
        });

        // Auto-save functionality
        let autoSaveTimeout;
        blogTitle.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(autoSave, 2000);
        });
        
        blogContent.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(autoSave, 2000);
        });

        function autoSave() {
            // Check if there are changes
            if (blogTitle.value === originalTitle.textContent && 
                blogContent.value === originalContent.textContent.trim()) {
                return;
            }
            
            
            document.body.appendChild(autoSaveIndicator);
            
            // Simulate auto-save
            setTimeout(() => {
                // Save to localStorage (in a real app, this would be an API call)
                localStorage.setItem('autoSaveTitle', blogTitle.value);
                localStorage.setItem('autoSaveContent', blogContent.value);
                localStorage.setItem('autoSaveTime', new Date().toISOString());
                
                // Update indicator
                autoSaveIndicator.innerHTML = '<i class="fas fa-check"></i> Auto-saved';
                autoSaveIndicator.style.background = 'var(--success)';
                
                // Remove after 2 seconds
                setTimeout(() => {
                    autoSaveIndicator.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => {
                        if (autoSaveIndicator.parentNode) {
                            autoSaveIndicator.remove();
                        }
                    }, 300);
                }, 1500);
            }, 500);
        }

        // Check for auto-saved content on page load
        document.addEventListener('DOMContentLoaded', () => {
            const savedTitle = localStorage.getItem('autoSaveTitle');
            const savedContent = localStorage.getItem('autoSaveContent');
            const savedTime = localStorage.getItem('autoSaveTime');
            
            if (savedTitle && savedContent) {
                const time = new Date(savedTime);
                const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            }
            
            // Add CSS for animations if not already added
            if (!document.querySelector('#message-styles')) {
                const style = document.createElement('style');
                style.id = 'message-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutRight {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        });

        // Warn user before leaving page with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (blogTitle.value !== originalTitle.textContent || 
                blogContent.value !== originalContent.textContent.trim()) {
                e.returnValue = '';
            }
        });

        // Utility Functions
        function animateButton(button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }

        function showMessage(message, type) {
            // Remove any existing message
            const existingMessage = document.querySelector('.message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create message element
            const messageEl = document.createElement('div');
            messageEl.className = `message message-${type}`;
            messageEl.innerHTML = `
                <span>${message}</span>
                <button class="message-close"><i class="fas fa-times"></i></button>
            `;
            
            // Style the message
            messageEl.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: ${type === 'error' ? '#fef2f2' : type === 'success' ? '#f0fdf4' : '#eff6ff'};
                color: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#2563eb'};
                border-radius: 10px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 2000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            `;
            
            // Add close button functionality
            const closeBtn = messageEl.querySelector('.message-close');
            closeBtn.addEventListener('click', () => {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => messageEl.remove(), 300);
                }
            }, 5000);
            
            document.body.appendChild(messageEl);
        }