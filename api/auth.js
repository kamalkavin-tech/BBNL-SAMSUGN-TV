// ========================================================
// BBNL AUTHENTICATION API - PRODUCTION (ES5 Compatible for Tizen)
// Per API Documentation: api-documentation (5).md
// Requires: api/config.js to be loaded first
// ========================================================
/* global API_CONFIG, apiCall, mapBBNLError */

var AuthAPI = {
    /**
     * Request OTP - Send OTP to user's mobile number via SMS
     * Per docs: POST /login with {"userid":"testiser1","mobile":"9876543210"}
     * The OTP will be sent to the user's phone - NOT returned in API response
     * @param {string} userid - User ID (separate from mobile)
     * @param {string} mobile - 10 digit mobile number
     * @returns {Promise}
     */
    requestOTP: function (userid, mobile) {
        // Use provided values or fall back to config
        var userIdToUse = userid || API_CONFIG.USER_CREDENTIALS.userid;
        var mobileToUse = mobile || API_CONFIG.USER_CREDENTIALS.mobile;

        console.log('📱 Requesting OTP for userid:', userIdToUse, 'mobile:', mobileToUse);

        // Store pending credentials for verification step
        localStorage.setItem('pending_mobile', mobileToUse);
        localStorage.setItem('pending_userid', userIdToUse);

        // Call the login API - OTP will be sent to user's phone via SMS
        // Per API docs: POST /login with {"userid":"...","mobile":"..."}
        // Response: {"status":{"err_code":0,"err_msg":"OTP sent successfully"},"userid":"..."}
        return apiCall('login', {
            userid: userIdToUse,
            mobile: mobileToUse
        }).then(function (data) {
            console.log('✅ OTP Request Response:', data);

            // Per API docs: OTP is sent via SMS, not returned in response
            // Some dev environments may return OTP in body for testing
            var devOtp = null;
            if (data.body && data.body.length > 0 && data.body[0].otpcode) {
                devOtp = data.body[0].otpcode;
                console.log('🔐 DEV OTP (FOR TESTING ONLY):', devOtp);
            }

            // Per API docs: status.err_code === 0 means OTP sent successfully
            var statusMsg = (data.status && data.status.err_msg) ? data.status.err_msg : 'OTP sent successfully';

            return {
                success: true,
                message: statusMsg,
                otp: devOtp, // Only available in dev mode, null in production
                userid: data.userid || userIdToUse,
                data: data
            };
        }, function (error) {
            console.error('❌ OTP request failed:', error);

            // Clean up on failure
            localStorage.removeItem('pending_mobile');
            localStorage.removeItem('pending_userid');

            return {
                success: false,
                message: mapBBNLError(error.message),
                error: error
            };
        });
    },

    /**
     * Verify OTP - Login with OTP code received on phone
     * Per docs: POST /loginOtp with {"userid":"testiser1","mobile":"9876543210","otpcode":"1234"}
     * The server validates the OTP - no local validation needed
     * @param {string} userid - User ID
     * @param {string} mobile - 10 digit mobile number
     * @param {string} otpcode - OTP code received on phone via SMS
     * @returns {Promise}
     */
    verifyOTP: function (userid, mobile, otpcode) {
        // Use provided values or fall back to stored/config values
        var userIdToUse = userid || localStorage.getItem('pending_userid') || API_CONFIG.USER_CREDENTIALS.userid;
        var mobileToUse = mobile || localStorage.getItem('pending_mobile') || API_CONFIG.USER_CREDENTIALS.mobile;

        console.log('🔐 Verifying OTP for userid:', userIdToUse, 'mobile:', mobileToUse, 'OTP:', otpcode);

        // Validate OTP format before API call
        if (!otpcode || otpcode.length !== 4 || !/^\d{4}$/.test(otpcode)) {
            return Promise.resolve({
                success: false,
                message: 'Please enter a valid 4-digit OTP',
                error: new Error('Invalid OTP format')
            });
        }

        // Call loginOtp API - server validates the OTP
        return apiCall('loginOtp', {
            userid: userIdToUse,
            mobile: mobileToUse,
            otpcode: otpcode
        }).then(function (data) {
            console.log('✅ OTP Verification Response:', data);
            console.log('📊 Response status object:', data.status);
            console.log('📊 Error code:', data.status ? data.status.err_code : 'undefined');

            var status = data.status || {};

            // Per API docs: err_code === 0 means success
            // err_msg examples: "Authentication successful!", "Success"
            if (status.err_code === 0) {
                console.log('✅ OTP VERIFIED - Server confirmed success (err_code: 0)');

                // Store user session
                localStorage.setItem('userId', data.userid || userIdToUse);
                localStorage.setItem('userPhone', mobileToUse);
                localStorage.setItem('bbnl_authenticated', 'true');
                localStorage.setItem('bbnl_otp_verified', 'true');
                localStorage.setItem('bbnl_login_time', new Date().getTime().toString());

                // Clean up pending data
                localStorage.removeItem('pending_mobile');
                localStorage.removeItem('pending_userid');

                console.log('✅ Login successful, userId:', data.userid || userIdToUse);

                return {
                    success: true,
                    message: 'Login successful',
                    data: data
                };
            } else {
                // OTP verification failed at server
                var errMsg = status.err_msg || 'Invalid OTP. Please try again.';
                console.log('❌ Server rejected OTP - err_code:', status.err_code, 'message:', errMsg);

                // DO NOT store session on failure
                return {
                    success: false,
                    message: errMsg,
                    data: data
                };
            }
        }, function (error) {
            console.error('❌ OTP verification failed:', error);

            return {
                success: false,
                message: mapBBNLError(error.message) || 'OTP verification failed. Please try again.',
                error: error
            };
        });
    },

    /**
     * Get user data from localStorage
     */
    getUserData: function () {
        return {
            userId: localStorage.getItem('userId'),
            userPhone: localStorage.getItem('userPhone'),
            isAuthenticated: localStorage.getItem('bbnl_authenticated') === 'true' &&
                localStorage.getItem('bbnl_otp_verified') === 'true'
        };
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: function () {
        return localStorage.getItem('bbnl_authenticated') === 'true' &&
            localStorage.getItem('bbnl_otp_verified') === 'true';
    },

    /**
     * Logout user and clear session
     */
    logout: function () {
        // Clear all session data
        localStorage.removeItem('userId');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('bbnl_authenticated');
        localStorage.removeItem('bbnl_otp_verified');
        localStorage.removeItem('bbnl_login_time');
        localStorage.removeItem('pending_mobile');
        localStorage.removeItem('pending_userid');
        sessionStorage.removeItem('bbnl_mobile');

        console.log('👋 User logged out');
        return Promise.resolve({ success: true });
    },

    /**
     * Check if login is required (for protected pages)
     */
    requireAuth: function () {
        if (!AuthAPI.isAuthenticated()) {
            console.warn('⚠️ Authentication required - redirecting to login');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};
