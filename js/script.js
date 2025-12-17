// ========================================================
// BBNL STREAMING PLATFORM - GLOBAL JAVASCRIPT (ES5 TIZEN SAFE)
// ========================================================

// -------------------- THEME MANAGER --------------------
function initializeTheme() {
    var savedTheme = localStorage.getItem('bbnl-theme') || 'dark';
    var body = document.body;

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }

    var toggles = document.querySelectorAll('.theme-toggle-input');
    Array.prototype.forEach.call(toggles, function (t) {
        t.checked = (savedTheme === 'dark');
    });
}

function setupThemeToggle() {
    var toggles = document.querySelectorAll('.theme-toggle-input');

    Array.prototype.forEach.call(toggles, function (toggle) {
        toggle.addEventListener('change', function (e) {
            var isDark = e.target.checked;
            var body = document.body;
            var theme = isDark ? 'dark' : 'light';

            if (isDark) {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
            } else {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
            }

            localStorage.setItem('bbnl-theme', theme);

            Array.prototype.forEach.call(toggles, function (t) {
                if (t !== e.target) {
                    t.checked = isDark;
                }
            });
        });
    });
}


// -------------------- FAVORITES MANAGER --------------------
var FavoritesManager = {
    STORAGE_KEY: 'bbnl-favorites',

    getFavorites: function () {
        var stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    addFavorite: function (item) {
        var list = this.getFavorites();
        var exists = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === item.id) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            list.push(item);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
            this.updateUI();
            return true;
        }
        return false;
    },

    removeFavorite: function (id) {
        var list = this.getFavorites();
        var newList = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].id !== id) {
                newList.push(list[i]);
            }
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newList));
        this.updateUI();
    },

    isFavorite: function (id) {
        var list = this.getFavorites();
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                return true;
            }
        }
        return false;
    },

    toggleFavorite: function (item) {
        if (this.isFavorite(item.id)) {
            this.removeFavorite(item.id);
            return false;
        } else {
            this.addFavorite(item);
            return true;
        }
    },

    updateUI: function () {
        var self = this;
        var buttons = document.querySelectorAll('.favorite-btn, .favorite-icon-overlay');

        Array.prototype.forEach.call(buttons, function (btn) {
            var id = btn.getAttribute('data-id');
            if (!id) {
                return;
            }

            var icon = btn.querySelector('i');
            var active = self.isFavorite(id);

            if (active) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }

            if (icon) {
                if (active) {
                    icon.className = 'fas fa-heart';
                    icon.style.color = '#ff0000';
                } else {
                    icon.className = 'far fa-heart';
                    icon.style.color = '';
                }
            }
        });

        if (window.location.pathname.indexOf('favorites.html') !== -1) {
            renderFavoritesPage();
        }
    }
};


// -------------------- RENDER FAVORITES PAGE --------------------
function renderFavoritesPage() {
    var grid = document.getElementById('favorites-grid');
    if (!grid) {
        return;
    }

    var list = FavoritesManager.getFavorites();
    grid.innerHTML = '';

    if (!list.length) {
        grid.innerHTML = '' +
            '<div style="text-align:center; padding:40px; color:#888;">' +
            '<i class="far fa-heart" style="font-size:48px; opacity:.5;"></i>' +
            '<h3>No Favorites Yet</h3>' +
            '<p>Click the heart icon to add favorites.</p>' +
            '</div>';
        return;
    }

    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var div = document.createElement('div');
        div.className = 'channel-card';

        div.innerHTML =
            '<div class="channel-logo-box">' +
                '<img src="' + item.image + '" alt="' + (item.title || '') + '">' +
                '<div class="favorite-icon-overlay" data-id="' + item.id + '" onclick="FavoritesManager.removeFavorite(\'' + item.id + '\')">' +
                    '<i class="fas fa-heart"></i>' +
                '</div>' +
            '</div>' +
            '<div class="channel-info">' +
                '<h3>' + item.title + '</h3>' +
                '<p>' + (item.subtitle || 'Live Channel') + '</p>' +
            '</div>';

        grid.appendChild(div);
    }
}


// -------------------- CONNECTIVITY MANAGER --------------------
var ConnectivityManager = {
    init: function () {
        this.injectPopup();
        this.bindEvents();
        this.checkStatus();
    },

    injectPopup: function () {
        if (document.getElementById('network-popup')) {
            return;
        }

        var html =
            '<div id="network-popup" class="network-popup-overlay">' +
                '<div class="network-popup-card">' +
                    '<div class="network-popup-image-container">' +
                        '<img src="images/network-error-1.png" id="network-popup-img" alt="Network Error">' +
                    '</div>' +
                    '<div class="network-popup-content">' +
                        '<h2 id="network-popup-title">No Internet Connection</h2>' +
                        '<p id="network-popup-msg">Please check your network and try again</p>' +
                        '<div class="network-popup-actions">' +
                            '<button class="btn-popup-primary" onclick="ConnectivityManager.tryAgain()">Try Again</button>' +
                            '<button class="btn-popup-secondary" id="popup-secondary-btn">Network Settings</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        document.body.insertAdjacentHTML('beforeend', html);
    },

    bindEvents: function () {
        var self = this;

        window.addEventListener('online', function () {
            self.hidePopup();
        });

        window.addEventListener('offline', function () {
            self.showPopup();
        });
    },

    checkStatus: function () {
        if (!navigator.onLine) {
            this.showPopup();
        }
    },

    showPopup: function () {
        var popup = document.getElementById('network-popup');
        if (!popup) {
            return;
        }

        var img = document.getElementById('network-popup-img');
        var title = document.getElementById('network-popup-title');
        var msg = document.getElementById('network-popup-msg');
        var btn = document.getElementById('popup-secondary-btn');

        var variant = Math.random() > 0.5;

        if (variant) {
            img.src = 'images/network-error-2.png';
            title.innerText = "You don't seem connected";
            msg.innerText = "Something went wrong while launching the channel";
            btn.innerText = "Go Back Home";
            btn.onclick = function () {
                window.location.href = 'homepage.html';
            };
        } else {
            img.src = 'images/network-error-1.png';
            title.innerText = "No Internet Connection";
            msg.innerText = "Please check your network and try again";
            btn.innerText = "Network Settings";
            btn.onclick = function () {
                ConnectivityManager.openSettings();
            };
        }

        popup.style.display = 'flex';
    },

    hidePopup: function () {
        var popup = document.getElementById('network-popup');
        if (popup) {
            popup.style.display = 'none';
        }
    },

    tryAgain: function () {
        if (navigator.onLine) {
            this.hidePopup();
            return;
        }

        var card = document.querySelector('.network-popup-card');
        if (!card) {
            return;
        }

        card.style.transition = 'transform 0.1s';
        card.style.transform = 'translateX(10px)';

        setTimeout(function () {
            card.style.transform = 'translateX(-10px)';
        }, 100);

        setTimeout(function () {
            card.style.transform = 'translateX(0)';
        }, 200);
    },

    openSettings: function () {
        window.location.href = 'settings.html#network';
    }
};


// -------------------- PROFILE MANAGER --------------------
var ProfileManager = {
    init: function () {
        this.loadProfile();
        this.bindEvents();
    },

    loadProfile: function () {
        var name = localStorage.getItem('bbnl-current-profile') || 'alex';
        var avatar = localStorage.getItem('bbnl-current-avatar') || 'https://i.pravatar.cc/150?u=alex';

        var img = document.getElementById('current-profile-avatar');
        if (img) {
            img.src = avatar;
        }

        this.updateActiveProfileUI(name);
    },

    updateActiveProfileUI: function (name) {
        var items = document.querySelectorAll('.profile-dropdown-item');

        Array.prototype.forEach.call(items, function (item) {
            var isActive = item.getAttribute('data-profile') === name;
            var badge = item.querySelector('.profile-dropdown-badge');
            var check = item.querySelector('.profile-check');

            if (isActive) {
                if (!badge) {
                    var info = item.querySelector('.profile-dropdown-info');
                    var b = document.createElement('span');
                    b.className = 'profile-dropdown-badge';
                    b.innerHTML = 'Active';
                    if (info) {
                        info.appendChild(b);
                    }
                }
                if (check) {
                    check.style.display = 'block';
                }
            } else {
                if (badge && badge.parentNode) {
                    badge.parentNode.removeChild(badge);
                }
                if (check) {
                    check.style.display = 'none';
                }
            }
        });
    },

    bindEvents: function () {
        var self = this;
        var menu = document.querySelector('.profile-menu');
        var dropdown = document.getElementById('profile-dropdown');

        if (menu && dropdown) {
            menu.addEventListener('click', function (e) {
                e.stopPropagation();
                var isVisible = dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block';
            });
        }

        var profileItems = document.querySelectorAll('.profile-dropdown-item');

        Array.prototype.forEach.call(profileItems, function (item) {
            item.addEventListener('click', function (e) {
                e.stopPropagation();

                var name = item.getAttribute('data-profile');
                var avatar = item.getAttribute('data-avatar');

                localStorage.setItem('bbnl-current-profile', name);
                localStorage.setItem('bbnl-current-avatar', avatar);

                var img = document.getElementById('current-profile-avatar');
                if (img) {
                    img.src = avatar;
                }

                self.updateActiveProfileUI(name);

                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (dropdown && dropdown.style.display === 'block') {
                var clickInsideDropdown = dropdown.contains(e.target);
                var clickInsideMenu = menu && menu.contains(e.target);

                if (!clickInsideDropdown && !clickInsideMenu) {
                    dropdown.style.display = 'none';
                }
            }
        });
    }
};


// -------------------- INIT ALL MANAGERS --------------------
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    setupThemeToggle();
    FavoritesManager.updateUI();
    ConnectivityManager.init();
    ProfileManager.init();
});

// -------------------- SAMSUNG TV REMOTE CONTROL MANAGER --------------------
document.addEventListener('DOMContentLoaded', function () {
    // Register all common Samsung TV remote keys
    var samsungKeys = [
        "ColorF0Red", "ColorF1Green", "ColorF2Yellow", "ColorF3Blue",
        "MediaPlay", "MediaPause", "MediaStop", "MediaRewind", "MediaFastForward",
        "ChannelUp", "ChannelDown", "VolumeUp", "VolumeDown", "Mute",
        "Exit", "Return", "Enter", "Info", "Menu", "Guide", "Tools",
        "PictureSize", "Teletext", "Soccer", "Extra"
    ];

    samsungKeys.forEach(function(key) {
        try {
            tizen.tvinputdevice.registerKey(key);
        } catch (e) {
            console.error("Failed to register key:", key, e);
        }
    });

    // Handle all remote key events
    document.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 37: // LEFT
                console.log("Left arrow pressed");
                break;
            case 38: // UP
                console.log("Up arrow pressed");
                break;
            case 39: // RIGHT
                console.log("Right arrow pressed");
                break;
            case 40: // DOWN
                console.log("Down arrow pressed");
                break;
            case 13: // ENTER/OK
                console.log("OK button pressed");
                break;
            case 10009: // RETURN/BACK
                console.log("Back button pressed");
                break;
            case 403: // RED
                console.log("Red button pressed");
                break;
            case 404: // GREEN
                console.log("Green button pressed");
                break;
            case 405: // YELLOW
                console.log("Yellow button pressed");
                break;
            case 406: // BLUE
                console.log("Blue button pressed");
                break;
            case 415: // PLAY
                console.log("Play button pressed");
                break;
            case 19: // PAUSE
                console.log("Pause button pressed");
                break;
            case 412: // STOP
                console.log("Stop button pressed");
                break;
            case 413: // REWIND
                console.log("Rewind button pressed");
                break;
            case 417: // FAST FORWARD
                console.log("Fast forward button pressed");
                break;
            case 427: // CHANNEL UP
                console.log("Channel up pressed");
                break;
            case 428: // CHANNEL DOWN
                console.log("Channel down pressed");
                break;
            case 447: // VOLUME UP
                console.log("Volume up pressed");
                break;
            case 448: // VOLUME DOWN
                console.log("Volume down pressed");
                break;
            case 449: // MUTE
                console.log("Mute button pressed");
                break;
            case 10182: // EXIT
                console.log("Exit button pressed");
                break;
            case 10131: // INFO
                console.log("Info button pressed");
                break;
            case 10129: // MENU
                console.log("Menu button pressed");
                break;
            case 10140: // PICTURE SIZE
                console.log("Picture size button pressed");
                break;
            case 10200: // TELETEXT
                console.log("Teletext button pressed");
                break;
            case 10228: // SOCCER
                console.log("Soccer button pressed");
                break;
            case 10253: // EXTRA
                console.log("Extra button pressed");
                break;
            // Add more cases for other keys as needed
        }
    });
});
