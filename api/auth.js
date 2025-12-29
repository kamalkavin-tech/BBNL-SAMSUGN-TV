// ========================================================
// BBNL AUTHENTICATION API - PRODUCTION (ES5 Compatible for Tizen)
// Per API Documentation: api-documentation (5).md
// ========================================================

var AuthAPI = {
    /**
     * Request OTP - Send OTP to mobile number
     * Per docs: POST /login with {"userid":"testiser1","mobile":"9876543210"}
     * @param {string} userid - User ID (separate from mobile)
     * @param {string} mobile - 10 digit mobile number
     * @returns {Promise}
     */
    requestOTP: function(userid, mobile) {
        // Use provided values or fall back to config
        var userIdToUse = userid || API_CONFIG.USER_CREDENTIALS.userid;
        var mobileToUse = mobile || API_CONFIG.USER_CREDENTIALS.mobile;
        
        console.log('Requesting OTP for userid:', userIdToUse, 'mobile:', mobileToUse);
        
        // Demo mode - skip API call and simulate success
        if (API_CONFIG.DEMO_MODE) {
            console.log('DEMO MODE: Simulating OTP sent');
            localStorage.setItem('pending_mobile', mobileToUse);
            localStorage.setItem('pending_userid', userIdToUse);
            localStorage.setItem('demo_otp', '1234');
            localStorage.setItem('bbnl_pending_otp', '1234');
            return Promise.resolve({
                success: true,
                message: 'OTP sent successfully (Demo Mode - use 1234)',
                data: { status: { err_code: 0, err_msg: 'OTP sent' }, otp: '1234' }
            });
        }
        
        // Per API docs: only userid and mobile required for login
        return apiCall('login', {
            userid: userIdToUse,
            mobile: mobileToUse
        }).then(function(data) {
            localStorage.setItem('pending_mobile', mobileToUse);
            localStorage.setItem('pending_userid', userIdToUse);
            
            // Store the OTP from API response for verification
            // The API may return OTP in different fields
            var receivedOtp = data.otp || data.otpcode || (data.data && data.data.otp) || '1234';
            localStorage.setItem('bbnl_pending_otp', receivedOtp);
            localStorage.setItem('demo_otp', receivedOtp);
            console.log('OTP stored for verification:', receivedOtp);
            
            var statusMsg = (data.status && data.status.err_msg) ? data.status.err_msg : 'OTP sent successfully';
            
            return {
                success: true,
                message: statusMsg,
                data: data
            };
        }).catch(function(error) {
            console.error('OTP request failed:', error);
            
            // If API fails, fall back to demo OTP for testing
            // Store default OTP so verification can work
            localStorage.setItem('bbnl_pending_otp', '1234');
            localStorage.setItem('demo_otp', '1234');
            console.log('API failed, using default OTP: 1234');
            
            return {
                success: false,
                message: mapBBNLError(error.message),
                error: error
            };
        });
    },

    /**
     * Verify OTP - Login with OTP code
     * Per docs: POST /loginOtp with {"userid":"testiser1","mobile":"9876543210","otpcode":"1234"}
     * @param {string} userid - User ID
     * @param {string} mobile - 10 digit mobile number
     * @param {string} otpcode - OTP code received
     * @returns {Promise}
     */
    verifyOTP: function(userid, mobile, otpcode) {
        // Use provided values or fall back to stored/config values
        var userIdToUse = userid || localStorage.getItem('pending_userid') || API_CONFIG.USER_CREDENTIALS.userid;
        var mobileToUse = mobile || localStorage.getItem('pending_mobile') || API_CONFIG.USER_CREDENTIALS.mobile;
        
        console.log('Verifying OTP for userid:', userIdToUse, 'mobile:', mobileToUse, 'OTP entered:', otpcode);
        
        // Get the stored OTP (either from demo mode or actual API response)
        var storedOtp = localStorage.getItem('demo_otp') || localStorage.getItem('bbnl_pending_otp') || '1234';
        
        // Demo mode - verify with stored OTP
        if (API_CONFIG.DEMO_MODE) {
            console.log('DEMO MODE: Comparing entered OTP:', otpcode, 'with stored OTP:', storedOtp);
            
            if (otpcode === storedOtp) {
                console.log('DEMO MODE: OTP verified successfully');
                // Store authentication state
                localStorage.setItem('userId', userIdToUse);
                localStorage.setItem('userPhone', mobileToUse);
                localStorage.setItem('bbnl_authenticated', 'true');
                localStorage.setItem('bbnl_otp_verified', 'true');
                localStorage.setItem('bbnl_login_time', new Date().getTime().toString());
                // Clean up pending data
                localStorage.removeItem('pending_mobile');
                localStorage.removeItem('pending_userid');
                localStorage.removeItem('demo_otp');
                localStorage.removeItem('bbnl_pending_otp');
                localStorage.removeItem('bbnl_otp_sent_time');
                return Promise.resolve({
                    success: true,
                    message: 'Login successful (Demo Mode)',
                    data: { status: { err_code: 0, err_msg: 'OK' }, userid: userIdToUse }
                });
            } else {
                console.log('DEMO MODE: Invalid OTP - entered:', otpcode, 'expected:', storedOtp);
                return Promise.resolve({
                    success: false,
                    message: 'Invalid OTP. Please enter the correct 4-digit code (Demo: use 1234)',
                    error: new Error('Invalid OTP')
                });
            }
        }
        
        // Production mode - ALWAYS verify OTP matches stored value first
        // This is a client-side check before calling API
        console.log('Production Mode: Verifying OTP locally first');
        console.log('   Entered OTP:', otpcode);
        console.log('   Stored OTP:', storedOtp);
        
        if (otpcode !== storedOtp) {
            console.log('OTP mismatch - entered:', otpcode, 'expected:', storedOtp);
            return Promise.resolve({
                success: false,
                message: 'Invalid OTP. Please enter the correct 4-digit code.',
                error: new Error('Invalid OTP')
            });
        }
        
        // OTP matches locally, now verify with server
        console.log('Local OTP verification passed, calling API...');
        
        // Per API docs: userid, mobile, otpcode required
        return apiCall('loginOtp', {
            userid: userIdToUse,
            mobile: mobileToUse,
            otpcode: otpcode
        }).then(function(data) {
            var status = data.status || {};
            // Check for successful response (err_code = 0)
            if (status.err_code === 0) {
                // Store user session (per docs: store userPhone and userId)
                localStorage.setItem('userId', data.userid || userIdToUse);
                localStorage.setItem('userPhone', mobileToUse);
                localStorage.setItem('bbnl_authenticated', 'true');
                localStorage.setItem('bbnl_otp_verified', 'true');
                localStorage.setItem('bbnl_login_time', new Date().getTime().toString());
                // Clean up pending data
                localStorage.removeItem('pending_mobile');
                localStorage.removeItem('pending_userid');
                localStorage.removeItem('bbnl_pending_otp');
                localStorage.removeItem('demo_otp');
                localStorage.removeItem('bbnl_otp_sent_time');
                
                console.log('Login successful, userId:', data.userid || userIdToUse);
                
                return {
                    success: true,
                    message: 'Login successful',
                    data: data
                };
            } else {
                // OTP verification failed at server
                var errMsg = status.err_msg || 'OTP verification failed';
                return {
                    success: false,
                    message: errMsg,
                    data: data
                };
            }
        }).catch(function(error) {
            console.error('OTP verification failed:', error);
            // IMPORTANT: On any error, return failure - never allow bypass
            return {
                success: false,
                message: error.message || 'OTP verification failed. Please try again.',
                error: error
            };
        });
    },

    /**
     * Get user data from localStorage (per docs: subsequent calls require userId and userPhone)
     */
    getUserData: function() {
        return {
            userId: localStorage.getItem('userId'),
            userPhone: localStorage.getItem('userPhone'),
            isAuthenticated: localStorage.getItem('bbnl_authenticated') === 'true' && 
                             localStorage.getItem('bbnl_otp_verified') === 'true'
        };
    },
    
    /**
     * Check if user is authenticated (both auth flag AND OTP verified)
     */
    isAuthenticated: function() {
        return localStorage.getItem('bbnl_authenticated') === 'true' && 
               localStorage.getItem('bbnl_otp_verified') === 'true';
    },
    
    /**
     * Logout user and clear session
     */
    logout: function() {
        // Clear all session data
        localStorage.removeItem('userId');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('bbnl_authenticated');
        localStorage.removeItem('bbnl_otp_verified');
        localStorage.removeItem('bbnl_login_time');
        localStorage.removeItem('bbnl_otp_sent_time');
        localStorage.removeItem('bbnl_pending_otp');
        localStorage.removeItem('pending_mobile');
        localStorage.removeItem('pending_userid');
        localStorage.removeItem('demo_otp');
        sessionStorage.removeItem('bbnl_mobile');
        
        console.log('User logged out');
        return Promise.resolve({ success: true });
    },
    
    /**
     * Check if login is required (for protected pages)
     */
    requireAuth: function() {
        if (!AuthAPI.isAuthenticated()) {
            console.warn('Authentication required - OTP not verified');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};
