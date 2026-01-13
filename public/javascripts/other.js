        const profileBtn = document.getElementById('profileBtn');
        const signoutBtn = document.getElementById('signoutBtn');
        const createBlogBtn = document.getElementById('createBlogBtn');
        const homeBtn = document.getElementById('homeBtn');
        const searchInput = document.getElementById('searchInput');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const likeBtns = document.querySelectorAll('.like-btn');
        const likeCounts = document.querySelectorAll('.like-count');
        const followBtns = document.querySelectorAll('.follow-btn');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const blogsContainer = document.getElementById('blogsContainer');
        const sharebtn = document.getElementById("sharebtn")

        // Search Functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const blogCards = document.querySelectorAll('.blog-card');
            
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-title').textContent.toLowerCase();
                const author = card.querySelector('.author-name').textContent.toLowerCase();
                const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || author.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });

        // Filter Functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                animateButton(this);
                
                const filter = this.dataset.filter;
                const blogCards = document.querySelectorAll('.blog-card');
                
                blogCards.forEach(card => {
                    const categories = card.dataset.category;
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Like Functionality
        likeBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const countElement = likeCounts[index];
                let count = parseInt(countElement.textContent);
                const icon = this.querySelector('i');
                
                if (this.classList.contains('liked')) {
                    // Unlike
                    count--;
                    this.classList.remove('liked');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    countElement.textContent = count;
                    showMessage('Removed like from blog', 'info');
                } else {
                    // Like
                    count++;
                    this.classList.add('liked');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    countElement.textContent = count;
                }
                
                // Animate the like count
                countElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    countElement.style.transform = 'scale(1)';
                }, 200);
            });
        });

        // Follow Functionality
        followBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const authorName = this.parentElement.textContent.replace('Follow', '').trim();
                
                if (this.textContent === 'Follow') {
                    this.textContent = 'Following';
                    this.style.color = 'var(--success)';
                } else {
                    this.textContent = 'Follow';
                    this.style.color = 'var(--primary)';
                    showMessage(`Unfollowed ${authorName}`, 'info');
                }
                
                animateButton(this);
            });
        });

        // Load More Functionality
        loadMoreBtn.addEventListener('click', function() {
            animateButton(this);
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Simulate loading more blogs
            setTimeout(() => {
                // Create new blog cards
                const newBlogs = [
                    {
                        id: 9,
                        title: "The Psychology of Color in Marketing",
                        excerpt: "How different colors influence consumer behavior and decision making in marketing and branding strategies.",
                        author: "Elena Martinez",
                        email: "elena.design@example.com",
                        date: "May 20, 2023",
                        likes: "189",
                        image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
                        category: "lifestyle",
                        avatarClass: "avatar-1"
                    },
                    {
                        id: 10,
                        title: "Urban Gardening in Small Spaces",
                        excerpt: "Creative solutions for growing your own food even in small apartments or limited outdoor spaces.",
                        author: "Ben Carter",
                        email: "ben.garden@example.com",
                        date: "May 18, 2023",
                        likes: "234",
                        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                        category: "lifestyle",
                        avatarClass: "avatar-2"
                    }
                ];
                
                // Add new blogs to container
                newBlogs.forEach(blog => {
                    const blogCard = document.createElement('div');
                    blogCard.className = 'blog-card';
                    blogCard.dataset.category = blog.category;
                    blogCard.style.animation = 'cardSlide 0.8s ease';
                    
                    blogCard.innerHTML = `
                        <div class="blog-image" style="background-image: url('${blog.image}')">
                            <div class="blog-overlay"></div>
                        </div>
                        <div class="blog-content">
                            <h3 class="blog-title">${blog.title}</h3>
                            <p class="blog-excerpt">${blog.excerpt}</p>
                            
                            <div class="blog-meta">
                                <div class="author-avatar ${blog.avatarClass}">
                                    ${blog.author.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div class="author-info">
                                    <div class="author-name">
                                        ${blog.author}
                                        <button class="follow-btn">Follow</button>
                                    </div>
                                    <div class="author-email">${blog.email}</div>
                                </div>
                                <div class="blog-date">${blog.date}</div>
                            </div>
                            
                            <div class="blog-actions">
                                <div class="like-section">
                                    <button class="like-btn" id="likeBtn${blog.id}">
                                        <i class="far fa-heart"></i>
                                    </button>
                                    <div class="like-count" id="likeCount${blog.id}">${blog.likes}</div>
                                </div>
                                <div class="read-time">
                                    <i class="far fa-clock"></i> 5 min read
                                </div>
                            </div>
                        </div>
                    `;
                    
                    blogsContainer.appendChild(blogCard);
                    
                    // Add event listeners to new elements
                    const newLikeBtn = blogCard.querySelector(`#likeBtn${blog.id}`);
                    const newFollowBtn = blogCard.querySelector('.follow-btn');
                    
                    newLikeBtn.addEventListener('click', function() {
                        const countElement = blogCard.querySelector(`#likeCount${blog.id}`);
                        let count = parseInt(countElement.textContent);
                        const icon = this.querySelector('i');
                        
                        if (this.classList.contains('liked')) {
                            count--;
                            this.classList.remove('liked');
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                            countElement.textContent = count;
                        } else {
                            count++;
                            this.classList.add('liked');
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                            countElement.textContent = count;
                            showMessage('Liked the blog!', 'success');
                        }
                        
                        countElement.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            countElement.style.transform = 'scale(1)';
                        }, 200);
                    });
                    
                    newFollowBtn.addEventListener('click', function() {
                        const authorName = this.parentElement.textContent.replace('Follow', '').trim();
                        
                        if (this.textContent === 'Follow') {
                            this.textContent = 'Following';
                            this.style.color = 'var(--success)';
                            showMessage(`Now following ${authorName}`, 'success');
                        } else {
                            this.textContent = 'Follow';
                            this.style.color = 'var(--primary)';
                            showMessage(`Unfollowed ${authorName}`, 'info');
                        }
                        
                        animateButton(this);
                    });
                });
                
                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
                
                showMessage('Loaded more blogs!', 'success');
                
                // Hide load more button if we've loaded enough
                if (blogsContainer.children.length >= 12) {
                    this.style.display = 'none';
                }
            }, 1500);
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

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            // Add hover effect to blog cards
            document.querySelectorAll('.blog-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.zIndex = '10';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.zIndex = '1';
                });
            });
            
            // Simulate some already liked blogs
            setTimeout(() => {
                // Randomly like some blogs
                const randomIndex = Math.floor(Math.random() * likeBtns.length);
                likeBtns[randomIndex].click();
                
                // Randomly follow some authors
                const randomFollowIndex = Math.floor(Math.random() * followBtns.length);
                followBtns[randomFollowIndex].click();
            }, 1000);
        });

        let url = "http://localhost:5000/other"
        let copied = false
        sharebtn.addEventListener("click",async()=>{
            await navigator.clipboard.writeText(url)
            copied = true
        })
        if(copied == true){
            alert("URL copied in Clipboard!")
        }