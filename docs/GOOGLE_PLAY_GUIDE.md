# Google Play Store Release & Android Build Guide

This guide details the procedure for generating a signed Android App Bundle (`.aab`) for the **Kittu Cafe** customer app (`com.kittucafe.customer`) and publishing it to the Google Play Console.

---

## 1. App Configuration (`apps/mobile/app.json`)

Ensure the package metadata is set:
- **App Name**: Kittu Cafe
- **Package Name**: `com.kittucafe.customer`
- **Version**: `1.0.0`
- **Version Code**: `1` (increment on each release)
- **Permissions**:
  - `INTERNET` (API requests & payment checkout)
  - `ACCESS_NETWORK_STATE` (Network health check)
  - `POST_NOTIFICATIONS` (Order status push notifications)

---

## 2. Generate Release Keystore (Local Build)

If building locally using Gradle instead of EAS:

```bash
# Generate Java keystore
keytool -genkeypair -v -storetype PKCS12 -keystore kittu-cafe-release.keystore \
  -alias kittucafe -keyalg RSA -keysize 2048 -validity 10000
```

Keep this keystore file and credentials backed up securely. Never commit keystores to version control.

---

## 3. Building with Expo Application Services (EAS Build - Recommended)

```bash
# 1. Install EAS CLI globally if not already present
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure EAS project
cd apps/mobile
eas build:configure

# 4. Generate Production Android App Bundle (.aab)
eas build --platform android --profile production
```

EAS handles remote signing and produces an optimized `.aab` file ready for the Play Store.

---

## 4. Google Play Console Submission Checklist

1. **Create App in Play Console**:
   - Default language: `English (India)`
   - Title: `Kittu Cafe — Food Ordering & Cafe`
   - App or game: `App`
   - Free or paid: `Free`
2. **Store Listing**:
   - **Short description** (up to 80 chars): Handcrafted coffee, sandwiches & pizzas in Dausa, Rajasthan.
   - **Full description**: Official customer ordering application for Kittu Cafe, Shiv Colony, Mariyara Wale, Dausa. Order online for swift delivery, takeaway, or book cozy dine-in tables.
   - **Screenshots**: Upload at least four 1080x1920 phone screenshots depicting the Home, Digital Menu, Cart, and Live Order Tracking screens.
   - **App Icon**: 512x512 PNG.
   - **Feature Graphic**: 1024x500 PNG.
3. **App Content Declarations**:
   - Privacy Policy URL (e.g. `https://kittucafe.in/privacy`).
   - Target Audience: 13+.
   - Financial features: Declare integration with Razorpay payment gateway for consumer food orders.
4. **Release Track**:
   - Upload `.aab` to Internal Testing track.
   - Test on physical Android devices.
   - Promote to Production once verification passes.
