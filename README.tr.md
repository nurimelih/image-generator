# Image Generator

Test ve mock amaçlı benzersiz görseller ureten Node.js uygulaması. Mandelbrot fraktallari ve soyut desenlerle her seferinde farkli goruntuler olusturur.

## Neden?

Yazilim testlerinde veya prototiplerde kullanmak icin hizlica benzersiz gorseller uretmek gerekebilir. Bu arac tam olarak bunu yapar - her calistirmada farkli renkler ve desenlerle yeni bir gorsel olusturur.

## Kurulum

```bash
npm install
```

Video uretimi icin FFmpeg gereklidir:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

## Kullanim

Uc farkli mod mevcut:

### Desktop Uygulamasi

```bash
npm run app
```

Electron tabanli arayuz ile tum parametreleri gorsel olarak kontrol edebilirsiniz.

### Web Arayuzu

```bash
npm run web
```

Tarayicinizda `http://localhost:3000` adresini acin.

### Komut Satiri

```bash
# Basit resim
node index.js

# Dikey format (480x854)
node index.js -v

# Sadece Mandelbrot fraktali
node index.js -m

# Ozel metin ekle
node index.js -f "Test 001"

# Video uret (10 saniye)
node index.js --video

# Parametreleri birlestirebilirsiniz
node index.js -v -m -f "Frame 42" -d ./output
```

### Parametreler

| Parametre | Kisa | Aciklama |
|-----------|------|----------|
| `--vertical` | `-v` | Dikey format |
| `--mandelbrot` | `-m` | Sadece Mandelbrot deseni |
| `--frame` | `-f` | Gorsele metin ekle |
| `--dir` | `-d` | Cikti dizini |
| `--video` | `--mp4` | Video uret |
| `--signature` | `-s` | Makineye ozgu tutarli stil |

## Cikti

- Resimler: BMP, 640x640 (veya dikey: 480x854)
- Videolar: MP4, 10 saniye, 30 FPS
- Varsayilan dizin: `./generated/`

## Lisans

MIT
