# Tizen TV config.xml Documentation

## Overview

The `config.xml` file is the **core configuration file** for Tizen web applications. It defines app metadata, permissions, and runtime behaviors based on **W3C Widget Packaging and Configuration** specifications with Tizen-specific extensions.

- **Location**: Must be in the project root directory
- **Format**: Valid XML (non-conformance blocks app signing)
- **Purpose**: Influences packaging, installation, and runtime behavior on Samsung TVs

---

## File Structure

### Root Element

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" 
        xmlns:tizen="http://tizen.org/ns/widgets" 
        id="http://yourdomain/appname" 
        version="1.0.0" 
        viewmodes="maximized">
    <!-- Child elements here -->
</widget>
```

| Attribute | Required | Description |
|-----------|----------|-------------|
| `xmlns` | Yes | W3C namespace: `http://www.w3.org/ns/widgets` |
| `xmlns:tizen` | Yes | Tizen namespace: `http://tizen.org/ns/widgets` |
| `id` | Yes | Unique URI identifier for the app |
| `version` | Yes | Semantic versioning format (e.g., `1.0.0`) |
| `viewmodes` | No | Display mode: `maximized`, `fullscreen`, `windowed` |

> **Note**: Maximum attribute/element length is **2048 bytes** (excess is truncated)

---

## W3C Core Elements

### `<access>` - Network Origin Control

Controls which network origins the app can access.

```xml
<!-- Allow all origins (default) -->
<access origin="*" subdomains="true"/>

<!-- Restrict to specific domains -->
<access origin="https://api.example.com" subdomains="true"/>
<access origin="https://cdn.example.com"/>
```

| Attribute | Description |
|-----------|-------------|
| `origin` | URL pattern (`*` = allow all) |
| `subdomains` | `true` or `false` - include subdomains |

---

### `<content>` - Start Page (Required)

Defines the entry point of the application.

```xml
<content src="index.html" type="text/html"/>
```

| Attribute | Description |
|-----------|-------------|
| `src` | Path to start HTML file |
| `type` | MIME type (default: `text/html`) |

---

### `<name>` - Application Name

Display name shown on TV home screen and menus.

```xml
<name>My TV App</name>

<!-- Localized names -->
<name xml:lang="en">My TV App</name>
<name xml:lang="ko">내 TV 앱</name>
```

---

### `<icon>` - Application Icon

App icon displayed on Samsung TV. **Recommended size: 128x128 PNG**.

```xml
<icon src="icon.png"/>

<!-- Multiple sizes -->
<icon src="icon-128.png" width="128" height="128"/>
<icon src="icon-256.png" width="256" height="256"/>
```

| Attribute | Description |
|-----------|-------------|
| `src` | Path to icon file |
| `width` | Icon width in pixels |
| `height` | Icon height in pixels |

---

### `<author>` - Developer Information

```xml
<author email="developer@example.com" href="https://example.com">
    Developer Name
</author>
```

---

### `<description>` - App Summary

```xml
<description>
    A streaming application for BBNL TV services.
</description>

<!-- Localized -->
<description xml:lang="en">English description</description>
```

---

### `<license>` - License Information

```xml
<license href="https://example.com/license">
    MIT License
</license>
```

---

### `<preference>` - Runtime Preferences

Key-value pairs accessible at runtime via JavaScript.

```xml
<preference name="api_endpoint" value="https://api.example.com"/>
<preference name="debug_mode" value="false"/>
```

**Access in JavaScript:**
```javascript
// Access preference values
var endpoint = widget.preferenceForKey('api_endpoint');
```

---

### `<feature>` - Hardware Features

Declares hardware requirements. Used for store filtering.

```xml
<feature name="http://tizen.org/feature/tv.inputdevice"/>
<feature name="http://tizen.org/feature/screen.size.normal"/>
<feature name="http://tizen.org/feature/network.wifi"/>
```

#### Common TV Features

| Feature URI | Description |
|------------|-------------|
| `http://tizen.org/feature/tv.inputdevice` | TV remote input support |
| `http://tizen.org/feature/screen.size.normal` | Standard screen size |
| `http://tizen.org/feature/network.wifi` | WiFi capability |
| `http://tizen.org/feature/network.ethernet` | Ethernet capability |

---

## Tizen-Specific Extensions

Namespace: `xmlns:tizen="http://tizen.org/ns/widgets"`

### `<tizen:application>` - App Identity (Required)

```xml
<tizen:application id="bNoSQVUTDy.SAMSUNGNMASTER" 
                   package="bNoSQVUTDy" 
                   required_version="9.0"/>
```

| Attribute | Description |
|-----------|-------------|
| `id` | Unique app ID format: `packageId.appName` |
| `package` | Package identifier (10 characters) |
| `required_version` | Minimum Tizen version required |

---

### `<tizen:privilege>` - API Permissions

**Critical for app functionality.** Declares which Tizen APIs the app can access.

```xml
<!-- Network access -->
<tizen:privilege name="http://tizen.org/privilege/internet"/>
<tizen:privilege name="http://tizen.org/privilege/network.get"/>

<!-- TV-specific -->
<tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>
<tizen:privilege name="http://tizen.org/privilege/tv.window"/>
<tizen:privilege name="http://tizen.org/privilege/tv.channel"/>

<!-- Samsung-specific (AVPlay) -->
<tizen:privilege name="http://developer.samsung.com/privilege/avplay"/>
<tizen:privilege name="http://developer.samsung.com/privilege/productinfo"/>
```

#### Essential TV Privileges

| Privilege | Purpose |
|-----------|---------|
| `http://tizen.org/privilege/internet` | Internet access |
| `http://tizen.org/privilege/network.get` | Get network information (MAC, IP) |
| `http://tizen.org/privilege/tv.inputdevice` | TV remote control events |
| `http://tizen.org/privilege/tv.window` | TV window control (PIP, fullscreen) |
| `http://tizen.org/privilege/tv.channel` | TV channel access (IPTV) |
| `http://tizen.org/privilege/tv.display` | Display control |
| `http://developer.samsung.com/privilege/avplay` | Samsung AVPlay video player |
| `http://developer.samsung.com/privilege/productinfo` | Device product information |
| `http://developer.samsung.com/privilege/network.public` | Public network access |

---

### `<tizen:profile>` - Target Platform

```xml
<tizen:profile name="tv-samsung"/>
```

| Profile | Platform |
|---------|----------|
| `tv-samsung` | Samsung Smart TV |
| `tv` | Generic Tizen TV |
| `mobile` | Tizen Mobile |
| `wearable` | Tizen Wearable |

---

### `<tizen:setting>` - App Settings

Configures runtime behavior and hardware features.

```xml
<tizen:setting screen-orientation="landscape" 
               context-menu="enable" 
               background-support="disable" 
               encryption="disable" 
               install-location="auto" 
               hwkey-event="enable"/>
```

| Setting | Values | Description |
|---------|--------|-------------|
| `screen-orientation` | `landscape`, `portrait`, `auto` | Screen orientation lock |
| `context-menu` | `enable`, `disable` | Right-click context menu |
| `background-support` | `enable`, `disable` | Run in background |
| `encryption` | `enable`, `disable` | Encrypt app resources |
| `install-location` | `auto`, `internal`, `prefer-external` | Installation storage |
| `hwkey-event` | `enable`, `disable` | Hardware key events (TV remote) |

#### TV Hardware Key Setting

**Required for TV remote control support:**
```xml
<tizen:setting hwkey-event="enable"/>
```

Or the alternative format:
```xml
<tizen:setting key="http://tizen.org/feature/television.hardwarekey" value="true"/>
```

---

### `<tizen:metadata>` - Custom Metadata

Store key-value data accessible via Tizen API.

```xml
<tizen:metadata key="api_key" value="your-api-key"/>
<tizen:metadata key="app_version" value="2.1.0"/>
```

---

### `<tizen:launch_screen>` - Splash Screen

```xml
<tizen:launch_screen image="splash.png" 
                     image-border-width="0px 0px 0px 0px" 
                     background-color="#000000"/>
```

---

### `<tizen:content>` - Hosted App Start Page

For apps hosted externally (not packaged):

```xml
<tizen:content src="https://example.com/app/index.html"/>
```

---

### `<tizen:app-control>` - Intent Handling

Handle external app launches and deep links:

```xml
<tizen:app-control>
    <tizen:src name="index.html"/>
    <tizen:operation name="http://tizen.org/appcontrol/operation/view"/>
    <tizen:uri name="myapp"/>
</tizen:app-control>
```

---

## Complete Example

Here's a complete `config.xml` for a Samsung TV streaming app:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" 
        xmlns:tizen="http://tizen.org/ns/widgets" 
        id="http://example.com/bbnl-tv" 
        version="2.1.0" 
        viewmodes="maximized">
    
    <!-- Network Access -->
    <access origin="*" subdomains="true"/>
    
    <!-- App Identity -->
    <tizen:application id="bNoSQVUTDy.BBNLTV" 
                       package="bNoSQVUTDy" 
                       required_version="9.0"/>
    
    <!-- Entry Point -->
    <content src="index.html"/>
    
    <!-- App Info -->
    <name>BBNL TV</name>
    <description>BBNL Streaming Application for Samsung TV</description>
    <author email="support@bbnl.com" href="https://bbnl.com">BBNL Team</author>
    <icon src="icon.png"/>
    
    <!-- Hardware Features -->
    <feature name="http://tizen.org/feature/tv.inputdevice"/>
    <feature name="http://tizen.org/feature/screen.size.normal"/>
    
    <!-- Privileges (Permissions) -->
    <tizen:privilege name="http://tizen.org/privilege/internet"/>
    <tizen:privilege name="http://tizen.org/privilege/network.get"/>
    <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>
    <tizen:privilege name="http://tizen.org/privilege/tv.window"/>
    <tizen:privilege name="http://developer.samsung.com/privilege/avplay"/>
    <tizen:privilege name="http://developer.samsung.com/privilege/productinfo"/>
    
    <!-- Target Platform -->
    <tizen:profile name="tv-samsung"/>
    
    <!-- Runtime Settings -->
    <tizen:setting screen-orientation="landscape" 
                   context-menu="enable" 
                   background-support="disable" 
                   encryption="disable" 
                   install-location="auto" 
                   hwkey-event="enable"/>
</widget>
```

---

## Privilege Reference Table

### Network Privileges

| Privilege | Description | Risk Level |
|-----------|-------------|------------|
| `internet` | Basic internet access | Low |
| `network.get` | Get network info (MAC, IP, DNS) | Low |
| `network.set` | Modify network settings | High |
| `network.profile` | Network profile access | Medium |

### TV Privileges

| Privilege | Description | Risk Level |
|-----------|-------------|------------|
| `tv.inputdevice` | Remote control events | Low |
| `tv.window` | Window management | Low |
| `tv.channel` | Channel tuning (IPTV) | Medium |
| `tv.display` | Display settings | Low |
| `tv.audio` | Audio control | Low |

### Samsung-Specific Privileges

| Privilege | Description | Risk Level |
|-----------|-------------|------------|
| `avplay` | AVPlay video player | Low |
| `productinfo` | Device info (model, firmware) | Low |
| `network.public` | Public network access | Low |
| `billing` | Samsung in-app purchases | High |
| `sso.partner` | Samsung SSO login | Medium |

---

## Validation Rules

### Security Best Practices

1. **Minimize privileges** - Only request what you need
2. **Tizen rejects excessive privileges** during app certification
3. **Use HTTPS** for API endpoints when possible
4. **Validate XML** before packaging

### XML Rules

1. Must be valid XML syntax
2. Must have `<?xml version="1.0" encoding="UTF-8"?>` declaration
3. Root element must be `<widget>`
4. Required namespaces must be declared
5. Maximum attribute/element length: 2048 bytes

### Common Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Invalid XML | Syntax error | Check for unclosed tags |
| Missing privilege | API call fails | Add required privilege |
| App won't install | Invalid app ID | Check ID format |
| Remote not working | Missing hwkey-event | Add setting |

---

## Editing config.xml

### Using Tizen Studio

1. **Double-click** `config.xml` in Project Explorer
2. Use **form tabs** (Overview, Features, Privileges, Tizen) for UI editing
3. Use **Source tab** for direct XML editing
4. Form editor **auto-validates** changes

### Manual XML Editing

Only for advanced users. Ensure:
- Valid XML syntax
- Correct namespaces
- Proper element hierarchy
- No duplicate elements

---

## Testing Checklist

- [ ] XML validation passes
- [ ] All required privileges declared
- [ ] App ID is unique
- [ ] Icon file exists and is 128x128 PNG
- [ ] Content src points to valid HTML file
- [ ] Required version matches target devices
- [ ] hwkey-event enabled for remote control
- [ ] Network access configured correctly

---

## References

- [Tizen Config Editor Documentation](https://docs.tizen.org/application/tizen-studio/web-tools/config-editor/)
- [Tizen TV Privilege Reference](https://docs.tizen.org/application/web/tutorials/sec-privileges/)
- [Samsung Developer Documentation](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html)
- [W3C Widget Packaging Spec](https://www.w3.org/TR/widgets/)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-01 | Initial documentation |

---

*This documentation is for Samsung Tizen TV web applications (Tizen 4.0+)*
