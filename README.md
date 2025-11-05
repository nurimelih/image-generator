# Image Generator

Eşsiz ve dikkat çekici test görselleri üreten gelişmiş bir Node.js uygulaması. Mandelbrot fraktalları ve çeşitli soyut desenlerle zengin renk paletleri kullanarak her seferinde benzersiz görüntüler oluşturur.

**3 Farklı Kullanım Modu:**
- 🖥️ **Desktop App** - Electron ile modern masaüstü uygulaması
- 🌐 **Web Interface** - Tarayıcı tabanlı arayüz
- ⚡ **CLI** - Terminal komut satırı

---

## 🚀 Hızlı Başlangıç

Projeyi indirdikten sonra 2 adımda çalıştırın:

### 1. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

> **Not:** Proje hem npm hem de yarn ile uyumludur. İstediğinizi kullanabilirsiniz.

### 2. Tercih Ettiğiniz Modu Başlatın

**Masaüstü Uygulaması (Önerilen - GUI):**
```bash
npm run app
# veya
yarn app
```

**Web Arayüzü:**
```bash
npm run web
# veya
yarn web
# Tarayıcınızda: http://localhost:3000
```

**Komut Satırı (Hızlı Test):**
```bash
npm start
# veya
yarn start
# veya direkt:
node index.js
```

**Video üretimi için FFmpeg gereklidir:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows - https://ffmpeg.org/download.html
```

---

## 📦 Kullanıma Hazır Sürüm (Derleme)

Kod yerine direkt çalıştırılabilir uygulama isterseniz:

### Electron Desktop Uygulaması Olarak Derleme

```bash
# Bağımlılıkları yükleyin (electron-builder dahil)
npm install  # veya: yarn install

# İşletim sisteminize göre derleyin:
npm run build:mac      # macOS için .dmg
yarn build:mac

npm run build:win      # Windows için .exe
yarn build:win

npm run build:linux    # Linux için AppImage
yarn build:linux
```

Derlenen dosyalar `dist/` klasöründe oluşur. Bu dosyaları Node.js olmayan bilgisayarlarda da çalıştırabilirsiniz.

### Alternatif: Standalone Çalıştırma

Node.js yüklü olmayan ortamlarda çalıştırmak için [pkg](https://github.com/vercel/pkg) kullanabilirsiniz:

```bash
# pkg'yi global yükleyin
npm install -g pkg
# veya
yarn global add pkg

# Tek binary dosya oluşturun
npm run package:mac   # veya: yarn package:mac
npm run package:win   # veya: yarn package:win
npm run package:linux # veya: yarn package:linux
```

---

## Özellikler

### Görsel Üretim
- **Çoklu Desen Desteği**: Mandelbrot fraktalları (%60 ağırlık) ve 5 farklı soyut desen
- **20+ Renk Paleti**: Önceden tanımlanmış paletler, karışık kombinasyonlar ve tamamen rastgele renkler
- **Akıllı Renk Sistemi**: Birbirine benzeyen renkleri otomatik olarak filtreler, her görsel net şekilde ayırt edilebilir
- **Makine İmzası** (`-s`): Her bilgisayara özgü görsel stil (renk sıcaklığı, desen tercihi, kontrast, noise)
- **Zaman Damgası**: Sol alt köşede tarih/saat, ortada milisaniye hassasiyetli zaman damgası
- **Özel Metin**: Sağ alt köşeye istediğiniz metni yazabilme (`-f` parametresi)
- **Video Üretimi**: 10 saniyelik video üretimi (30 FPS) ile her 3 saniyede arkaplan değişimi
- **Dikey/Yatay Format**: Kare (640x640) veya dikey (480x854) çıktı
- **Noise Efektleri**: Mandelbrot arkaplanlarında karıncalı TV ve un serpilmiş efektleri

### Desktop App Özellikleri
- 🎨 Modern, karanlık tema arayüz
- 📁 Finder entegrasyonu (dosyayı Finder'da göster)
- 👁 macOS Preview ile hızlı önizleme
- 🖼️ Uygulama içi görsel/video önizleme
- 🗑️ Dosya yönetimi (görüntüleme, silme)
- ⚙️ Tüm parametreleri GUI üzerinden kontrol

## Kurulum

```bash
npm install
# veya
yarn install
```

### FFmpeg Kurulumu (Video üretimi için)

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows
# https://ffmpeg.org/download.html adresinden indirin
```

## Kullanım

### 🖥️ Desktop App (Önerilen)

Electron tabanlı masaüstü uygulaması ile görsel arayüz üzerinden kullanım:

```bash
npm run app
```

**Özellikler:**
- Tüm parametreleri dropdown ve checkbox'larla seçin
- Özel metin alanı ile sağ alt köşeye yazı ekleyin
- Oluşturulan dosyaları grid görünümünde görün
- Resimlere tıklayarak app içinde önizleyin
- 👁 butonu ile macOS Preview'da açın
- 📁 butonu ile Finder'da gösterin
- 🗑️ butonu ile silin

### 🌐 Web Interface

Tarayıcı tabanlı kullanım (Desktop App olmadan):

```bash
npm run web
```

Tarayıcınızda açın: `http://localhost:3000`

### ⚡ CLI (Command Line)

Terminal üzerinden hızlı kullanım:

#### Temel Kullanım

```bash
# Basit resim üretimi (varsayılan: 640x640, rastgele desen)
node index.js
```

#### Parametreler

| Parametre | Kısa | Açıklama | Örnek |
|-----------|------|----------|-------|
| `--signature` | `-s` | Makineye özgü görsel imza (renk, desen, kontrast tercihleri) | `-s` |
| `--frame` | `-f` | Sağ alt köşeye özel metin ekler | `-f "Test 001"` |
| `--vertical` | `-v` | Dikey format (480x854) | `-v` |
| `--mandelbrot` | `-m` | Sadece Mandelbrot deseni | `-m` |
| `--dir` | `-d` | Özel çıktı dizini | `-d ./output` |
| `--video` | `--mp4` | Video üretimi (10 saniye, 30 FPS) | `--video` |

#### Kullanım Örnekleri

**Resim Üretimi**

```bash
# Basit resim
node index.js

# Makine imzalı resim (tutarlı stil)
node index.js -s

# Özel metin ile resim
node index.js -f "Frame 042"

# Dikey format resim
node index.js -v

# Sadece Mandelbrot fraktalı
node index.js -m

# Makine imzalı Mandelbrot
node index.js -s -m

# Özel dizine kaydet
node index.js -d ./images

# Dikey Mandelbrot, özel metin, özel dizin, makine imzalı
node index.js -v -m -f "Test" -d ./test-images -s

# Yatay, özel metin, özel dizin
node index.js -f "Sample 25" -d ~/Desktop/output
```

**Video Üretimi**

```bash
# Basit video (10 saniye, 30 FPS, her 3 saniyede arkaplan değişir)
node index.js --video

# Makine imzalı video (tutarlı stil)
node index.js -s --video

# Dikey format video
node index.js -v --video

# Sadece Mandelbrot videosu
node index.js -m --mp4

# Makine imzalı Mandelbrot videosu
node index.js -s -m --video

# Özel dizine video
node index.js --video -d ./videos

# Dikey Mandelbrot videosu, özel dizin, makine imzalı
node index.js -v -m --video -d ~/Movies/test -s
```

## Çıktı Formatı

### Resim Özellikleri
- **Format**: BMP (24-bit)
- **Boyut**: 640x640 (kare) veya 480x854 (dikey)
- **Dosya adı**: `mock_<timestamp>.bmp`
- **Varsayılan dizin**: `./generated/`

### Görsel Elemanlar
- **Sol Alt Köşe**: Tarih (DD.MM.YYYY) ve Saat (HH:MM:SS)
- **Orta**: Milisaniye hassasiyetli zaman (HH:MM:SS.mmm)
- **Sağ Alt Köşe**: Özel metin (opsiyonel, `-f` ile)

### Video Özellikleri
- **Format**: MP4 (H.264)
- **Süre**: 10 saniye
- **FPS**: 30
- **Arkaplan Değişimi**: Her 3 saniyede
- **Frame Numaraları**: Otomatik (0'dan başlar)
- **Dosya adı**: `video_<timestamp>.mp4`

## Desenler

1. **Mandelbrot Fraktalı** (%60 olasılık)
   - Rastgele zoom ve offset
   - Noise efektli arkaplan
   - 50-250 iterasyon

2. **Güçlü Dalga Deseni** (%8 olasılık)
   - Dalgalı şeritler
   - Yüksek amplitüd

3. **Spiral Patlama** (%8 olasılık)
   - 3-8 kollu spiraller
   - Merkez etrafında dönen desenler

4. **Dramatik Akışkan Şeritler** (%8 olasılık)
   - Akışkan, dalgalı bantlar
   - Yüksek kontrast

5. **Keskin Çapraz Desenler** (%8 olasılık)
   - Rastgele açılı şeritler
   - Quantize geçişler

6. **Çoklu Merkez Patlaması** (%8 olasılık)
   - 3-6 merkez nokta
   - 6-14 ışın yayıyor

## Renk Sistemi

### Palet Modları
- **%40**: Doğrudan tanımlı paletlerden biri seçilir
- **%40**: Farklı paletlerden renkler karıştırılır
- **%20**: Tamamen rastgele renkler

### Otomatik Filtreler
- Minimum 80 birim renk farkı (Euclidean distance)
- Minimum 60 birim canlılık (RGB range)
- Gri tonlar ve monoton renkler engellenir

### Paletler
Cyberpunk Neon, Sunset Gradient, Ocean Depths, Forest Aurora, Retro Synthwave, Cosmic Purple, Warm Autumn, Cool Mint, Fire and Ice, Tropical Paradise, Deep Space, Candy Land, Desert Sunset, Electric Blue, Velvet Night, Spring Blossom, Lava Flow, Arctic Ice, Neon City, Golden Hour, Cherry Blossom

## Makine İmzası

`-s` veya `--signature` parametresi ile aktif edilir. Her bilgisayar, hostname ve kullanıcı adından türetilen benzersiz bir "görsel parmak izi" alır.

### Özellikler

**Deterministik**: Aynı bilgisayarda her zaman aynı stil tercihleri
**Görünmez**: Görsele yazı yazmaz, sadece stil parametrelerini etkiler
**Tutarlı**: Tüm görseller benzer stil atmosferine sahip olur

### Stil Parametreleri

- **Renk Sıcaklığı** (Soğuk/Dengeli/Sıcak)
  - Soğuk: Mavi, turkuaz, yeşil tonları tercih eder
  - Sıcak: Kırmızı, turuncu, sarı tonları tercih eder
  - Dengeli: Tüm renk paletlerinden seçim yapar

- **Desen Tercihi** (Simetrik/Akışkan)
  - Simetrik: Mandelbrot, spiral, çoklu merkez desenlerini tercih eder
  - Akışkan: Dalga, akışkan şeritler, çapraz desenlerini tercih eder

- **Kontrast Seviyesi** (30-70%)
  - Her makineye özgü kontrast yoğunluğu
  - Renkler arası geçişlerin keskinliğini etkiler

- **Noise Yoğunluğu** (5-15%)
  - Her makineye özgü texture miktarı
  - Görsele eklenen ince grenli doku

### Örnek Kullanım

```bash
# Makine imzası ile resim üret
node index.js -s

# Konsol çıktısı:
# Makine İmzası: hostname-username
# Stil Tercihleri:
#   - Renk Sıcaklığı: Soğuk
#   - Desen Tercihi: Simetrik
#   - Kontrast Seviyesi: 52%
#   - Noise Yoğunluğu: 12%
```

### Kullanım Senaryoları

- **Test Ortamları**: Farklı sunuculardan gelen görselleri kolayca ayırt etme
- **Tutarlı Stil**: Aynı makineden üretilen tüm görseller benzer atmosfere sahip
- **Görsel Takip**: Görselin hangi makineden geldiğini stil tercihlerinden anlama

## Derleme ve Dağıtım

### Electron Desktop App Derleme

Electron uygulamasını dağıtılabilir dosya olarak derlemek için:

```bash
# Bağımlılıkları yükleyin (electron-builder dahil)
npm install

# İşletim sisteminize göre derleyin:
npm run build:mac      # macOS için .dmg ve .zip
npm run build:win      # Windows için .exe (NSIS installer ve portable)
npm run build:linux    # Linux için AppImage ve .deb

# Tüm platformlar için (sadece macOS'ta çalışır):
npm run build:all
```

Derlenen dosyalar `dist/` klasöründe oluşur ve Node.js olmayan sistemlerde de çalışır.

### Web Server Olarak Deploy

Express sunucusunu production ortamına deploy etmek için:

```bash
# PM2 ile production'da çalıştır
npm install -g pm2
pm2 start server.js --name image-generator

# Nginx reverse proxy ile kullan
# /etc/nginx/sites-available/image-generator:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Container

```dockerfile
FROM node:18-alpine

# FFmpeg yükle
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

```bash
# Docker image oluştur
docker build -t image-generator .

# Container çalıştır
docker run -p 3000:3000 -v $(pwd)/generated:/app/generated image-generator
```

## NPM / Yarn Scripts

Tüm komutlar hem `npm run` hem de `yarn` ile çalışır:

```bash
# CLI kullanımı
npm start              # Basit resim üret
yarn start

npm run vertical       # Dikey resim üret
yarn vertical

npm run mandelbrot     # Mandelbrot resim üret
yarn mandelbrot

npm run video          # Video üret
yarn video

# Web/Desktop kullanımı
npm run web            # Web sunucusu başlat (http://localhost:3000)
yarn web

npm run app            # Desktop uygulaması başlat
yarn app

# Electron derleme
npm run build:mac      # macOS için .dmg ve .zip
yarn build:mac

npm run build:win      # Windows için .exe (installer + portable)
yarn build:win

npm run build:linux    # Linux için AppImage ve .deb
yarn build:linux

npm run build:all      # Tüm platformlar için derleme
yarn build:all

# Standalone binary derleme (pkg gerekli)
npm run package:mac    # macOS için tek dosya
yarn package:mac

npm run package:win    # Windows için tek dosya
yarn package:win

npm run package:linux  # Linux için tek dosya
yarn package:linux
```

## Proje Yapısı

```
image-generator/
├── index.js              # Ana CLI kodu (görsel/video üretimi)
├── server.js             # Express web sunucusu
├── electron-main.js      # Electron ana process
├── preload.js            # Electron IPC köprüsü
├── package.json          # Proje yapılandırması
├── public/
│   └── index.html        # Web arayüzü
├── generated/            # Üretilen dosyalar (otomatik oluşturulur)
└── frames/               # Geçici video frame'leri (otomatik temizlenir)
```

## Gereksinimler

- Node.js 14+
- FFmpeg (sadece video üretimi için)
- Electron (sadece desktop app için)

## Lisans

MIT

## Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açarak neyi değiştirmek istediğinizi tartışın.

## Destek

Sorun yaşıyorsanız veya öneriniz varsa lütfen GitHub Issues sayfasında bir issue açın.
