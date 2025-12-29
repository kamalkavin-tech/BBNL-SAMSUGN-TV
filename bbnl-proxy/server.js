const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// =============================
// BBNL API CONFIG (Per Documentation)
// =============================
// Auth/Channel APIs use this base URL
const AUTH_BASE_URL = 'http://124.40.244.211/netmon/cabletvapis';
// Ads API uses this base URL
const ADS_BASE_URL = 'https://bbnlnetmon.bbnl.in/prod/cabletvapis';

// Common headers for auth/channel APIs
const AUTH_HEADERS = {
  'Authorization': 'Basic Zm9maWxhYkBnbWFpbC5jb206MTIzNDUtNTQzMjE=',
  'Content-Type': 'application/json',
  'devslno': 'FOFI20191129000336'
};

// Headers for ads API (includes devmac)
const ADS_HEADERS = {
  'Authorization': 'Basic Zm9maWxhYkBnbWFpbC5jb206MTIzNDUtNTQzMjE=',
  'Content-Type': 'application/json',
  'devslno': 'FOFI20191129000336',
  'devmac': '68:1D:EF:14:6C:21'
};

// Ads endpoints that use the ADS_BASE_URL
const ADS_ENDPOINTS = ['iptvads', 'ads'];

// =============================
// HEALTH CHECK
// =============================
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: '✅ BBNL Production Proxy Server',
    auth_api: AUTH_BASE_URL,
    ads_api: ADS_BASE_URL,
    endpoints: 'POST /api/:endpoint (supports all BBNL APIs)'
  });
});

// =============================
// UNIVERSAL PROXY (ALL APIs)
// =============================
app.post('/api/:endpoint', async (req, res) => {
  const endpoint = req.params.endpoint;
  
  // Determine which base URL and headers to use
  const isAdsEndpoint = ADS_ENDPOINTS.includes(endpoint);
  const baseUrl = isAdsEndpoint ? ADS_BASE_URL : AUTH_BASE_URL;
  const headers = isAdsEndpoint ? ADS_HEADERS : AUTH_HEADERS;
  
  try {
    console.log(`📥 ${endpoint.toUpperCase()} Request:`, req.body);
    console.log(`🔗 Using: ${baseUrl}`);
    
    const response = await axios.post(
      `${baseUrl}/${endpoint}`,
      req.body,
      { 
        headers: headers,
        timeout: 15000
      }
    );
    
    console.log(`✅ ${endpoint.toUpperCase()} Response:`, response.data.status);
    res.json(response.data);
    
  } catch (err) {
    console.error(`❌ ${endpoint.toUpperCase()} Error:`, err.message);
    
    // Log full error for debugging
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    }
    
    res.status(500).json({
      body: [],
      status: {
        err_code: 1,
        err_msg: err.response?.data?.status?.err_msg || err.message || 'BBNL API error'
      }
    });
  }
});

// =============================
// START SERVER
// =============================
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`\n✅ BBNL Production Proxy Server Running`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`🔗 Auth/Channel API: ${AUTH_BASE_URL}`);
  console.log(`🔗 Ads API: ${ADS_BASE_URL}`);
  console.log(`\n📋 Universal Endpoint:`);
  console.log(`   POST /api/:endpoint`);
  console.log(`\n📝 Supported APIs:`);
  console.log(`   Auth: login, loginOtp, logout`);
  console.log(`   Channels: chnl_categlist, chnl_list, chnl_data, stream`);
  console.log(`   Ads: ads, iptvads`);
  console.log(`   Other: applock, allowedapps, profilelist, profileselect`);
  console.log(`\n🚀 Ready to handle all BBNL API requests!\n`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('\n⚠️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️ SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
