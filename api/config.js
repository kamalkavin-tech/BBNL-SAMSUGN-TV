// ========================================================
// BBNL API CONFIGURATION - PRODUCTION (ES5 Compatible for Tizen)
// Per API Documentation: api-documentation (5).md
// ========================================================
/* global axios */
/* exported API_CONFIG, mapBBNLError, apiCall */

var API_CONFIG = {
    // Backend proxy URL (handles all BBNL communication)
    // Use PC's IP address for emulator/TV (localhost won't work on device)
    PROXY_URL: 'http://192.168.1.213:3000/api',

    // USER CREDENTIALS - From API Documentation
    // Per docs: userid and mobile are SEPARATE fields
    // POST /login body: {"userid":"testiser1","mobile":"7800000001"}
    USER_CREDENTIALS: {
        userid: 'testiser1',     // BBNL username (from docs example)
        mobile: '7800000001'     // 10-digit mobile (from docs: 7800000001)
    },

    // Device information (from API documentation)
    // Note: IP address should come from backend (client IP detection)
    // MAC address retrieved from Tizen webapis at runtime
    DEVICE_INFO: {
        ip_address: '192.168.101.110',  // Updated by getDeviceInfo() at runtime
        mac_address: '68:1D:EF:14:6C:21' // Updated by getDeviceInfo() at runtime
    },

    // Ads configuration
    ADS_CONFIG: {
        adclient: 'fofi',
        srctype: 'image',
        displayarea: 'homepage',
        displaytype: 'multiple'
    }
};

// ========================================================
// UNIFIED API CALL HELPER (ES5 Compatible)
// ========================================================

/**
 * Universal API call function for all BBNL endpoints
 * @param {string} endpoint - API endpoint name (e.g., 'login', 'chnl_list')
 * @param {object} payload - Request payload
 * @returns {Promise} API response data
 */
function apiCall(endpoint, payload) {
    payload = payload || {};

    // Check network status first (ES5 compatible)
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        var networkError = new Error('No Internet Connection');
        networkError.isNetworkError = true;
        return Promise.reject(networkError);
    }

    return axios.post(
        API_CONFIG.PROXY_URL + '/' + endpoint,
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000 // 15 second timeout
        }
    ).then(function (response) {
        var data = response.data;
        var status = data.status || {};
        var errCode = status.err_code;
        var errMsg = status.err_msg || 'API request failed';

        // Check for BBNL API error
        if (errCode !== 0) {
            var error = new Error(errMsg);
            error.code = errCode;
            error.data = data;
            throw error;
        }

        return data;
    }, function (error) {
        var errorMsg = 'Unknown error';
        var isNetworkError = false;

        // Detect network/connection errors
        if (error.isNetworkError) {
            errorMsg = error.message;
            isNetworkError = true;
        } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            errorMsg = 'Connection timeout. Check your network.';
            isNetworkError = true;
        } else if (error.message && (
            error.message.indexOf('Network Error') !== -1 ||
            error.message.indexOf('net::ERR') !== -1 ||
            error.message.indexOf('Failed to fetch') !== -1 ||
            error.message.indexOf('ENOTFOUND') !== -1 ||
            error.message.indexOf('ECONNREFUSED') !== -1
        )) {
            errorMsg = 'No Internet Connection';
            isNetworkError = true;
        } else if (error.response && error.response.data && error.response.data.status) {
            errorMsg = error.response.data.status.err_msg || error.message;
        } else if (error.message) {
            errorMsg = error.message;
        }

        console.error('API Error [' + endpoint + ']: ' + errorMsg);

        var newError = new Error(errorMsg);
        newError.isNetworkError = isNetworkError;
        newError.originalError = error;
        throw newError;
    });
}

// ========================================================
// ERROR MAPPING UTILITY
// ========================================================

/**
 * Map BBNL API error messages to user-friendly messages
 * @param {string} msg - Original error message from API
 * @returns {string} User-friendly error message
 */
function mapBBNLError(msg) {
    var errorMap = {
        'Invalid User ID': 'User not registered. Please sign up.',
        'Failed to authenticate': 'Service temporarily unavailable. Please try again.',
        'User ID Deactivated!': 'Your account has been deactivated. Contact support.',
        'Please subscribe the channel to watch': 'Channel subscription required.',
        'Invalid OTP': 'Incorrect OTP. Please try again.',
        'OTP expired': 'OTP has expired. Request a new one.',
        'User not found': 'Mobile number not registered.',
        'Network error': 'Connection failed. Check your internet.',
        'BBNL API error': 'Service error. Please try again later.'
    };

    return errorMap[msg] || msg;
}

// ========================================================
// DEVICE INFORMATION RETRIEVAL (Tizen Compatible)
// ========================================================

/**
 * Get device information (MAC address, IP address, Device ID)
 * Uses Tizen webapis for MAC address retrieval
 * IP address should be obtained from backend
 * @returns {object} Device information
 */
function getDeviceInfo() {
    var deviceInfo = {
        mac_address: 'unknown',
        ip_address: 'unknown',
        device_id: 'unknown',
        device_model: 'Tizen TV',
        connection_type: 'unknown'
    };

    // Try to get MAC address from Tizen webapis
    try {
        if (typeof webapis !== 'undefined' && typeof webapis.network !== 'undefined') {
            // Try WiFi first
            try {
                var wifiMac = webapis.network.getMacAddress('WIFI');
                if (wifiMac && wifiMac !== '') {
                    deviceInfo.mac_address = wifiMac;
                    deviceInfo.connection_type = 'WiFi';
                    console.log('✓ WiFi MAC retrieved:', wifiMac);
                }
            } catch (e1) {
                console.log('WiFi MAC not available:', e1.message);
                // Try Ethernet
                try {
                    var ethernetMac = webapis.network.getMacAddress('ETHERNET');
                    if (ethernetMac && ethernetMac !== '') {
                        deviceInfo.mac_address = ethernetMac;
                        deviceInfo.connection_type = 'Ethernet';
                        console.log('✓ Ethernet MAC retrieved:', ethernetMac);
                    }
                } catch (e2) {
                    console.log('Ethernet MAC not available:', e2.message);
                }
            }
        } else {
            console.warn('⚠️ webapis.network not available - not running on Tizen TV');
        }
    } catch (e) {
        console.error('Error retrieving MAC address:', e);
    }

    // Try to get Device ID
    try {
        if (typeof webapis !== 'undefined' && typeof webapis.tv !== 'undefined') {
            var deviceId = webapis.tv.getDeviceId();
            if (deviceId) {
                deviceInfo.device_id = deviceId;
                console.log('✓ Device ID retrieved:', deviceId);
            }
        }
    } catch (e) {
        console.log('Device ID not available:', e.message);
    }

    // IP address should be retrieved from backend
    // The backend can detect the client's IP from the request
    // This will be set when making API calls to the backend proxy
    
    console.log('Device Info:', deviceInfo);
    return deviceInfo;
}

/**
 * Initialize device information on app startup
 * This should be called early in the app lifecycle
 */
function initializeDeviceInfo() {
    var deviceInfo = getDeviceInfo();
    
    // Update global config with retrieved info
    if (deviceInfo.mac_address !== 'unknown') {
        API_CONFIG.DEVICE_INFO.mac_address = deviceInfo.mac_address;
    }
    
    // IP address will be updated from backend response
    // Store connection type for reference
    API_CONFIG.CONNECTION_TYPE = deviceInfo.connection_type;
    API_CONFIG.DEVICE_ID = deviceInfo.device_id;
    
    return deviceInfo;
}
