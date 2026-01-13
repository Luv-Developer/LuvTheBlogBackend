        const profileBtn = document.getElementById('profileBtn');
        const signoutBtn = document.getElementById('signoutBtn');
        const homeBtn = document.getElementById('homeBtn');
        const createBlogBtn = document.getElementById('createBlogBtn');
        const createFirstBlog = document.getElementById('createFirstBlog');
        const blogsContainer = document.getElementById('blogsContainer');
        const emptyState = document.getElementById('emptyState');
        const totalBlogs = document.getElementById('totalBlogs');
        const totalLikes = document.getElementById('totalLikes');
        const totalComments = document.getElementById('totalComments');
        const totalViews = document.getElementById('totalViews');

        // Navigation Buttons
        profileBtn.addEventListener('click', function() {
            animateButton(this);
            setTimeout(() => {
                window.location.href = 'profile.html';
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

        homeBtn.addEventListener('click', function() {
            animateButton(this);
            setTimeout(() => {
            }, 300);
        });

        createBlogBtn.addEventListener('click', function() {
            animateButton(this);
            setTimeout(() => {
            }, 300);
        });

        createFirstBlog.addEventListener('click', function() {
            animateButton(this);
            setTimeout(() => {
            }, 300);
        });

        // Like and Comment Functionality
        for (let i = 1; i <= 6; i++) {
            const likeBtn = document.getElementById(`likeBtn${i}`);
            const commentBtn = document.getElementById(`commentBtn${i}`);
            
            if (likeBtn) {
                likeBtn.addEventListener('click', function() {
                    const statCount = this.querySelector('.stat-count');
                    let count = parseInt(statCount.textContent);
                    const icon = this.querySelector('i');
                    
                    if (icon.classList.contains('fas')) {
                        // Already liked, unlike it
                        count--;
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        this.style.color = '';
                        updateTotalLikes(-1);
                    } else {
                        // Like it
                        count++;
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        this.style.color = '#ef4444';
                        updateTotalLikes(1);
                    }
                    
                    statCount.textContent = count;
                    animateButton(this);
                });
            }
            
            if (commentBtn) {
                commentBtn.addEventListener('click', function() {
                    const blogCard = this.closest('.blog-card');
                    const blogTitle = blogCard.querySelector('.blog-title').textContent
                });
            }
        }

        // Blog Action Buttons (Edit and Delete)
        document.querySelectorAll('.blog-action-btn').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.querySelector('i').className;
                const blogCard = this.closest('.blog-card');
                const blogTitle = blogCard.querySelector('.blog-title').textContent;
                
                if (action.includes('fa-edit')) {
                    // Edit action
                    showMessage(`Editing "${blogTitle}"...`, 'info');
                    setTimeout(() => {
                    }, 1000);
                } else if (action.includes('fa-trash')) {
                }
            });
        });

        // Update total stats
        function updateTotalBlogs(change) {
            let current = parseInt(totalBlogs.textContent);
            current += change;
            totalBlogs.textContent = current;
            
            // Animate the number change
            animateNumber(totalBlogs, current - change, current);
        }

        function updateTotalLikes(change) {
            let current = parseInt(totalLikes.textContent.replace('K', '')) * 1000;
            current += change;
            totalLikes.textContent = (current / 1000).toFixed(1) + 'K';
            
            // Animate the number change
            const oldValue = parseInt(totalLikes.textContent.replace('K', '')) * 1000 - change;
            animateNumber(totalLikes, oldValue / 1000, current / 1000);
        }

        function updateTotalComments(change) {
            let current = parseInt(totalComments.textContent);
            current += change;
            totalComments.textContent = current;
            
            // Animate the number change
            animateNumber(totalComments, current - change, current);
        }

        function updateTotalViews(change) {
            let current = parseInt(totalViews.textContent.replace('K', '')) * 1000;
            current += change;
            totalViews.textContent = (current / 1000).toFixed(1) + 'K';
            
            // Animate the number change
            const oldValue = parseInt(totalViews.textContent.replace('K', '')) * 1000 - change;
            animateNumber(totalViews, oldValue / 1000, current / 1000);
        }

        // Check if blogs container is empty
        function checkEmptyState() {
            if (blogsContainer.children.length === 0) {
                blogsContainer.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                blogsContainer.style.display = 'grid';
                emptyState.style.display = 'none';
            }
        }

        // Utility Functions
        function animateButton(button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }

        function animateNumber(element, start, end) {
            let current = start;
            const increment = (end - start) / 20;
            const timer = setInterval(() => {
                current += increment;
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    current = end;
                    clearInterval(timer);
                }
                
                if (element === totalLikes || element === totalViews) {
                    element.textContent = current.toFixed(1) + 'K';
                } else {
                    element.textContent = Math.round(current);
                }
            }, 50);
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

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            // Simulate random view increases
            setInterval(() => {
                const randomIncrease = Math.floor(Math.random() * 10) + 1;
                updateTotalViews(randomIncrease);
            }, 10000);
            
            // Add hover effect to blog cards
            document.querySelectorAll('.blog-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.zIndex = '10';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.zIndex = '1';
                });
            });
            
            // Animate stats on page load
            const stats = [totalBlogs, totalLikes, totalComments, totalViews];
            stats.forEach(stat => {
                const originalValue = stat.textContent;
                stat.textContent = '0';
                
                setTimeout(() => {
                    if (stat === totalLikes || stat === totalViews) {
                        const target = parseFloat(originalValue.replace('K', ''));
                        animateNumber(stat, 0, target);
                    } else {
                        const target = parseInt(originalValue);
                        animateNumber(stat, 0, target);
                    }
                }, 500);
            });
        });