# ES5 Tizen Compatibility Guide

## Overview

Samsung Tizen TV uses an older JavaScript engine that **does not support ES6+ (ECMAScript 2015+) features**. This document explains all the changes made to convert the BBNL Streaming Platform code from ES6+ to ES5.

---

## Why These Changes Are Needed

| ES6+ Feature | Problem on Tizen | Solution |
|--------------|------------------|----------|
| `const` / `let` | Not supported | Use `var` |
| Arrow functions `() => {}` | Not supported | Use `function() {}` |
| `async` / `await` | Not supported | Use `Promise.then().catch()` |
| Template literals `` `${var}` `` | Not supported | Use string concatenation `'...' + var` |
| Optional chaining `?.` | Not supported | Use explicit `if` checks |
| `.includes()` | Not supported | Use `.indexOf() !== -1` |
| Spread operator `...` | Not supported | Use loops or `.slice()` |
| `forEach` with arrow | Not supported | Use `for` loop or `forEach` with `function` |

---

## Step-by-Step Changes

### Step 1: Variable Declarations

**❌ ES6 (Won't work on Tizen):**
```javascript
const API_CONFIG = { ... };
let currentIndex = 0;
```

**✅ ES5 (Works on Tizen):**
```javascript
var API_CONFIG = { ... };
var currentIndex = 0;
```

---

### Step 2: Arrow Functions

**❌ ES6 (Won't work on Tizen):**
```javascript
// Arrow function
const add = (a, b) => a + b;

// Arrow function in callback
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('clicked');
    });
});
```

**✅ ES5 (Works on Tizen):**
```javascript
// Regular function
var add = function(a, b) {
    return a + b;
};

// Regular function in callback
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
        console.log('clicked');
    });
}
```

---

### Step 3: Async/Await to Promises

**❌ ES6 (Won't work on Tizen):**
```javascript
async function loadChannels() {
    try {
        const result = await ChannelsAPI.getChannelData();
        if (result.success) {
            renderChannels(result.channels);
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}
```

**✅ ES5 (Works on Tizen):**
```javascript
function loadChannels() {
    ChannelsAPI.getChannelData().then(function(result) {
        if (result.success) {
            renderChannels(result.channels);
        }
    }).catch(function(error) {
        console.error('Failed:', error);
    });
}
```

---

### Step 4: Template Literals to String Concatenation

**❌ ES6 (Won't work on Tizen):**
```javascript
const message = `Hello ${name}, you have ${count} messages`;
const url = `player.html?title=${encodeURIComponent(title)}`;

// Multi-line HTML
const html = `
    <div class="card">
        <h3>${title}</h3>
        <p>${description}</p>
    </div>
`;
```

**✅ ES5 (Works on Tizen):**
```javascript
var message = 'Hello ' + name + ', you have ' + count + ' messages';
var url = 'player.html?title=' + encodeURIComponent(title);

// Multi-line HTML
var html = '<div class="card">' +
        '<h3>' + title + '</h3>' +
        '<p>' + description + '</p>' +
    '</div>';
```

---

### Step 5: Optional Chaining

**❌ ES6 (Won't work on Tizen):**
```javascript
const categories = data.body?.[0]?.categories || [];
const errorMsg = data.status?.err_msg || 'Unknown error';
```

**✅ ES5 (Works on Tizen):**
```javascript
var categories = [];
if (data.body && data.body[0] && data.body[0].categories) {
    categories = data.body[0].categories;
}

var errorMsg = 'Unknown error';
if (data.status && data.status.err_msg) {
    errorMsg = data.status.err_msg;
}
```

---

### Step 6: Array Methods

**❌ ES6 (Won't work on Tizen):**
```javascript
// .includes() method
if (genre.includes(filterValue)) { ... }

// .find() method  
const channel = channels.find(c => c.id === channelId);

// .findIndex() method
const index = channels.findIndex(c => c.chid === channel.chid);

// Spread operator
const copy = [...originalArray];
shuffleArray([...channels]);
```

**✅ ES5 (Works on Tizen):**
```javascript
// Use indexOf instead of includes
if (genre.indexOf(filterValue) !== -1) { ... }

// Use for loop instead of find
var channel = null;
for (var i = 0; i < channels.length; i++) {
    if (channels[i].id === channelId) {
        channel = channels[i];
        break;
    }
}

// Use for loop instead of findIndex
var index = -1;
for (var i = 0; i < channels.length; i++) {
    if (channels[i].chid === channel.chid) {
        index = i;
        break;
    }
}

// Use slice instead of spread
var copy = originalArray.slice();
shuffleArray(channels.slice());
```

---

### Step 7: forEach with Closure (Important!)

When using `forEach` or `for` loops with event listeners, you need closures to capture the correct index.

**❌ ES6 (Won't work on Tizen):**
```javascript
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
});
```

**✅ ES5 (Works on Tizen):**
```javascript
for (var i = 0; i < otpInputs.length; i++) {
    (function(index) {
        var input = otpInputs[index];
        input.addEventListener('input', function(e) {
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
    })(i);
}
```

> **Why the IIFE (Immediately Invoked Function Expression)?**  
> Without it, all event listeners would reference the same `i` variable (which would be the final value after the loop ends). The IIFE creates a new scope for each iteration.

---

### Step 8: Object Shorthand

**❌ ES6 (Won't work on Tizen):**
```javascript
const name = 'John';
const age = 30;
const person = { name, age };  // Shorthand

return { success: true, data };  // Shorthand
```

**✅ ES5 (Works on Tizen):**
```javascript
var name = 'John';
var age = 30;
var person = { name: name, age: age };  // Explicit

return { success: true, data: data };  // Explicit
```

---

### Step 9: Destructuring Assignment

**❌ ES6 (Won't work on Tizen):**
```javascript
const { name, age } = person;
const [first, second] = array;
const { data: { channels } } = response;
```

**✅ ES5 (Works on Tizen):**
```javascript
var name = person.name;
var age = person.age;
var first = array[0];
var second = array[1];
var channels = response.data.channels;
```

---

### Step 10: Array Swap

**❌ ES6 (Won't work on Tizen):**
```javascript
// Destructuring swap
[array[i], array[j]] = [array[j], array[i]];
```

**✅ ES5 (Works on Tizen):**
```javascript
// Traditional swap with temp variable
var temp = array[i];
array[i] = array[j];
array[j] = temp;
```

---

## Files Modified

### API Files
| File | Changes Made |
|------|-------------|
| `api/config.js` | `const` → `var`, `async/await` → `Promise`, arrow functions → `function()` |
| `api/auth.js` | Full ES5 conversion of all methods |
| `api/channels.js` | Full ES5 conversion of all methods |
| `api/ads.js` | Full ES5 conversion, template literals → string concatenation |

### HTML Files (Inline JavaScript)
| File | Changes Made |
|------|-------------|
| `tv-channels.html` | Major conversion - channels loading, filtering, favorites |
| `homepage.html` | Sidebar, profile switcher, channels and ads loading |
| `shows.html` | Filter functionality, media item clicks |
| `movies.html` | Filter functionality, media item clicks |
| `settings.html` | Navigation, toggle switches, keyboard handling |
| `profiles.html` | Avatar carousel, profile creation |
| `manage-profiles.html` | Profile editing, avatar upload |
| `favorites.html` | Sidebar, filter pills |
| `device-verify-failed.html` | OTP input handling |

---

## Testing Your Changes

### Quick Test Checklist

1. **Variable Declarations**
   - [ ] No `const` or `let` in the code
   - [ ] All variables use `var`

2. **Functions**
   - [ ] No arrow functions `=>`
   - [ ] All callbacks use `function() {}`

3. **Async Operations**
   - [ ] No `async` keyword
   - [ ] No `await` keyword
   - [ ] All async operations use `.then()` and `.catch()`

4. **Strings**
   - [ ] No template literals (backticks `` ` ``)
   - [ ] All strings use quotes `'` or `"`
   - [ ] Concatenation uses `+`

5. **Arrays**
   - [ ] No `.includes()` (use `.indexOf() !== -1`)
   - [ ] No spread `...` operator
   - [ ] No destructuring `[a, b] = array`

---

## Common Errors on Tizen

| Error Message | Cause | Fix |
|--------------|-------|-----|
| `Unexpected token =>` | Arrow function used | Use `function()` |
| `Unexpected token const` | `const` used | Use `var` |
| `Unexpected token let` | `let` used | Use `var` |
| `Unexpected template string` | Template literal used | Use string concatenation |
| `Cannot read property of undefined` | Optional chaining `?.` used | Use explicit checks |

---

## Example: Complete Function Conversion

### Before (ES6+):
```javascript
async function loadChannels() {
    const container = document.getElementById('channels');
    
    try {
        const result = await ChannelsAPI.getChannelData();
        
        if (result.success) {
            let html = '';
            result.channels.forEach(channel => {
                const hasStream = !!channel.streamlink;
                html += `
                    <div class="channel-card" onclick="play('${channel.id}')">
                        ${hasStream ? '<span class="live">Live</span>' : ''}
                        <p>${channel.title}</p>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### After (ES5):
```javascript
function loadChannels() {
    var container = document.getElementById('channels');
    
    ChannelsAPI.getChannelData().then(function(result) {
        if (result.success) {
            var html = '';
            for (var i = 0; i < result.channels.length; i++) {
                var channel = result.channels[i];
                var hasStream = !!channel.streamlink;
                html += '<div class="channel-card" onclick="play(\'' + channel.id + '\')">' +
                        (hasStream ? '<span class="live">Live</span>' : '') +
                        '<p>' + channel.title + '</p>' +
                    '</div>';
            }
            container.innerHTML = html;
        }
    }).catch(function(error) {
        console.error('Error:', error);
    });
}
```

---

## Additional Resources

- [ES5 Compatibility Table](https://kangax.github.io/compat-table/es5/)
- [Tizen Web API Documentation](https://developer.tizen.org/development/api-references/web-application)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

---

## Summary

Converting ES6+ code to ES5 for Tizen involves:

1. **Replace** `const`/`let` with `var`
2. **Replace** arrow functions with regular functions
3. **Replace** `async/await` with Promise chains
4. **Replace** template literals with string concatenation
5. **Replace** `.includes()` with `.indexOf() !== -1`
6. **Remove** spread operators and use `.slice()` or loops
7. **Remove** destructuring and assign values explicitly
8. **Use** IIFEs for closures in loops when needed

Following these patterns ensures your code runs smoothly on Samsung Tizen TV devices.
