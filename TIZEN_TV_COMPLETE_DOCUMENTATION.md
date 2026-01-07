# Samsung Tizen TV Complete Development Documentation

## Table of Contents
1. [Overview](#overview)
2. [Web Engine Specifications](#web-engine-specifications)
3. [JavaScript Compatibility](#javascript-compatibility)
4. [Tizen Device APIs](#tizen-device-apis)
5. [Samsung Product APIs](#samsung-product-apis)
6. [AVPlay API Reference](#avplay-api-reference)
7. [TV Input Device API](#tv-input-device-api)
8. [Remote Control Handling](#remote-control-handling)
9. [Project Implementation Guide](#project-implementation-guide)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Tizen TV?
Tizen is Samsung's Linux-based operating system used in Smart TVs. Web applications for Tizen TV are built using HTML5, CSS3, and JavaScript with access to device-specific APIs through `webapis` and `tizen` namespaces.

### Key Development Resources
- **Samsung Developer Portal**: https://developer.samsung.com/smarttv
- **Tizen Documentation**: https://docs.tizen.org/application/web/
- **Web Engine Specs**: https://developer.samsung.com/smarttv/develop/specifications/web-engine-specifications.html

### Tizen TV Versions by Year
| TV Model Year | Tizen Version | Web Engine Version |
|---------------|---------------|-------------------|
| 2015 | Tizen 2.3 | Chromium 38 |
| 2016 | Tizen 2.4 | Chromium 47 |
| 2017 | Tizen 3.0 | Chromium 56 |
| 2018 | Tizen 4.0 | Chromium 63 |
| 2019 | Tizen 5.0 | Chromium 69 |
| 2020 | Tizen 5.5 | Chromium 76 |
| 2021 | Tizen 6.0 | Chromium 85 |
| 2022 | Tizen 6.5 | Chromium 94 |
| 2023 | Tizen 7.0 | Chromium 108 |
| 2024 | Tizen 8.0 | Chromium 120 |

---

## Web Engine Specifications

### HTML5 Supported Features
```html
<!-- Standard HTML5 Tags Supported -->
<video src="video.mp4" autoplay></video>
<audio src="audio.mp3" controls></audio>
<iframe src="page.html"></iframe>
<canvas id="myCanvas"></canvas>
<img src="image.jpg" />
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

### CSS Support
The Samsung TV Web engine supports extensive CSS features:

#### Core CSS Features
- **CSS 2.1**: Full support for box model, colors, backgrounds, fonts, text, tables, selectors
- **CSS 3**: 
  - Flexbox (`display: flex`)
  - Grid Layout (`display: grid`)
  - Transforms (`transform: rotate(), scale()`)
  - Transitions (`transition: all 0.3s ease`)
  - Animations (`@keyframes`)
  - Media Queries (`@media screen and (min-width: 1920px)`)
  - Custom Properties (`--variable-name`)
  - Filter Effects (`filter: blur(), brightness()`)
  - Gradients (`linear-gradient, radial-gradient`)

#### TV-Specific CSS Considerations
```css
/* Focus states for remote navigation */
.focusable:focus,
.remote-focused {
    outline: 3px solid #00ff00;
    outline-offset: 2px;
    transform: scale(1.05);
}

/* Hide scrollbars (no mouse on TV) */
::-webkit-scrollbar {
    display: none;
}

/* Safe zone for TV screens */
.content-container {
    padding: 48px; /* TV safe zone */
}

/* 1920x1080 Full HD default */
body {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
}
```

### Graphics Support
- **Canvas 2D**: Full support
- **WebGL**: WebGL 1.0 (Tizen 2.4+), WebGL 2.0 (Tizen 6.0+)
- **SVG**: Full support for inline and external SVG

---

## JavaScript Compatibility

### ES5 vs ES6 Support

#### Tizen Version Compatibility Matrix

| Feature | Tizen 2.3-3.0 | Tizen 4.0+ | Tizen 6.0+ |
|---------|---------------|------------|------------|
| `var` | ✅ | ✅ | ✅ |
| `let` / `const` | ❌ | ✅ | ✅ |
| Arrow Functions | ❌ | ✅ | ✅ |
| Template Literals | ❌ | ✅ | ✅ |
| Promises | ❌ (polyfill) | ✅ | ✅ |
| `async/await` | ❌ | ❌ | ✅ |
| Classes | ❌ | ✅ | ✅ |
| Spread Operator | ❌ | ✅ | ✅ |
| Destructuring | ❌ | ✅ | ✅ |
| `Array.includes()` | ❌ | ✅ | ✅ |
| `Object.assign()` | ❌ | ✅ | ✅ |
| `Map` / `Set` | ❌ | ✅ | ✅ |
| `.catch()` method | ❌ | ✅ | ✅ |

### ES5 Compatible Patterns (RECOMMENDED FOR MAX COMPATIBILITY)

```javascript
// ===== VARIABLE DECLARATIONS =====
// ❌ ES6 (Avoid for older TVs)
const CONFIG = {};
let count = 0;

// ✅ ES5 (Safe for all Tizen versions)
var CONFIG = {};
var count = 0;

// ===== FUNCTIONS =====
// ❌ ES6 Arrow Functions
const handleClick = () => { };
const double = x => x * 2;

// ✅ ES5 Regular Functions
var handleClick = function() { };
var double = function(x) { return x * 2; };

// ===== PROMISES =====
// ❌ ES6 .catch() method
somePromise
    .then(function(data) { })
    .catch(function(error) { });

// ✅ ES5 Compatible (second parameter of .then())
somePromise.then(
    function(data) { 
        // success
    },
    function(error) { 
        // error handler
    }
);

// ===== STRING HANDLING =====
// ❌ ES6 Template Literals
var message = `Hello ${name}`;

// ✅ ES5 String Concatenation
var message = 'Hello ' + name;

// ===== OBJECT METHODS =====
// ❌ ES6 Shorthand
var obj = {
    name,
    sayHello() { }
};

// ✅ ES5 Full Syntax
var obj = {
    name: name,
    sayHello: function() { }
};

// ===== ARRAY ITERATION =====
// ❌ ES6 for...of
for (var item of items) { }

// ✅ ES5 for loop
for (var i = 0; i < items.length; i++) {
    var item = items[i];
}

// ===== DEFAULT PARAMETERS =====
// ❌ ES6 Default params
function greet(name = 'Guest') { }

// ✅ ES5 Manual defaults
function greet(name) {
    name = name || 'Guest';
}

// ===== CLASSES =====
// ❌ ES6 Class
class Player {
    constructor() { }
    play() { }
}

// ✅ ES5 Constructor Function
var Player = function() {
    // constructor code
};
Player.prototype.play = function() {
    // method code
};

// ===== MODULE PATTERN (Recommended) =====
var MyModule = (function() {
    'use strict';
    
    // Private variables
    var privateVar = 'secret';
    
    // Private functions
    function privateFunction() {
        return privateVar;
    }
    
    // Public API
    return {
        publicMethod: function() {
            return privateFunction();
        },
        init: function() {
            console.log('Module initialized');
        }
    };
})();
```

---

## Tizen Device APIs

### Loading Tizen APIs
```html
<!-- In index.html <head> section -->
<!-- Tizen Web Device APIs (built-in) -->
<script src="$WEBAPIS/webapis/webapis.js"></script>
```

### Base APIs

#### Tizen Object
```javascript
// Check Tizen availability
if (typeof tizen !== 'undefined') {
    console.log('Running on Tizen TV');
}

// Application control
tizen.application.getCurrentApplication();
tizen.application.exit();  // Exit app
```

#### System Information
```javascript
// Get device capabilities
tizen.systeminfo.getCapability('http://tizen.org/feature/platform.version');
tizen.systeminfo.getCapability('http://tizen.org/system/model_name');
tizen.systeminfo.getCapability('http://tizen.org/feature/network.wifi');

// Get property values
tizen.systeminfo.getPropertyValue('NETWORK', function(network) {
    console.log('Network type:', network.networkType);
}, function(error) {
    console.error('Error:', error.message);
});
```

#### Filesystem
```javascript
// Resolve file paths
tizen.filesystem.resolve('wgt-package', function(dir) {
    console.log('Package directory:', dir.toURI());
}, function(error) {
    console.error('Error:', error.message);
}, 'r');

// Read file
tizen.filesystem.resolve('documents/data.json', function(file) {
    file.readAsText(function(content) {
        console.log('File content:', content);
    });
});
```

#### Time
```javascript
// Get current date/time
var currentDate = tizen.time.getCurrentDateTime();
console.log('Current time:', currentDate.toString());

// Get timezone
var timezone = tizen.time.getLocalTimezone();
console.log('Timezone:', timezone);
```

### Network APIs

#### Network Information
```javascript
// Check network status
tizen.systeminfo.getPropertyValue('NETWORK', function(network) {
    if (network.networkType === 'NONE') {
        console.log('No network connection');
    } else {
        console.log('Connected via:', network.networkType);
    }
});

// Listen for network changes
tizen.systeminfo.addPropertyValueChangeListener('NETWORK', function(network) {
    console.log('Network changed to:', network.networkType);
});
```

### TV-Specific APIs

#### TV Information
```javascript
// webapis.productinfo namespace
if (typeof webapis !== 'undefined' && webapis.productinfo) {
    var firmware = webapis.productinfo.getFirmware();
    var model = webapis.productinfo.getModel();
    var modelCode = webapis.productinfo.getModelCode();
    var duid = webapis.productinfo.getDuid();
    
    console.log('Firmware:', firmware);
    console.log('Model:', model);
    console.log('Model Code:', modelCode);
    console.log('DUID:', duid);
}
```

#### Network Device Info
```javascript
// webapis.network namespace
if (typeof webapis !== 'undefined' && webapis.network) {
    var mac = webapis.network.getMac();
    var ip = webapis.network.getIp();
    var gateway = webapis.network.getGateway();
    var dns = webapis.network.getDns();
    
    console.log('MAC Address:', mac);
    console.log('IP Address:', ip);
    console.log('Gateway:', gateway);
    console.log('DNS:', dns);
}
```

---

## Samsung Product APIs

### Loading Product APIs
```html
<!-- Must include in index.html -->
<script type="text/javascript" src="$WEBAPIS/webapis/webapis.js"></script>
```

### Available webapis Namespaces
```javascript
// Check availability
if (typeof webapis !== 'undefined') {
    // Media playback
    webapis.avplay;          // AVPlay API for video streaming
    
    // Device info
    webapis.productinfo;     // Product/model information
    webapis.network;         // Network information
    
    // TV controls
    webapis.tvaudiocontrol;  // Audio control
    webapis.tvinfo;          // TV settings info
    webapis.tvinputdevice;   // Remote control keys
    webapis.tvwindow;        // TV window control
    
    // Other
    webapis.appcommon;       // Common app functions
    webapis.billing;         // In-app purchases
}
```

---

## AVPlay API Reference

The AVPlay API is Samsung's native video player for high-performance streaming.

### Player States
```javascript
// AVPlayPlayerState enum
'NONE'      // Player not created
'IDLE'      // Created but not prepared
'READY'     // Ready to play
'PLAYING'   // Currently playing
'PAUSED'    // Paused
```

### Basic Usage Pattern
```javascript
// ===== INITIALIZATION =====
var videoUrl = 'http://example.com/video.m3u8';

// 1. Open the player with URL
webapis.avplay.open(videoUrl);

// 2. Set display area (x, y, width, height based on 1920x1080)
webapis.avplay.setDisplayRect(0, 0, 1920, 1080);

// 3. Set event listeners
webapis.avplay.setListener({
    onbufferingstart: function() {
        console.log('Buffering started...');
    },
    onbufferingprogress: function(percent) {
        console.log('Buffering: ' + percent + '%');
    },
    onbufferingcomplete: function() {
        console.log('Buffering complete');
    },
    oncurrentplaytime: function(currentTime) {
        console.log('Time: ' + currentTime + 'ms');
    },
    onstreamcompleted: function() {
        console.log('Playback complete');
    },
    onerror: function(eventType) {
        console.error('Error:', eventType);
    },
    onerrormsg: function(eventType, errorMsg) {
        console.error('Error:', eventType, errorMsg);
    }
});

// 4. Prepare (async recommended)
webapis.avplay.prepareAsync(
    function() {
        console.log('Prepared successfully');
        // 5. Start playback
        webapis.avplay.play();
    },
    function(error) {
        console.error('Prepare failed:', error);
    }
);
```

### All AVPlay Methods

```javascript
// ===== LIFECYCLE METHODS =====
webapis.avplay.open(url);           // Initialize with URL
webapis.avplay.close();             // Destroy player
webapis.avplay.prepare();           // Sync prepare (blocks)
webapis.avplay.prepareAsync(success, error);  // Async prepare

// ===== PLAYBACK CONTROL =====
webapis.avplay.play();              // Start/resume playback
webapis.avplay.pause();             // Pause playback
webapis.avplay.stop();              // Stop playback
webapis.avplay.seekTo(ms, success, error);  // Seek to position
webapis.avplay.jumpForward(ms, success, error);   // Skip forward
webapis.avplay.jumpBackward(ms, success, error);  // Skip backward
webapis.avplay.setSpeed(speed);     // Set playback speed (-16x to 16x)
webapis.avplay.setLooping(bool);    // Enable/disable looping

// ===== STATE & INFORMATION =====
webapis.avplay.getState();          // Get current state
webapis.avplay.getDuration();       // Get total duration (ms)
webapis.avplay.getCurrentTime();    // Get current position (ms)
webapis.avplay.getVersion();        // Get AVPlay version

// ===== DISPLAY CONTROL =====
webapis.avplay.setDisplayRect(x, y, width, height);  // Set video area
webapis.avplay.setDisplayMethod(mode);  // Display mode
// Modes: 'PLAYER_DISPLAY_MODE_LETTER_BOX', 'PLAYER_DISPLAY_MODE_FULL_SCREEN', 
//        'PLAYER_DISPLAY_MODE_AUTO_ASPECT_RATIO'
webapis.avplay.setDisplayRotation(rotation);  // Rotate display

// ===== BUFFERING =====
webapis.avplay.setTimeoutForBuffering(seconds);  // Buffer timeout
webapis.avplay.setBufferingParam(option, unit, amount);
// Options: 'PLAYER_BUFFER_FOR_PLAY', 'PLAYER_BUFFER_FOR_RESUME'
// Units: 'PLAYER_BUFFER_SIZE_IN_SECOND'

// ===== STREAMING PROPERTIES =====
webapis.avplay.setStreamingProperty(type, value);
// Types: 'COOKIE', 'USER_AGENT', 'ADAPTIVE_INFO', 'PREBUFFER_MODE'
webapis.avplay.getStreamingProperty(type);
// Types: 'IS_LIVE', 'AVAILABLE_BITRATE', 'GET_LIVE_DURATION', 'CURRENT_BANDWIDTH'

// ===== TRACKS =====
webapis.avplay.getTotalTrackInfo();        // Get all tracks
webapis.avplay.getCurrentStreamInfo();     // Get current track
webapis.avplay.setSelectTrack(type, index);  // Select track
// Types: 'AUDIO', 'TEXT'

// ===== SUBTITLES =====
webapis.avplay.setSilentSubtitle(bool);    // Show/hide subtitles
webapis.avplay.setExternalSubtitlePath(path);  // External subtitle file
webapis.avplay.setSubtitlePosition(ms);    // Subtitle sync offset

// ===== DRM =====
webapis.avplay.setDrm(drmType, operation, params);
// DRM Types: 'PLAYREADY', 'WIDEVINE_CDM', 'VERIMATRIX'

// ===== MULTITASKING =====
webapis.avplay.suspend();           // Save state (app going to background)
webapis.avplay.restore(url, time, prepare);  // Restore state
```

### AVPlay Callback Listeners
```javascript
var listener = {
    // Buffering callbacks
    onbufferingstart: function() { },
    onbufferingprogress: function(percent) { },  // 0-100
    onbufferingcomplete: function() { },
    
    // Playback callbacks
    oncurrentplaytime: function(currentTime) { },  // ms
    onstreamcompleted: function() { },
    
    // Event callback
    onevent: function(eventType, eventData) { },
    // Events: 'PLAYER_MSG_RESOLUTION_CHANGED', 'PLAYER_MSG_BITRATE_CHANGE', etc.
    
    // Error callbacks
    onerror: function(errorType) { },
    onerrormsg: function(errorType, errorMsg) { },
    // Errors: 'PLAYER_ERROR_CONNECTION_FAILED', 'PLAYER_ERROR_NOT_SUPPORTED_FORMAT', etc.
    
    // DRM callback
    ondrmevent: function(drmType, drmData) { },
    
    // Subtitle callback
    onsubtitlechange: function(duration, text, type, attributes) { }
};

webapis.avplay.setListener(listener);
```

### HLS Streaming Example
```javascript
function playHLSStream(hlsUrl) {
    try {
        // Close any existing player
        webapis.avplay.close();
        
        // Open new stream
        webapis.avplay.open(hlsUrl);
        
        // Configure display
        webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
        webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN');
        
        // Set adaptive streaming properties
        webapis.avplay.setStreamingProperty('ADAPTIVE_INFO', 
            'STARTBITRATE=HIGHEST|SKIPBITRATE=LOWEST');
        
        // Set buffering
        webapis.avplay.setBufferingParam('PLAYER_BUFFER_FOR_PLAY', 
            'PLAYER_BUFFER_SIZE_IN_SECOND', 5);
        webapis.avplay.setTimeoutForBuffering(10);
        
        // Set listener
        webapis.avplay.setListener({
            onbufferingcomplete: function() {
                console.log('Ready to play');
            },
            onerror: function(error) {
                console.error('Playback error:', error);
            }
        });
        
        // Prepare and play
        webapis.avplay.prepareAsync(
            function() {
                webapis.avplay.play();
            },
            function(error) {
                console.error('Prepare failed:', error);
            }
        );
        
    } catch (e) {
        console.error('AVPlay error:', e);
    }
}
```

---

## TV Input Device API

### Registering Remote Keys
```javascript
// Register keys that need to be handled by the app
// By default, some keys are handled by the system
function registerKeys() {
    if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
        var keys = [
            'MediaPlayPause',
            'MediaPlay',
            'MediaPause',
            'MediaStop',
            'MediaFastForward',
            'MediaRewind',
            'MediaTrackPrevious',
            'MediaTrackNext',
            'ColorF0Red',
            'ColorF1Green',
            'ColorF2Yellow',
            'ColorF3Blue',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'ChannelUp',
            'ChannelDown',
            'Info',
            'Exit'
        ];
        
        keys.forEach(function(key) {
            try {
                tizen.tvinputdevice.registerKey(key);
            } catch (e) {
                console.warn('Could not register key:', key, e.message);
            }
        });
    }
}
```

### Key Code Reference
```javascript
// Samsung Tizen Remote Key Codes
var KEY_CODES = {
    // Navigation
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,       // OK/Select button
    BACK: 10009,     // Return/Back button
    EXIT: 10182,     // Exit app
    
    // Media Controls
    PLAY: 415,
    PAUSE: 19,
    STOP: 413,
    FORWARD: 417,    // Fast Forward
    REWIND: 412,     // Rewind
    PLAY_PAUSE: 10252,
    
    // Color Buttons
    RED: 403,
    GREEN: 404,
    YELLOW: 405,
    BLUE: 406,
    
    // Numbers
    NUM_0: 48,
    NUM_1: 49,
    NUM_2: 50,
    NUM_3: 51,
    NUM_4: 52,
    NUM_5: 53,
    NUM_6: 54,
    NUM_7: 55,
    NUM_8: 56,
    NUM_9: 57,
    
    // Channel
    CHANNEL_UP: 427,
    CHANNEL_DOWN: 428,
    
    // Volume (usually handled by system)
    VOLUME_UP: 447,
    VOLUME_DOWN: 448,
    MUTE: 449,
    
    // Others
    INFO: 457,
    GUIDE: 458,
    MENU: 10133,
    TOOLS: 10135,
    SOURCE: 10072,
    EXTRA: 10253     // 123 button
};
```

---

## Remote Control Handling

### Complete Remote Handler
```javascript
var RemoteHandler = (function() {
    'use strict';
    
    var focusableElements = [];
    var currentIndex = -1;
    
    function init() {
        // Register keys
        registerMediaKeys();
        
        // Add event listener
        document.addEventListener('keydown', handleKeyDown);
        
        // Initial focus scan
        updateFocusableElements();
        
        console.log('Remote handler initialized');
    }
    
    function registerMediaKeys() {
        if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
            var keysToRegister = [
                'MediaPlay', 'MediaPause', 'MediaStop',
                'MediaFastForward', 'MediaRewind',
                'ColorF0Red', 'ColorF1Green', 
                'ColorF2Yellow', 'ColorF3Blue'
            ];
            
            keysToRegister.forEach(function(key) {
                try {
                    tizen.tvinputdevice.registerKey(key);
                } catch (e) { }
            });
        }
    }
    
    function updateFocusableElements() {
        var selector = 'a[href], button:not([disabled]), ' +
                      'input:not([disabled]), [tabindex]:not([tabindex="-1"]), ' +
                      '.focusable, .channel-card, .menu-item';
        
        var elements = document.querySelectorAll(selector);
        focusableElements = [];
        
        for (var i = 0; i < elements.length; i++) {
            if (isVisible(elements[i])) {
                focusableElements.push(elements[i]);
            }
        }
        
        return focusableElements;
    }
    
    function isVisible(el) {
        var style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' &&
               el.offsetParent !== null;
    }
    
    function setFocus(index) {
        // Remove old focus
        if (currentIndex >= 0 && focusableElements[currentIndex]) {
            focusableElements[currentIndex].classList.remove('focused');
        }
        
        // Set new focus
        currentIndex = index;
        if (focusableElements[currentIndex]) {
            focusableElements[currentIndex].classList.add('focused');
            focusableElements[currentIndex].focus();
            
            // Scroll into view if needed
            focusableElements[currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    function handleKeyDown(e) {
        var keyCode = e.keyCode || e.which;
        
        // Also check e.key for string-based detection
        var keyName = e.key || '';
        
        switch (keyCode) {
            case 37: // LEFT
                navigateLeft();
                e.preventDefault();
                break;
                
            case 38: // UP
                navigateUp();
                e.preventDefault();
                break;
                
            case 39: // RIGHT
                navigateRight();
                e.preventDefault();
                break;
                
            case 40: // DOWN
                navigateDown();
                e.preventDefault();
                break;
                
            case 13: // ENTER
                activateCurrent();
                e.preventDefault();
                break;
                
            case 10009: // BACK
                handleBack();
                e.preventDefault();
                break;
                
            case 10182: // EXIT
                handleExit();
                e.preventDefault();
                break;
                
            case 415: // PLAY
                handlePlay();
                break;
                
            case 19: // PAUSE
                handlePause();
                break;
                
            case 413: // STOP
                handleStop();
                break;
                
            case 417: // FORWARD
                handleForward();
                break;
                
            case 412: // REWIND
                handleRewind();
                break;
        }
    }
    
    function navigateLeft() {
        if (currentIndex > 0) {
            setFocus(currentIndex - 1);
        }
    }
    
    function navigateRight() {
        if (currentIndex < focusableElements.length - 1) {
            setFocus(currentIndex + 1);
        }
    }
    
    function navigateUp() {
        // For grid layouts, find element above
        // For simple lists, go to previous
        if (currentIndex > 0) {
            setFocus(currentIndex - 1);
        }
    }
    
    function navigateDown() {
        if (currentIndex < focusableElements.length - 1) {
            setFocus(currentIndex + 1);
        }
    }
    
    function activateCurrent() {
        if (focusableElements[currentIndex]) {
            focusableElements[currentIndex].click();
        }
    }
    
    function handleBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Show exit confirmation
            handleExit();
        }
    }
    
    function handleExit() {
        if (confirm('Exit application?')) {
            if (typeof tizen !== 'undefined') {
                tizen.application.getCurrentApplication().exit();
            }
        }
    }
    
    function handlePlay() {
        if (typeof AVPlayer !== 'undefined') {
            AVPlayer.play();
        }
    }
    
    function handlePause() {
        if (typeof AVPlayer !== 'undefined') {
            AVPlayer.pause();
        }
    }
    
    function handleStop() {
        if (typeof AVPlayer !== 'undefined') {
            AVPlayer.stop();
        }
    }
    
    function handleForward() {
        if (typeof AVPlayer !== 'undefined') {
            AVPlayer.forward(10000); // 10 seconds
        }
    }
    
    function handleRewind() {
        if (typeof AVPlayer !== 'undefined') {
            AVPlayer.rewind(10000); // 10 seconds
        }
    }
    
    return {
        init: init,
        updateFocusableElements: updateFocusableElements,
        setFocus: setFocus
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', RemoteHandler.init);
```

---

## Project Implementation Guide

### config.xml Requirements
```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" 
        xmlns:tizen="http://tizen.org/ns/widgets"
        id="http://yourdomain.com/YourApp" 
        version="1.0.0" 
        viewmodes="maximized">
    
    <tizen:application id="YourAppId.YourApp" 
                       package="YourAppId" 
                       required_version="2.3"/>
    
    <content src="index.html"/>
    
    <feature name="http://tizen.org/feature/screen.size.all"/>
    
    <icon src="icon.png"/>
    
    <name>Your App Name</name>
    
    <tizen:privilege name="http://tizen.org/privilege/application.launch"/>
    <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>
    <tizen:privilege name="http://tizen.org/privilege/internet"/>
    <tizen:privilege name="http://tizen.org/privilege/network.get"/>
    <tizen:privilege name="http://developer.samsung.com/privilege/network.public"/>
    <tizen:privilege name="http://developer.samsung.com/privilege/productinfo"/>
    <tizen:privilege name="http://developer.samsung.com/privilege/avplay"/>
    
    <tizen:setting screen-orientation="landscape" 
                   context-menu="enable" 
                   background-support="disable" 
                   encryption="disable" 
                   install-location="auto" 
                   hwkey-event="enable"/>
    
    <access origin="*" subdomains="true"/>
    
</widget>
```

### index.html Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, height=1080, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <title>BBNL TV App</title>
    
    <!-- Samsung WebAPIs (MUST be first) -->
    <script type="text/javascript" src="$WEBAPIS/webapis/webapis.js"></script>
    
    <!-- External Libraries -->
    <script src="https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@1.4.0"></script>
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="css/style.css">
    
    <style>
        /* Focus indicator for remote navigation */
        .focused, :focus {
            outline: 3px solid #00ff00 !important;
            outline-offset: 2px;
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Your app content -->
    </div>
    
    <!-- API Configuration -->
    <script src="api/config.js"></script>
    
    <!-- Core Scripts -->
    <script src="js/remote.js"></script>
    <script src="js/avplayer.js"></script>
    <script src="js/script.js"></script>
    
    <script>
        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('App loaded');
            
            // Initialize remote control
            if (typeof RemoteControl !== 'undefined') {
                RemoteControl.init();
            }
        });
    </script>
</body>
</html>
```

### Project File Structure
```
project/
├── config.xml              # Tizen configuration
├── index.html              # Entry point
├── icon.png                # App icon (512x512)
│
├── api/
│   ├── config.js           # API configuration
│   ├── auth.js             # Authentication API
│   └── channels.js         # Channel API
│
├── css/
│   ├── style.css           # Main styles
│   └── base/
│       ├── reset.css       # CSS reset
│       └── variable.css    # CSS variables
│
├── js/
│   ├── avplayer.js         # AVPlay wrapper
│   ├── remote.js           # Remote control handler
│   └── script.js           # Main application logic
│
└── images/
    ├── logo.png
    └── icons/
```

---

## Best Practices

### 1. Always Use ES5 Syntax
```javascript
// ✅ GOOD - ES5 compatible
var myFunction = function(param) {
    param = param || 'default';
    return param;
};

// ❌ BAD - May not work on older TVs
const myFunction = (param = 'default') => param;
```

### 2. Check API Availability Before Use
```javascript
// ✅ Always check if API exists
if (typeof webapis !== 'undefined' && webapis.avplay) {
    webapis.avplay.play();
}

// ✅ Safe API access pattern
function safeAVPlay(method) {
    if (typeof webapis !== 'undefined' && 
        webapis.avplay && 
        typeof webapis.avplay[method] === 'function') {
        return webapis.avplay[method].apply(webapis.avplay, 
            Array.prototype.slice.call(arguments, 1));
    }
    console.warn('AVPlay.' + method + ' not available');
    return null;
}
```

### 3. Handle Errors Gracefully
```javascript
// ✅ Wrap Tizen calls in try-catch
function playVideo(url) {
    try {
        webapis.avplay.open(url);
        webapis.avplay.prepareAsync(
            function() { webapis.avplay.play(); },
            function(err) { 
                console.error('Prepare failed:', err);
                showErrorMessage('Unable to play video');
            }
        );
    } catch (e) {
        console.error('AVPlay error:', e);
        // Fallback to HTML5 video
        fallbackToHTML5(url);
    }
}
```

### 4. Implement Fallbacks
```javascript
// ✅ Fallback pattern for video playback
function playVideo(url) {
    if (typeof webapis !== 'undefined' && webapis.avplay) {
        // Use AVPlay on real TV
        playWithAVPlay(url);
    } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        // Use HLS.js in browser/emulator
        playWithHLS(url);
    } else {
        // Basic HTML5 video fallback
        playWithHTML5(url);
    }
}
```

### 5. Optimize for TV Screen
```css
/* ✅ Use appropriate font sizes for 10-foot experience */
body {
    font-size: 24px;  /* Minimum readable at 10 feet */
}

h1 { font-size: 48px; }
h2 { font-size: 36px; }
p { font-size: 28px; }

/* ✅ Large touch/focus targets */
button, .clickable {
    min-width: 200px;
    min-height: 60px;
    padding: 16px 32px;
}

/* ✅ High contrast for visibility */
.button-primary {
    background: #0078ff;
    color: #ffffff;
}
```

### 6. Memory Management
```javascript
// ✅ Clean up resources when leaving page
window.addEventListener('unload', function() {
    if (typeof webapis !== 'undefined' && webapis.avplay) {
        try {
            webapis.avplay.stop();
            webapis.avplay.close();
        } catch (e) { }
    }
});

// ✅ Clean up when app goes to background
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // App going to background
        if (typeof webapis !== 'undefined' && webapis.avplay) {
            webapis.avplay.suspend();
        }
    } else {
        // App returning to foreground
        if (typeof webapis !== 'undefined' && webapis.avplay) {
            webapis.avplay.restore();
        }
    }
});
```

### 7. Network Error Handling
```javascript
// ✅ Check network before API calls
function checkNetwork() {
    return new Promise(function(resolve, reject) {
        if (typeof tizen !== 'undefined' && tizen.systeminfo) {
            tizen.systeminfo.getPropertyValue('NETWORK',
                function(network) {
                    if (network.networkType === 'NONE') {
                        reject(new Error('No network connection'));
                    } else {
                        resolve(network);
                    }
                },
                function(error) {
                    reject(error);
                }
            );
        } else {
            // Fallback for browser
            resolve({ networkType: navigator.onLine ? 'WIFI' : 'NONE' });
        }
    });
}
```

---

## Troubleshooting

### Common Errors and Solutions

#### 1. "webapis is not defined"
```javascript
// Problem: Script loaded before webapis
// Solution: Ensure webapis.js is loaded first in <head>
<script type="text/javascript" src="$WEBAPIS/webapis/webapis.js"></script>
```

#### 2. AVPlay open() fails in emulator
```javascript
// Problem: Emulator has limited AVPlay support
// Solution: Implement HLS.js fallback
function initPlayer(url) {
    if (isEmulator() || !hasAVPlay()) {
        console.log('Using HLS.js fallback (expected in emulator)');
        initHLSPlayer(url);
    } else {
        initAVPlayer(url);
    }
}
```

#### 3. Remote keys not working
```javascript
// Problem: Keys not registered
// Solution: Register keys after app loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Tizen API to be ready
    setTimeout(function() {
        registerTVKeys();
    }, 100);
});

function registerTVKeys() {
    if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
        try {
            tizen.tvinputdevice.registerKey('MediaPlay');
            tizen.tvinputdevice.registerKey('MediaPause');
            // ... register other keys
        } catch (e) {
            console.warn('Key registration failed:', e);
        }
    }
}
```

#### 4. ES6 syntax errors on older TVs
```javascript
// Problem: .catch() method not supported
// ❌ This fails on Tizen 2.3-3.0
promise.catch(function(err) { });

// ✅ Use second parameter of .then()
promise.then(
    function(data) { /* success */ },
    function(err) { /* error */ }
);
```

#### 5. Focus not visible
```css
/* Problem: Focus style not showing */
/* Solution: Add explicit focus styles */
*:focus,
.focused,
.remote-focused {
    outline: 3px solid #00ff00 !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}
```

#### 6. Video not playing
```javascript
// Problem: Missing privileges or wrong state
// Solution: Check state and privileges
function debugAVPlay() {
    if (!webapis.avplay) {
        console.error('AVPlay not available - check config.xml privileges');
        return;
    }
    
    var state = webapis.avplay.getState();
    console.log('Current state:', state);
    
    // State must be READY before play()
    if (state !== 'READY') {
        console.error('Cannot play - state is:', state);
    }
}
```

### Debug Logging
```javascript
// Enable verbose logging for debugging
var DEBUG = true;

function log() {
    if (DEBUG) {
        console.log.apply(console, ['[DEBUG]'].concat(
            Array.prototype.slice.call(arguments)
        ));
    }
}

// Log all key events
document.addEventListener('keydown', function(e) {
    log('Key pressed:', e.keyCode, e.key);
});
```

---

## Summary

### Quick Reference Card

| Task | API/Method |
|------|-----------|
| Play video | `webapis.avplay.play()` |
| Pause video | `webapis.avplay.pause()` |
| Stop video | `webapis.avplay.stop()` |
| Get MAC address | `webapis.network.getMac()` |
| Get IP address | `webapis.network.getIp()` |
| Get device model | `webapis.productinfo.getModel()` |
| Register key | `tizen.tvinputdevice.registerKey('MediaPlay')` |
| Exit app | `tizen.application.getCurrentApplication().exit()` |
| Get Tizen version | `tizen.systeminfo.getCapability('http://tizen.org/feature/platform.version')` |

### Essential Patterns
1. **Always use ES5 syntax** for maximum compatibility
2. **Check API availability** before using
3. **Implement fallbacks** for emulator/browser testing
4. **Handle errors gracefully** with try-catch
5. **Register required keys** for remote control
6. **Clean up resources** on page unload
7. **Use large UI elements** for 10-foot experience

---

*Last updated: January 2026*
*Documentation Version: 2.0*
*Compatible with: Tizen 2.3 - 8.0*
