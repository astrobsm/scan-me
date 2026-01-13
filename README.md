# CHARLES-DOUGLAS SCAN APP 📝

> Convert handwritten notes into editable, searchable digital text with clinical-grade reliability
> **Text-to-Speech • Speech-to-Text • Handwriting OCR**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20iOS%20%7C%20Android-brightgreen.svg)
![Offline](https://img.shields.io/badge/offline-supported-success.svg)

## 🎯 Features

### Core Features
- ✅ **Handwriting → Text** conversion with high accuracy
- ✅ **Offline OCR** using TensorFlow.js/TensorFlow Lite
- ✅ **Editable output** with real-time corrections
- ✅ **Export** to PDF, Word, TXT
- ✅ **Cross-platform** - Web, iOS, Android

### Advanced Features
- 🏥 **Medical terminology** dictionary support
- 📐 **Image preprocessing** - skew correction, noise reduction
- 🌍 **Multi-language** support (expandable)
- 📊 **Table recognition** (coming soon)
- 🔒 **End-to-end encryption** for privacy

## 🏗️ Project Structure

```
SCAN ME/
├── mobile/                 # React Native (Expo) mobile app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   ├── components/     # UI components
│   │   └── navigation/     # Navigation config
│   └── app.json
│
├── web/                    # React web application
│   ├── src/
│   │   ├── pages/          # Web pages
│   │   ├── components/     # UI components
│   │   └── styles/         # CSS styles
│   └── package.json
│
├── shared/                 # Shared code (OCR, preprocessing)
│   ├── ocr/                # TensorFlow OCR engine
│   ├── preprocessing/      # Image processing pipeline
│   ├── postprocessing/     # Spell check, medical dictionary
│   ├── export/             # PDF, Word, TXT export
│   └── utils/              # Common utilities
│
└── models/                 # TensorFlow models
    └── handwriting/        # Handwriting recognition models
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (for mobile)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/scan-me.git
cd scan-me

# Install dependencies
npm install

# Start web app
npm run start:web

# Start mobile app
npm run start:mobile
```

## 📱 Mobile App

```bash
cd mobile
npm install
expo start
```

## 🌐 Web App

```bash
cd web
npm install
npm run dev
```

## 🔧 OCR Pipeline

SCAN ME uses a sophisticated 4-stage pipeline for maximum accuracy:

1. **Image Acquisition** - High-res capture with auto-focus
2. **Preprocessing** - Grayscale, thresholding, skew correction
3. **Recognition** - CNN + LSTM neural network
4. **Postprocessing** - Spell check, medical dictionary

## 🏥 Medical Mode

Enable medical terminology recognition for:
- Prescription handwriting
- Clinical notes
- Medical abbreviations
- Drug names

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.
