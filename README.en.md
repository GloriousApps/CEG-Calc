# CEG Calc

<p align="center">
  <img src="public/icon.png" alt="CEG Calc" width="180" />
</p>

<p align="center">
  A modern calculator for fast and clear measurement and engineering calculations on mobile and web.
</p>

<p align="center">
  <a href="README.md">🇹🇷 Türkçe</a> · <a href="README.en.md"><strong>🇺🇸 English</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/release-v1.5.0-0d3171?style=for-the-badge" alt="Release v1.5.0" />
  <img src="https://img.shields.io/badge/build-passing-16a34a?style=for-the-badge" alt="Build passing" />
  <img src="https://img.shields.io/badge/android-8.0%2B-22c55e?style=for-the-badge&logo=android&logoColor=white" alt="Android 8.0+" />
</p>

<p align="center">
  <a href="https://github.com/GloriousApps/CEG-Calc/releases">Download APK</a> ·
  <a href="https://ceg-calc.vercel.app">Open web app</a> ·
  <a href="https://github.com/GloriousApps/CEG-Calc/issues">Report an issue</a>
</p>

## Features

- Feet, inch and yard input with live `5 FEET 3 1/2 INCH` measurement entry and editing
- Dimension cycling with the same unit key: `INCH → SQUARE INCH → CUBIC INCH`
- Area and volume calculations with complete unit labels in results
- Feet–inch–yard conversion chain with `Conv`
- Store, Rcl, M+, M− and MC memory operations with an on-screen M indicator
- Tape/history for reusing previous results
- Settings for fraction precision (1/2–1/64), normal/engineering decimal places (1–6), and automatic/portrait/landscape layout
- Dark theme and Android haptic feedback

## Keyboard shortcuts

- `0–9`: number input
- `.` or `,`: decimal input
- `+`, `-`, `*`: arithmetic operations
- Numpad `/`: division; regular `/`: fraction bar
- `Enter` or `=`: calculate the result
- `Backspace`: delete the last part; `Escape` or `Delete`: Clear
- `F`: Feet, `I`: Inch, `Y`: Yard, `C`: Conv

## Development

```bash
npm install
npm run dev
```

To build an Android debug APK:

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## Version

Current version: `v1.5.0`
