# CEG Calc

<p align="center">
  <img src="public/icon.png" alt="CEG Calc" width="180" />
</p>

<p align="center">
  Mobil ve web üzerinde çalışan, ölçü ve mühendislik hesaplarını hızlı ve anlaşılır biçimde yapan modern hesap makinesi.
</p>

<p align="center">
  <a href="README.md">🇹🇷 Türkçe</a> · <a href="README.en.md">🇺🇸 English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/release-v1.4.0-0d3171?style=for-the-badge" alt="Release v1.4.0" />
  <img src="https://img.shields.io/badge/build-passing-16a34a?style=for-the-badge" alt="Build passing" />
  <img src="https://img.shields.io/badge/android-8.0%2B-22c55e?style=for-the-badge&logo=android&logoColor=white" alt="Android 8.0+" />
</p>

<p align="center">
  <a href="https://github.com/GloriousApps/CEG-Calc/releases">APK indir</a> ·
  <a href="https://ceg-calc.vercel.app">Web uygulamasını aç</a> ·
  <a href="https://github.com/GloriousApps/CEG-Calc/issues">Sorun bildir</a>
</p>

## Özellikler

- Feet, inch ve yard girişleri; `5 FEET 3 1/2 INCH` biçiminde canlı ölçü oluşturma ve geri alma
- Aynı birim tuşuyla `INCH → SQUARE INCH → CUBIC INCH` boyut döngüsü
- Alan ve hacim hesapları; sonuçlarda tam birim etiketleri
- `Conv` ile feet–inch–yard dönüşüm zinciri
- Store, Rcl, M+, M−, MC hafıza işlemleri ve ekrandaki M göstergesi
- Tape/Geçmiş kaydı; sonuçları yeniden kullanma
- Ayarlar: kesir hassasiyeti (1/2–1/64), normal/mühendislik ondalık hane (1–6), otomatik/dikey/yatay görünüm
- Koyu tema ve Android haptic geri bildirim

## Klavye kısayolları

- `0–9`: sayı girişi
- `.` veya `,`: ondalık giriş
- `+`, `-`, `*`: dört işlem
- Numpad `/`: bölme; normal `/`: kesir çizgisi
- `Enter` veya `=`: sonucu hesaplar
- `Backspace`: son parçayı siler; `Escape` veya `Delete`: Clear
- `F`: Feet, `I`: Inch, `Y`: Yard, `C`: Conv

## Geliştirme

```bash
npm install
npm run dev
```

Android debug APK oluşturmak için:

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## Sürüm

Güncel sürüm: `v1.4.0`
