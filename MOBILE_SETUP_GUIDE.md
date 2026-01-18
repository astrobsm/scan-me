# Mobile App Setup Guide

## 🚨 Current Issue

Your project path has **spaces** (`E:\SCAN ME`), which is causing issues with Expo/React Native.

## ✅ **Solution 1: Test on Web (Fastest)**

Since you have a web version, test the optimizations there first:

```bash
cd "E:\SCAN ME\web"
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## ✅ **Solution 2: Rename Project Folder (Recommended)**

Rename the folder to remove spaces:

### Windows PowerShell:
```powershell
# Exit any running terminals in VS Code first
cd E:\
Rename-Item "SCAN ME" "scan-me"
cd scan-me\mobile
npm install
npm start
```

After renaming, update VS Code workspace path.

## ✅ **Solution 3: Use Android Studio Emulator**

If you want native mobile testing:

### Step 1: Install Android Studio
1. Download from https://developer.android.com/studio
2. Run installer (default settings)
3. Open Android Studio → More Actions → SDK Manager
4. Install:
   - Android SDK Platform (API 33 or 34)
   - Android SDK Build-Tools
   - Android Emulator

### Step 2: Set Environment Variables

**Windows PowerShell (Run as Administrator):**
```powershell
# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\user\AppData\Local\Android\Sdk", "User")

# Add to PATH
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$currentPath;C:\Users\user\AppData\Local\Android\Sdk\platform-tools;C:\Users\user\AppData\Local\Android\Sdk\tools"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")

# Restart terminal for changes to take effect
```

### Step 3: Create Virtual Device
1. Open Android Studio
2. More Actions → Virtual Device Manager
3. Create Device → Select Pixel 6
4. Download System Image (API 33 recommended)
5. Finish and start emulator

### Step 4: Run App
```bash
# After renaming folder to scan-me
cd E:\scan-me\mobile
npm run android
```

## ✅ **Solution 4: Test on Real Device (Expo Go)**

After fixing the folder name:

### Android:
1. Install **Expo Go** from Play Store
2. Make sure phone and PC are on **same WiFi**
3. Run: `npm start`
4. Scan QR code with Expo Go app

### iOS (Mac required):
```bash
npm run ios
```

## 🔧 **Quick Fix for Current Setup**

Since renaming might lose git history, use quotes properly:

### Fix package.json scripts:
```json
{
  "scripts": {
    "start": "expo start --clear",
    "android": "expo start --android --clear",
    "ios": "expo start --ios --clear"
  }
}
```

Then run:
```bash
cd "E:\SCAN ME\mobile"
npm run start
```

## 📱 **Test Performance Fixes Without Native Build**

The web version uses the same React components and logic:

```bash
# Test the performance optimizations
cd "E:\SCAN ME\web"
npm install
npm run dev
```

Features to test:
- ✅ Speech-to-Text with confidence monitoring
- ✅ Text-to-Speech with emotions
- ✅ Image compression (via browser)
- ✅ Debounced text input
- ✅ Memory management

## 🎯 **Recommended Approach**

**For Now:**
1. Test on **Web** first (fastest way to verify fixes)
2. Rename folder to `scan-me` (removes space issue)
3. Install Android Studio if you need native features
4. Use Expo Go for quick mobile testing

**For Production:**
1. Keep folder name without spaces
2. Use EAS Build for production builds
3. Test on real devices via Expo Go
4. Generate APK/IPA for distribution

## 🚀 **Quick Start (Web Testing)**

```bash
cd "E:\SCAN ME\web"
npm install
npm start
```

Open http://localhost:5173 and test:
- Speech to Text page
- Text to Speech page  
- Video Creator (with 3D avatars)

All the performance optimizations apply to both web and mobile!

## 📞 **Still Having Issues?**

1. **Folder name has spaces**: Rename to `scan-me`
2. **Android SDK not found**: Install Android Studio
3. **Permission errors**: Run PowerShell as Administrator
4. **Want to test quickly**: Use web version first

---

**Bottom Line**: Test the performance fixes on the **web version** first, then set up mobile properly by renaming the folder.
