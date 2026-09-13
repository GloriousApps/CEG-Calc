# CEG Calc

CEG Calc, yapı/inşaat ölçülerini modern ve mobil uyumlu bir arayüzle sunan mühendislik hesap makinesidir.

## Özellikler

- Feet, inch ve yard girişleri; `5 FEET 3 1/2 INCH` biçiminde canlı ölçü oluşturma ve geri alma
- Aynı birim tuşuyla `INCH → SQUARE INCH → CUBIC INCH` boyut döngüsü
- Alan ve hacim hesapları; sonuçlarda `SQUARE FEET`, `SQUARE INCH`, `CUBIC INCH` gibi tam etiketler
- `Conv` ile feet–inch–yard dönüşüm zinciri
- Store, Rcl, M+, M−, MC hafıza işlemleri ve ekrandaki M göstergesi
- Tape/Geçmiş kaydı; logoya iki kez dokunarak işlem bandını açma ve sonuçları yeniden kullanma
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

Güncel sürüm: `v1.2.0`
