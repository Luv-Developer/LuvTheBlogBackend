        // DOM Elements
        const navButtons = document.querySelectorAll('.nav-btn');
        const editPhotoBtn = document.getElementById('editPhotoBtn');
        const profilePhoto = document.getElementById('profilePhoto');
        const editProfileBtn = document.getElementById('editProfileBtn');
        const profileName = document.getElementById('profileName');
        const detailName = document.getElementById('detailName');
        const profileEmail = document.getElementById('profileEmail');
        
        // Navigation Buttons Functionality
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                navButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size/2;
                const y = event.clientY - rect.top - size/2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                `;
                
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Edit Profile Photo
        editPhotoBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        img.onload = function() {
                            // Create canvas to crop to circle
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            const size = Math.min(img.width, img.height);
                            
                            canvas.width = 160;
                            canvas.height = 160;
                            
                            // Draw circular image
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(80, 80, 80, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.clip();
                            
                            // Calculate aspect ratio and draw image
                            const aspect = size / 160;
                            ctx.drawImage(
                                img, 
                                (img.width - size) / 2, 
                                (img.height - size) / 2, 
                                size, size, 
                                0, 0, 
                                160, 160
                            );
                            
                            ctx.restore();
                            
                            
                            // Show success message
                            showMessage('Profile photo updated successfully!', 'success');
                        };
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        });

        // Edit Profile Button
        editProfileBtn.addEventListener('click', function() {
            // Create modal for editing profile
            createEditProfileModal();
        });

        // Show message function
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
                top: 20px;
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
                    @keyframes ripple {
                        to { transform: scale(4); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Create Edit Profile Modal
        function createEditProfileModal() {
            // Create modal overlay
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            `;
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.style.cssText = `
                background: white;
                border-radius: 20px;
                padding: 2.5rem;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                animation: slideUp 0.4s ease;
            `;
            
            // Modal HTML content
            modalContent.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-family: 'Playfair Display', serif; color: var(--dark);">Edit Profile</h2>
                    <button id="closeModal" style="background: none; border: none; font-size: 1.5rem; color: var(--gray); cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="editProfileForm">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
                        <input type="text" id="editName" value="Alexandra Smith" style="width: 100%; padding: 0.9rem; border: 2px solid var(--gray-light); border-radius: 10px; font-size: 1rem; transition: var(--transition);">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Username</label>
                        <input type="text" id="editUsername" value="@alex_writer" style="width: 100%; padding: 0.9rem; border: 2px solid var(--gray-light); border-radius: 10px; font-size: 1rem;">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
                        <input type="email" id="editEmail" value="alex.smith@example.com" style="width: 100%; padding: 0.9rem; border: 2px solid var(--gray-light); border-radius: 10px; font-size: 1rem;">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Bio</label>
                        <textarea id="editBio" rows="3" style="width: 100%; padding: 0.9rem; border: 2px solid var(--gray-light); border-radius: 10px; font-size: 1rem; resize: vertical;">Travel blogger & Food enthusiast ✨ Exploring the world one story at a time</textarea>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Website</label>
                        <input type="url" id="editWebsite" value="www.alexwrites.com" style="width: 100%; padding: 0.9rem; border: 2px solid var(--gray-light); border-radius: 10px; font-size: 1rem;">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Country</label>
                        <select id="editCountry" style="width: 100%; padding: 0.9rem; border: 2px solid var(--gray-light); border-radius: 10px; font-size: 1rem;">
                            <option value="UK" selected>United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="IN">India</option>
                            <option value="JP">Japan</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">City</label>
                        <input type="text" id="editCity" value="London" style="width: 100%; padding: 0.9rem; border: 2px solid var(--gray-light); border-radius: 10px; font-size: 1rem;">
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 1rem; background: var(--primary-gradient); color: white; border: none; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: var(--transition);">
                        Save Changes
                    </button>
                </form>
            `;
            
            // Append modal to page
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            document.body.style.overflow = 'hidden';
            
            // Close modal functionality
            const closeModal = document.getElementById('closeModal');
            closeModal.addEventListener('click', () => {
                modalOverlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                    document.body.style.overflow = 'auto';
                }, 300);
            });
            
            // Close modal when clicking outside
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        document.body.removeChild(modalOverlay);
                        document.body.style.overflow = 'auto';
                    }, 300);
                }
            });
            
            // Form submission
            const editProfileForm = document.getElementById('editProfileForm');
            editProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Update profile information
                const newName = document.getElementById('editName').value;
                const newEmail = document.getElementById('editEmail').value;
                
                profileName.textContent = newName.split(' ')[0] + ' ' + newName.split(' ')[1].charAt(0);
                detailName.textContent = newName;
                profileEmail.textContent = newEmail;
                
                
                // Close modal
                modalOverlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                    document.body.style.overflow = 'auto';
                }, 300);
            });
            
            // Add CSS for modal animations if not already added
            if (!document.querySelector('#modal-styles')) {
                const style = document.createElement('style');
                style.id = 'modal-styles';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(50px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Initialize page with some animations
        document.addEventListener('DOMContentLoaded', () => {
            // Animate stat numbers
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const originalText = stat.textContent;
                stat.textContent = '0';
                
                setTimeout(() => {
                    let count = 0;
                    const target = parseFloat(originalText) * (originalText.includes('K') ? 1000 : 1);
                    const increment = target / 50;
                    
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            count = target;
                            clearInterval(timer);
                        }
                        
                        if (originalText.includes('K')) {
                            stat.textContent = (count / 1000).toFixed(1) + 'K';
                        } else {
                            stat.textContent = Math.floor(count);
                        }
                    }, 30);
                }, 1000);
            });
            
            // Update last active time
            const lastActive = document.getElementById('lastActive');
            const times = ['2 hours ago', 'Just now', '30 minutes ago', '1 hour ago'];
            setInterval(() => {
                const randomTime = times[Math.floor(Math.random() * times.length)];
                lastActive.textContent = randomTime;
            }, 10000);
        });