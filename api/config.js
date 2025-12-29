// ========================================================
// BBNL API CONFIGURATION - PRODUCTION (ES5 Compatible for Tizen)
// Per API Documentation: api-documentation (5).md
// ========================================================

var API_CONFIG = {
    // Backend proxy URL (handles all BBNL communication)
    PROXY_URL: 'http://localhost:3000/api',
    
    // Demo mode - set to true to bypass API and use mock data for testing
    // Set to false for production with real BBNL credentials
    DEMO_MODE: false,
    
    // USER CREDENTIALS - From API Documentation
    // userid and mobile are SEPARATE values (userid is NOT the mobile number)
    // Example from docs: userid: "testiser1", mobile: "9876543210"
    USER_CREDENTIALS: {
        userid: 'testiser1',     // Your BBNL username (from registration)
        mobile: '7800000001'     // Your registered 10-digit mobile number
    },
    
    // Device information (from API documentation)
    DEVICE_INFO: {
        ip_address: '192.168.101.110',
        mac_address: '68:1D:EF:14:6C:21'
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
    
    return axios.post(
        API_CONFIG.PROXY_URL + '/' + endpoint,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
    ).then(function(response) {
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
    }).catch(function(error) {
        var errorMsg = 'Unknown error';
        if (error.response && error.response.data && error.response.data.status) {
            errorMsg = error.response.data.status.err_msg || error.message;
        } else if (error.message) {
            errorMsg = error.message;
        }
        console.error('API Error [' + endpoint + ']: ' + errorMsg);
        throw error;
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
