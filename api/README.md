# BBNL API Integration

This folder contains all API integration files for the BBNL streaming platform.

## 📁 File Structure

```
api/
├── config.js      - API configuration (URLs, headers, endpoints)
├── auth.js        - Authentication APIs (login, OTP verification)
├── channels.js    - Channel APIs (categories, channel list)
└── ads.js         - Advertisement APIs (homepage slider)
```

## 🔧 Configuration (config.js)

Contains all API settings:
- **Base URLs**: Auth/Channel API and Ads API
- **Headers**: Authorization, device serial number, MAC address
- **Endpoints**: All API endpoint paths

## 🔐 Authentication API (auth.js)

### Methods:

#### `AuthAPI.requestOTP(userid, mobile)`
Request OTP for login.
```javascript
AuthAPI.requestOTP('testiser1', '9876543210')
    .then(function(result) {
        if (result.success) {
            console.log('OTP sent successfully');
        }
    });
```

#### `AuthAPI.verifyOTP(userid, mobile, otpcode)`
Verify OTP and login.
```javascript
AuthAPI.verifyOTP('testiser1', '9876543210', '1234')
    .then(function(result) {
        if (result.success) {
            console.log('Login successful');
            // Redirects to homepage
        }
    });
```

#### `AuthAPI.getUserData()`
Get stored user data from localStorage.
```javascript
var userData = AuthAPI.getUserData();
console.log(userData.userId, userData.userPhone);
```

#### `AuthAPI.isAuthenticated()`
Check if user is logged in.
```javascript
if (AuthAPI.isAuthenticated()) {
    // User is logged in
}
```

#### `AuthAPI.logout()`
Logout user and clear session.
```javascript
AuthAPI.logout();
```

## 📺 Channels API (channels.js)

### Methods:

#### `ChannelsAPI.getCategories()`
Get channel categories list.
```javascript
ChannelsAPI.getCategories()
    .then(function(result) {
        if (result.success) {
            console.log(result.categories);
        }
    });
```

#### `ChannelsAPI.getChannels()`
Get all channels for logged-in user.
```javascript
ChannelsAPI.getChannels()
    .then(function(result) {
        if (result.success) {
            console.log(result.channels);
        }
    });
```

#### `ChannelsAPI.getSubscribedChannels(channels)`
Filter only subscribed channels.
```javascript
var subscribed = ChannelsAPI.getSubscribedChannels(allChannels);
```

#### `ChannelsAPI.getChannelsByCategory(channels, grid)`
Filter channels by category.
```javascript
var newsChannels = ChannelsAPI.getChannelsByCategory(allChannels, '12');
```

## 📢 Ads API (ads.js)

### Methods:

#### `AdsAPI.getIPTVAds(options)`
Get ads for homepage slider.
```javascript
AdsAPI.getIPTVAds({
    srctype: 'image',
    displayarea: 'homepage',
    displaytype: 'multiple'
})
.then(function(result) {
    if (result.success) {
        console.log(result.ads); // Array of ad URLs
    }
});
```

## 🚀 Usage in HTML Files

### Include API files in your HTML:

```html
<!-- API Configuration -->
<script src="api/config.js"></script>

<!-- Include specific API modules you need -->
<script src="api/auth.js"></script>
<script src="api/channels.js"></script>
<script src="api/ads.js"></script>
```

### Example Usage:

```javascript
// Login
AuthAPI.requestOTP('testiser1', '9876543210')
    .then(function(result) {
        if (result.success) {
            // Show OTP input screen
        } else {
            alert(result.message);
        }
    });

// Get Channels (after login)
ChannelsAPI.getChannels()
    .then(function(result) {
        if (result.success) {
            result.channels.forEach(function(channel) {
                console.log(channel.chtitle, channel.streamlink);
            });
        }
    });
```

## 📝 API Response Format

All APIs return a consistent format:

### Success Response:
```javascript
{
    success: true,
    message: "Success message",
    data: { /* API response data */ }
}
```

### Error Response:
```javascript
{
    success: false,
    message: "Error message",
    error_code: 9
}
```

## 🔒 Authentication Required

The following APIs require user to be logged in:
- `ChannelsAPI.getCategories()`
- `ChannelsAPI.getChannels()`
- `AdsAPI.getIPTVAds()`

These APIs will check for `userId` and `userPhone` in localStorage.

## 📱 Session Storage

After successful login, the following are stored:
- `userId` - User ID
- `userPhone` - Mobile number
- `bbnl_authenticated` - Authentication status
- `bbnl_login_time` - Login timestamp

## 🌐 API Endpoints

### Auth/Channel API Base: `http://124.40.244.211/netmon/cabletvapis`
- POST `/login` - Request OTP
- POST `/loginOtp` - Verify OTP
- POST `/chnl_categlist` - Get categories
- POST `/chnl_data` - Get channels

### Ads API Base: `https://bbnlnetmon.bbnl.in/prod/cabletvapis`
- POST `/iptvads` - Get IPTV ads

## 🔑 Required Headers

All requests include:
- `Authorization: Basic Zm9maWxhYkBnbWFpbC5jb206MTIzNDUtNTQzMjE=`
- `devslno: FOFI20191129000336`
- `Content-Type: application/json`

Ads API additionally includes:
- `devmac: 68:1D:EF:14:6C:21`

---

**Last Updated:** December 24, 2025
