# Samsung Tizen TV - BBNL IPTV Application

Complete IPTV streaming application for Samsung Tizen TV with HLS video playback, user authentication, and channel management.

---

## 📁 Project Structure

```
SAMSUGNMASTER/
│
├── 📄 HTML Pages (User Interface)
│   ├── index.html              # Login page - Mobile number entry
│   ├── verify.html             # OTP verification page
│   ├── homepage.html           # Main dashboard after login
│   ├── player.html             # Video player with HLS streaming
│   ├── tv-channels.html        # TV channel list and categories
│   ├── movies.html             # Movies library
│   ├── shows.html              # TV shows library
│   ├── favorites.html          # User favorites
│   ├── profiles.html           # User profile management
│   ├── manage-profiles.html    # Profile settings
│   ├── settings.html           # App settings
│   ├── notifications.html      # User notifications
│   ├── subscriptions.html      # Subscription plans
│   ├── subscription-expired.html # Subscription expiry notice
│   ├── parental-controls.html  # Parental control settings
│   ├── apps.html               # Installed apps
│   ├── help-desk.html          # Help and support
│   ├── give-feedback.html      # User feedback form
│   ├── network.html            # Network diagnostics
│   ├── device-verify.html      # Device verification
│   ├── device-verify-failed.html # Device verification failed
│   ├── new-verify.html         # Alternative verification page
│   └── invalid-mobile.html     # Invalid mobile error page
│
├── 📂 api/                     # API Integration Layer
│   ├── config.js               # API configuration and endpoints
│   ├── auth.js                 # Authentication API (Login, OTP)
│   ├── channels.js             # Channel and category APIs
│   └── ads.js                  # Advertisement APIs
│
├── 📂 css/                     # Stylesheets
│   ├── style.css               # Main application styles
│   ├── colors.css              # Color theme definitions
│   ├── base/                   # Base styles
│   │   ├── reset.css           # CSS reset
│   │   └── variable.css        # CSS variables
│   ├── componentes/            # Component styles
│   │   ├── buttons.css         # Button styles
│   │   ├── cards.css           # Card components
│   │   └── forms.css           # Form elements
│   ├── layout/                 # Layout styles
│   │   ├── header.css          # Header navigation
│   │   └── sidebar.css         # Sidebar navigation
│   └── pages/                  # Page-specific styles
│       ├── apps.css            # Apps page
│       ├── auth.css            # Authentication pages
│       ├── favorites.css       # Favorites page
│       ├── homepages.css       # Homepage dashboard
│       ├── notifications.css   # Notifications page
│       ├── profile.css         # Profile pages
│       ├── settings.css        # Settings page
│       └── subscription.css    # Subscription pages
│
├── 📂 images/                  # Application images and assets
├── 📂 js/                      # JavaScript files
│   └── script.js               # Common utility scripts
│
├── 📄 config.xml               # Tizen TV app configuration
├── 📄 API_REQUIREMENTS.md      # API requirements documentation
├── 📄 CORS_FIXED.md            # CORS error solution guide
└── 📄 README.md                # This file

```

---

## 🔧 Core Files Explained

### **API Layer** (`api/` folder)

#### **1. api/config.js**
**Purpose**: Central configuration for all API endpoints and headers

**Features**:
- API base URLs configuration
- Authorization headers
- Device headers (devslno, devmac)
- CORS proxy for development
- Helper methods for headers

**Usage**:
```javascript
const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LOGIN);
const headers = API_CONFIG.getAuthHeaders();
```

**Configuration**:
```javascript
AUTH_BASE_URL: 'http://124.40.244.211/netmon/cabletvapis'
ADS_BASE_URL: 'https://bbnlnetmon.bbnl.in/prod/cabletvapis'
AUTH_HEADER: 'Basic Zm9maWxhYkBnbWFpbC5jb206MTIzNDUtNTQzMjE='
USE_PROXY: true (set false on Samsung TV)
```

---

#### **2. api/auth.js**
**Purpose**: User authentication and session management

**Functions**:
- `requestOTP(mobile)` - Send OTP to mobile number
- `verifyOTP(mobile, otpCode)` - Verify OTP and login
- `getUserData()` - Get current user session
- `isAuthenticated()` - Check login status
- `logout()` - Clear user session
- `getDeviceInfo()` - Get device parameters

**Device Info Sent**:
```javascript
{
  mac_address: '26:F2:AE:D8:3F:99',
  device_name: 'rk3368_box',
  ip_address: '124.40.244.233',
  device_type: 'FOFI'
}
```

**Used By**: 
- [index.html](index.html) - Login page
- [verify.html](verify.html) - OTP verification
- All protected pages

---

#### **3. api/channels.js**
**Purpose**: Channel categories and channel data retrieval

**Functions**:
- `getCategories(userid)` - Get channel categories
- `getChannels(userid, userphone)` - Get all channels
- `getSubscribedChannels(userid, userphone)` - Filter subscribed channels
- `getChannelsByCategory(userid, userphone, category)` - Filter by category

**API Endpoints**:
- `/chnl_categlist` - Channel categories
- `/chnl_data` - Channel data

**Used By**: 
- [tv-channels.html](tv-channels.html)
- [homepage.html](homepage.html)
- [player.html](player.html)

---

#### **4. api/ads.js**
**Purpose**: Advertisement content for homepage and player

**Functions**:
- `getAds()` - Get general ads
- `getIPTVAds(userphone)` - Get IPTV-specific ads

**Features**:
- Dual content-type support (JSON + form-encoded)
- Automatic fallback mechanism
- Requires devmac header

**Used By**: 
- [homepage.html](homepage.html)
- [player.html](player.html)

---

### **HTML Pages**

#### **Authentication Flow**

**1. index.html** - Login Page
- Mobile number input (10 digits)
- OTP request functionality
- Validates mobile format
- Redirects to verify.html

**Dependencies**: `api/config.js`, `api/auth.js`

---

**2. verify.html** - OTP Verification
- 4-digit OTP input
- Auto-focus on input fields
- Resend OTP functionality
- Device info submission
- Redirects to homepage.html on success

**Dependencies**: `api/config.js`, `api/auth.js`

---

#### **Main Application**

**3. homepage.html** - Main Dashboard
- User welcome screen
- Channel categories
- Advertisement display
- Navigation to all sections

**Dependencies**: `api/channels.js`, `api/ads.js`

---

**4. player.html** - Video Player
- HLS video streaming
- Samsung AVPlay API integration
- HLS.js fallback for browsers
- Playback controls
- Quality selection

**Technology**:
- Samsung webapis.avplay (Tizen TV)
- HLS.js (Browser fallback)

**Dependencies**: HLS.js CDN, Samsung webapis

---

**5. tv-channels.html** - Channel List
- Display all channels
- Category filtering
- Channel search
- Subscription status
- Play button redirect to player

**Dependencies**: `api/channels.js`

---

#### **User Management**

**6. profiles.html** - Profile Selection
- Multiple profile support
- Profile switching
- Profile creation

**7. manage-profiles.html** - Profile Settings
- Edit profile details
- Avatar selection
- Profile deletion

**8. parental-controls.html** - Parental Controls
- Content restrictions
- PIN protection
- Age ratings

---

#### **Content Pages**

**9. movies.html** - Movies Library
- Movie catalog
- Genre filtering
- Search functionality

**10. shows.html** - TV Shows
- Show listings
- Episode management
- Continue watching

**11. favorites.html** - User Favorites
- Saved channels
- Favorite shows/movies
- Quick access

---

#### **Settings & Support**

**12. settings.html** - App Settings
- Display settings
- Audio settings
- Network settings
- Account management

**13. notifications.html** - Notifications
- System notifications
- Updates
- Alerts

**14. subscriptions.html** - Subscription Management
- Current plan details
- Upgrade/downgrade options
- Payment history

**15. subscription-expired.html** - Expiry Notice
- Subscription renewal prompt
- Payment options

**16. help-desk.html** - Help & Support
- FAQ section
- Contact support
- Troubleshooting guides

**17. give-feedback.html** - User Feedback
- Feedback form
- Rating system
- Issue reporting

---

#### **Diagnostics**

**18. network.html** - Network Diagnostics
- Connection status
- Speed test
- Network troubleshooting

**19. device-verify.html** - Device Verification
- Device registration
- MAC address verification

**20. device-verify-failed.html** - Verification Failed
- Error messages
- Retry options

---

### **JavaScript Files**

**js/script.js** - Common Utilities
- Shared functions
- Navigation helpers
- Utility methods
- Event handlers

---

### **CSS Architecture**

#### **Base Styles**
- `css/base/reset.css` - Browser default resets
- `css/base/variable.css` - CSS custom properties

#### **Component Styles**
- `css/componentes/buttons.css` - Button components
- `css/componentes/cards.css` - Card layouts
- `css/componentes/forms.css` - Form elements

#### **Layout Styles**
- `css/layout/header.css` - Header navigation
- `css/layout/sidebar.css` - Sidebar menu

#### **Page Styles**
- Individual CSS files for each page type
- Modular and maintainable

#### **Theme**
- `css/colors.css` - Color palette
- `css/style.css` - Main stylesheet

---

## 🚀 Getting Started

### **1. Development Testing (Browser)**

```bash
# Open with live server
# Set USE_PROXY: true in api/config.js
```

**CORS Proxy Enabled**: For testing in browser environment

---

### **2. Samsung TV Deployment**

```bash
# Set USE_PROXY: false in api/config.js
# Package using Tizen Studio
# Install on Samsung TV
```

**No CORS Issues**: App runs locally on TV

---

## 🔐 Authentication Flow

```
1. User enters mobile number (index.html)
   ↓
2. API sends OTP (api/auth.js → requestOTP)
   ↓
3. User enters OTP (verify.html)
   ↓
4. API verifies OTP with device info (api/auth.js → verifyOTP)
   ↓
5. Session stored in localStorage
   ↓
6. Redirect to homepage.html
```

---

## 📡 API Endpoints

### **Authentication**
- `POST /login` - Request OTP
- `POST /loginOtp` - Verify OTP

### **Channels**
- `POST /chnl_categlist` - Get categories
- `POST /chnl_data` - Get channels

### **Advertisements**
- `POST /ads` - General ads
- `POST /iptvads` - IPTV ads

---

## 🔑 Required Headers

**All Requests**:
```javascript
Authorization: Basic Zm9maWxhYkBnbWFpbC5jb206MTIzNDUtNTQzMjE=
devslno: FOFI20191129000336
Content-Type: application/json
```

**Ads Requests** (Additional):
```javascript
devmac: 68:1D:EF:14:6C:21
```

---

## 💾 LocalStorage Data

**Stored After Login**:
- `userId` - User ID
- `userPhone` - Mobile number
- `bbnl_authenticated` - Login status
- `bbnl_login_time` - Login timestamp
- `device_mac` - Device MAC address

---

## 🎯 Key Features

✅ **Modern ES6+ JavaScript**
- `const`/`let` instead of `var`
- `async`/`await` instead of callbacks
- Arrow functions
- Template literals
- Optional chaining

✅ **HLS Video Streaming**
- Samsung AVPlay API
- HLS.js fallback
- Quality selection
- Playback controls

✅ **Mobile-Only Authentication**
- Simplified login flow
- OTP verification
- Device registration
- Session management

✅ **Modular API Layer**
- Organized structure
- Reusable functions
- Error handling
- CORS proxy support

---

## 🐛 Troubleshooting

### **CORS Error in Browser**
**Solution**: Set `USE_PROXY: true` in [api/config.js](api/config.js)

### **Network Error**
**Check**: 
1. Server accessibility (http://124.40.244.211)
2. Internet connection
3. Firewall settings

### **OTP Not Received**
**Verify**:
1. Mobile number format (10 digits)
2. API response in console (F12)
3. Server status

---

## 📚 Documentation Files

- **API_REQUIREMENTS.md** - Complete API documentation
- **CORS_FIXED.md** - CORS error solutions
- **README.md** - This file

---

## 🔄 File Dependencies

```
index.html
  └── api/config.js
  └── api/auth.js

verify.html
  └── api/config.js
  └── api/auth.js

homepage.html
  └── api/config.js
  └── api/channels.js
  └── api/ads.js

tv-channels.html
  └── api/config.js
  └── api/channels.js

player.html
  └── HLS.js (CDN)
  └── Samsung webapis
```

---

## 📱 Device Configuration

**MAC Address**: `26:F2:AE:D8:3F:99`  
**Device Name**: `rk3368_box`  
**IP Address**: `124.40.244.233`  
**Device Type**: `FOFI`

All configured in [api/auth.js](api/auth.js) → `getDeviceInfo()`

---

## 🎨 Technology Stack

- **Frontend**: HTML5, CSS3, Modern JavaScript (ES6+)
- **Video**: HLS.js, Samsung AVPlay
- **API**: REST APIs, JSON
- **Storage**: LocalStorage
- **Platform**: Samsung Tizen TV

---

## 📝 Notes

1. **Development**: Use CORS proxy (`USE_PROXY: true`)
2. **Production**: Disable proxy (`USE_PROXY: false`)
3. **TV Deployment**: Package with Tizen Studio
4. **Browser Support**: Modern browsers with ES6+ support

---

## 🎯 Quick Start Checklist

- [ ] Open [index.html](index.html) in browser
- [ ] Enter mobile number
- [ ] Receive OTP
- [ ] Enter OTP in [verify.html](verify.html)
- [ ] Access [homepage.html](homepage.html)
- [ ] Browse channels in [tv-channels.html](tv-channels.html)
- [ ] Play video in [player.html](player.html)

---

**Version**: 1.0  
**Platform**: Samsung Tizen TV  
**Date**: December 2025  
**Status**: Ready for Testing ✅
