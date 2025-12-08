// ============================================
// BBNL STREAMING PLATFORM - GLOBAL JAVASCRIPT
// ============================================

// Theme Management - Global Sync Across All Pages
function initializeTheme() {
    const savedTheme = localStorage.getItem('bbnl-theme') || 'dark';
    const body = document.body;

    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }

    // Update all toggle switches on the page
    const themeToggles = document.querySelectorAll('.theme-toggle-input');
    themeToggles.forEach(toggle => {
        toggle.checked = savedTheme === 'dark';
    });
}

function setupThemeToggle() {
    // Listen to changes on any theme toggle input
    const themeToggles = document.querySelectorAll('.theme-toggle-input');

    themeToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            const body = document.body;
            const newTheme = isDark ? 'dark' : 'light';

            // Apply class
            if (isDark) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
            }

            // Save preference
            localStorage.setItem('bbnl-theme', newTheme);

            // Sync other toggles on the page if any
            const allToggles = document.querySelectorAll('.theme-toggle-input');
            allToggles.forEach(t => {
                if (t !== e.target) {
                    t.checked = isDark;
                }
            });
        });
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    setupThemeToggle();
});

// Initialize immediately for instant theme application
initializeTheme();


// ============================================
// FAVORITES MANAGER
// ============================================
const FavoritesManager = {
    // Key for localStorage
    STORAGE_KEY: 'bbnl-favorites',

    // Get all favorites
    getFavorites: function () {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // Add a favorite item
    addFavorite: function (item) {
        const favorites = this.getFavorites();
        // Check if already exists
        if (!favorites.some(fav => fav.id === item.id)) {
            favorites.push(item);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
            this.updateUI();
            console.log('Added favorite:', item.title);
            return true;
        }
        return false;
    },

    // Remove a favorite item by ID
    removeFavorite: function (id) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(fav => fav.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        this.updateUI();
        console.log('Removed favorite with ID:', id);
    },

    // Check if item is favorite
    isFavorite: function (id) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === id);
    },

    // Toggle favorite state
    toggleFavorite: function (item) {
        if (this.isFavorite(item.id)) {
            this.removeFavorite(item.id);
            return false; // Removed
        } else {
            this.addFavorite(item);
            return true; // Added
        }
    },

    // Update UI elements (heart icons) across the page
    updateUI: function () {
        // Update all heart buttons based on current state
        const heartBtns = document.querySelectorAll('.favorite-btn, .btn-add, .favorite-icon-overlay');

        heartBtns.forEach(btn => {
            const id = btn.dataset.id;
            if (id) {
                const isFav = this.isFavorite(id);
                const icon = btn.querySelector('i');

                if (isFav) {
                    btn.classList.add('active');
                    if (icon) {
                        icon.classList.remove('far'); // Regular (outline)
                        icon.classList.add('fas');    // Solid (filled)
                        // If it's the specific favorite overlay in cards
                        if (btn.classList.contains('favorite-icon-overlay')) {
                            // icon.style.color = 'white'; // Remove this override so it can turn red? 
                            // Actually plan said "Keep white inside red circle" is usually valid but active favorites usually turn red. 
                            // The instruction in implementation plan was to fix targeting.
                            // But wait, the existing code:
                            /* 
                            if (btn.classList.contains('favorite-icon-overlay')) {
                                icon.style.color = 'white'; // Keep white inside red circle
                            } else {
                                icon.style.color = '#ff0000';
                            }
                            */

                            // If I want it to be white, then it won't look "active" via color.
                            // Maybe the background should change? The background is hardcoded red in HTML style attribute.
                            // I should rely on CSS classes and remove inline styles in homepage.html.

                            // For now, let's just make sure the JS adds the class.
                            icon.style.color = 'white';
                        } else {
                            // Normal buttons
                            icon.style.color = '#ff0000';
                        }
                    }
                } else {
                    btn.classList.remove('active');
                    if (icon) {
                        icon.classList.remove('fas');
                        icon.classList.add('far'); // Back to outline if possible, or just style reset
                        icon.style.color = ''; // Reset color
                    }
                }
            }
        });

        // If we are on favorites page, re-render the grid
        if (window.location.pathname.includes('favorites.html')) {
            renderFavoritesPage();
        }
    }
};

// Global function to render favorites page (exposed for inline script)
function renderFavoritesPage() {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    const favorites = FavoritesManager.getFavorites();
    grid.innerHTML = '';

    if (favorites.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="width: 100%; text-align: center; padding: 40px; color: #888;">
                <i class="far fa-heart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No Favorites Yet</h3>
                <p>Click the heart icon on any movie or channel to add it here.</p>
            </div>
        `;
        return;
    }

    favorites.forEach(item => {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.innerHTML = `
            <div class="channel-logo-box">
                <img src="${item.image}" alt="${item.title}">
                <div class="favorite-icon-overlay" onclick="FavoritesManager.removeFavorite('${item.id}')">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
            <div class="channel-info">
                <h3>${item.title}</h3>
                <p>${item.subtitle || 'Live Channel'}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initial UI Update on Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Favorites UI
    if (typeof FavoritesManager !== 'undefined') {
        FavoritesManager.updateUI();
    }

    // Initialize Connectivity Manager
    if (typeof ConnectivityManager !== 'undefined') {
        ConnectivityManager.init();
    }
});

// ============================================
// NETWORK CONNECTIVITY MANAGER
// ============================================
const ConnectivityManager = {
    init: function () {
        this.injectPopup();
        this.bindEvents();
        this.checkStatus();
    },

    injectPopup: function () {
        if (document.getElementById('network-popup')) return;

        const popupHTML = `
            <div id="network-popup" class="network-popup-overlay">
                <div class="network-popup-card">
                    <div class="network-popup-image-container">
                        <img src="images/network-error-1.png" alt="No Internet" id="network-popup-img">
                    </div>
                    <div class="network-popup-content">
                        <h2 class="network-popup-title" id="network-popup-title">No Internet Connection</h2>
                        <p class="network-popup-text" id="network-popup-msg">Please Check your network and try again</p>
                        
                        <div class="network-popup-actions">
                            <button class="btn-popup-primary" onclick="ConnectivityManager.tryAgain()">Try Again</button>
                            <button class="btn-popup-secondary" onclick="ConnectivityManager.openSettings()">Network Settings</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    },

    bindEvents: function () {
        window.addEventListener('online', () => {
            this.hidePopup();
        });

        window.addEventListener('offline', () => {
            this.showPopup();
        });
    },

    checkStatus: function () {
        if (!navigator.onLine) {
            this.showPopup();
        }
    },

    showPopup: function () {
        const popup = document.getElementById('network-popup');
        if (popup) {
            // Randomize content for "wow" factor
            const useVariant = Math.random() > 0.5;
            const img = document.getElementById('network-popup-img');
            const title = document.getElementById('network-popup-title');
            const msg = document.getElementById('network-popup-msg');
            const settingsBtn = document.querySelector('.btn-popup-secondary');

            if (useVariant) {
                img.src = 'images/network-error-2.png';
                title.innerText = "You don't seem to be connected";
                msg.innerText = "Something went wrong while trying to launch the channel";
                settingsBtn.innerText = "Go back to Home";
                settingsBtn.onclick = () => window.location.href = 'homepage.html';
            } else {
                img.src = 'images/network-error-1.png';
                title.innerText = "No Internet Connection";
                msg.innerText = "Please Check your network and try again";
                settingsBtn.innerText = "Network Settings";
                settingsBtn.onclick = () => ConnectivityManager.openSettings();
            }

            popup.style.display = 'flex';
        }
    },

    hidePopup: function () {
        const popup = document.getElementById('network-popup');
        if (popup) popup.style.display = 'none';
    },

    tryAgain: function () {
        if (navigator.onLine) {
            this.hidePopup();
        } else {
            // Shake effect
            const card = document.querySelector('.network-popup-card');
            card.style.transition = 'transform 0.1s';
            card.style.transform = 'translateX(10px)';
            setTimeout(() => card.style.transform = 'translateX(-10px)', 100);
            setTimeout(() => card.style.transform = 'translateX(0)', 200);
        }
    },

    openSettings: function () {
        window.location.href = 'settings.html#network';
    }
};

// ============================================
// PROFILE MANAGER
// ============================================
const ProfileManager = {
    init: function () {
        this.loadProfile();
        this.bindEvents();
    },

    loadProfile: function () {
        const savedProfile = localStorage.getItem('bbnl-current-profile') || 'alex';
        const savedAvatar = localStorage.getItem('bbnl-current-avatar') || 'https://i.pravatar.cc/150?u=alex';

        const avatarImg = document.getElementById('current-profile-avatar');
        if (avatarImg) {
            avatarImg.src = savedAvatar;
        }

        this.updateActiveProfileUI(savedProfile);
    },

    updateActiveProfileUI: function (profileName) {
        const profileItems = document.querySelectorAll('.profile-dropdown-item');
        profileItems.forEach(item => {
            const badge = item.querySelector('.profile-dropdown-badge');
            const check = item.querySelector('.profile-check');

            if (item.dataset.profile === profileName) {
                if (!badge) {
                    const newBadge = document.createElement('span');
                    newBadge.className = 'profile-dropdown-badge';
                    newBadge.textContent = 'Active';
                    item.querySelector('.profile-dropdown-info').appendChild(newBadge);
                }
                if (check) check.style.display = 'block';
            } else {
                if (badge) badge.remove();
                if (check) check.style.display = 'none';
            }
        });
    },

    bindEvents: function () {
        const menuContainer = document.querySelector('.profile-menu'); // Use class as some pages might lack ID
        const dropdown = document.getElementById('profile-dropdown');

        if (menuContainer && dropdown) {
            menuContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = dropdown.style.display === 'flex' || dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block'; // 'block' is safer for general dropdowns, check CSS
            });
        }

        const profileItems = document.querySelectorAll('.profile-dropdown-item');
        profileItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const profileName = item.dataset.profile;
                const avatarUrl = item.dataset.avatar;

                // Save
                localStorage.setItem('bbnl-current-profile', profileName);
                localStorage.setItem('bbnl-current-avatar', avatarUrl);

                // Update UI
                const avatarImg = document.getElementById('current-profile-avatar');
                if (avatarImg) avatarImg.src = avatarUrl;

                this.updateActiveProfileUI(profileName);

                // Close dropdown
                if (dropdown) dropdown.style.display = 'none';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (dropdown && dropdown.style.display !== 'none') {
                if (!dropdown.contains(e.target) && (!menuContainer || !menuContainer.contains(e.target))) {
                    dropdown.style.display = 'none';
                }
            }
        });
    }
};

// Initialize ProfileManager
document.addEventListener('DOMContentLoaded', () => {
    if (typeof ProfileManager !== 'undefined') {
        ProfileManager.init();
    }
});