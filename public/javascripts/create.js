  const profileBtn = document.getElementById('profileBtn');
        const signoutBtn = document.getElementById('signoutBtn');
        const yourBlogsBtn = document.getElementById('yourBlogsBtn');
        const imageUploadContainer = document.getElementById('imageUploadContainer');
        const imageInput = document.getElementById('imageInput');
        const browseBtn = document.getElementById('browseBtn');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        const removeImageBtn = document.getElementById('removeImageBtn');
        const blogTitle = document.getElementById('blogTitle');
        const charCount = document.getElementById('charCount');
        const blogContent = document.getElementById('blogContent');
        const categoriesGrid = document.getElementById('categoriesGrid');
        const postBlogBtn = document.getElementById('postBlogBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');

        // Navigation Buttons
        profileBtn.addEventListener('click', function() {
            animateButton(this);
            setTimeout(() => {
            }, 300);
        });

        signoutBtn.addEventListener('click', function() {
            animateButton(this);
            setTimeout(() => {
                if (confirm('Are you sure you want to sign out?')) {
                    showMessage('Successfully signed out. Redirecting to home page...', 'success');
                    setTimeout(() => {
                    }, 1500);
                }
            }, 300);
        });

        yourBlogsBtn.addEventListener('click', function() {
            animateButton(this);
            setTimeout(() => {
            }, 300);
        });

        // Image Upload Functionality
        browseBtn.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', handleImageUpload);

        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageUploadContainer.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            imageUploadContainer.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            imageUploadContainer.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            imageUploadContainer.classList.add('dragover');
        }

        function unhighlight() {
            imageUploadContainer.classList.remove('dragover');
        }

        imageUploadContainer.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleImageUpload() {
            const files = imageInput.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            if (files.length === 0) return;
            
            const file = files[0];
            
            // Validate file type
            if (!file.type.match('image.*')) {
                showMessage('Please select an image file (JPEG, PNG, GIF)', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('Image size should be less than 5MB', 'error');
                return;
            }
            
            // Show progress bar
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
            
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    progressContainer.style.display = 'none';
                    
                    // Display preview
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImage.src = e.target.result;
                        imagePreview.style.display = 'block';
                        showMessage('Image uploaded successfully!', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            }, 100);
        }

        // Remove image
        removeImageBtn.addEventListener('click', function() {
            previewImage.src = '';
            imagePreview.style.display = 'none';
            imageInput.value = '';
            showMessage('Image removed', 'info');
        });

        // Blog title character count
        blogTitle.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = `${length}/100 characters`;
            
            if (length > 90) {
                charCount.classList.add('warning');
                charCount.classList.remove('error');
            } else if (length > 100) {
                charCount.classList.remove('warning');
                charCount.classList.add('error');
            } else {
                charCount.classList.remove('warning', 'error');
            }
            
            // Limit to 100 characters
            if (length > 100) {
                this.value = this.value.substring(0, 100);
                charCount.textContent = `100/100 characters`;
                charCount.classList.add('error');
            }
        });

        // Initialize categories
        const categories = [
            'Technology', 'Travel', 'Food', 'Lifestyle', 'Health',
            'Business', 'Education', 'Entertainment', 'Sports', 'Art',
            'Science', 'Personal', 'Fashion', 'Photography', 'Music'
        ];

        categories.forEach(category => {
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn';
            categoryBtn.textContent = category;
            categoryBtn.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            categoriesGrid.appendChild(categoryBtn);
        });

        // Editor toolbar functionality
        document.querySelectorAll('.tool-btn').forEach(button => {
            button.addEventListener('click', function() {
                const format = this.dataset.format;
                applyFormat(format);
                animateButton(this);
            });
        });

        function applyFormat(format) {
            const textarea = blogContent;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let formattedText = '';
            
            switch(format) {
                case 'bold':
                    formattedText = `**${selectedText}**`;
                    break;
                case 'italic':
                    formattedText = `*${selectedText}*`;
                    break;
                case 'underline':
                    formattedText = `<u>${selectedText}</u>`;
                    break;
                case 'link':
                    const url = prompt('Enter URL:');
                    if (url) {
                        formattedText = `[${selectedText}](${url})`;
                    } else {
                        formattedText = selectedText;
                    }
                    break;
                case 'list':
                    formattedText = `\n- ${selectedText.replace(/\n/g, '\n- ')}`;
                    break;
                case 'heading':
                    formattedText = `# ${selectedText}`;
                    break;
                case 'quote':
                    formattedText = `> ${selectedText.replace(/\n/g, '\n> ')}`;
                    break;
                default:
                    formattedText = selectedText;
            }
            
            textarea.value = textarea.value.substring(0, start) + 
                            formattedText + 
                            textarea.value.substring(end);
            
            // Set cursor position after inserted text
            textarea.selectionStart = start + formattedText.length;
            textarea.selectionEnd = start + formattedText.length;
            textarea.focus();
        }

        // Post Blog Button
        postBlogBtn.addEventListener('click', function() {
            // Validate form
            if (!previewImage.src) {
                showMessage('Please upload a cover image for your blog', 'error');
                imageUploadContainer.style.borderColor = 'var(--error)';
                setTimeout(() => {
                    imageUploadContainer.style.borderColor = '';
                }, 2000);
                return;
            }
            
            if (!blogTitle.value.trim()) {
                showMessage('Please enter a title for your blog', 'error');
                blogTitle.style.borderColor = 'var(--error)';
                setTimeout(() => {
                    blogTitle.style.borderColor = '';
                }, 2000);
                return;
            }
            
            if (!blogContent.value.trim()) {
                showMessage('Please write some content for your blog', 'error');
                blogContent.style.borderColor = 'var(--error)';
                setTimeout(() => {
                    blogContent.style.borderColor = '';
                }, 2000);
                return;
            }
            
            // Get selected categories
            const selectedCategories = Array.from(document.querySelectorAll('.category-btn.selected'))
                .map(btn => btn.textContent);
            
            if (selectedCategories.length === 0) {
                showMessage('Please select at least one category', 'error');
                return;
            }
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
            this.disabled = true;
            
            // Simulate blog publishing
            setTimeout(() => {
                // Show success message
                showMessage('Blog published successfully! Redirecting to your blogs...', 'success');
                
                // Reset form after a delay
                setTimeout(() => {
                    // Reset button
                    this.innerHTML = originalText;
                    this.disabled = false;
                    
                    // Reset form
                    previewImage.src = '';
                    imagePreview.style.display = 'none';
                    imageInput.value = '';
                    blogTitle.value = '';
                    blogContent.value = '';
                    charCount.textContent = '0/100 characters';
                    document.querySelectorAll('.category-btn.selected').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    
                    // Redirect to blogs page
                    window.location.href = 'your-blogs.html';
                }, 2000);
            }, 2000);
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
        }

        // Initialize character count on page load
        document.addEventListener('DOMContentLoaded', () => {
            charCount.textContent = `0/100 characters`;
            
            // Add floating animation to create blog card
            const blogCard = document.querySelector('.create-blog-card');
            let floating = false;
            
            blogCard.addEventListener('mouseenter', () => {
                if (!floating) {
                    floating = true;
                    blogCard.style.transform = 'translateY(-10px)';
                    blogCard.style.transition = 'transform 0.3s ease';
                }
            });
            
            blogCard.addEventListener('mouseleave', () => {
                if (floating) {
                    floating = false;
                    blogCard.style.transform = 'translateY(0)';
                }
            });
        });