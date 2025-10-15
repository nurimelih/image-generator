# Image Generator

Eşsiz ve dikkat çekici test görselleri üreten gelişmiş bir Node.js uygulaması. Mandelbrot fraktalları ve çeşitli soyut desenlerle zengin renk paletleri kullanarak her seferinde benzersiz görüntüler oluşturur.

## Özellikler

- **Çoklu Desen Desteği**: Mandelbrot fraktalları (%60 ağırlık) ve 5 farklı soyut desen
- **20+ Renk Paleti**: Önceden tanımlanmış paletler, karışık kombinasyonlar ve tamamen rastgele renkler
- **Akıllı Renk Sistemi**: Birbirine benzeyen renkleri otomatik olarak filtreler, her görsel net şekilde ayırt edilebilir
- **Makine İmzası** (`-s`): Her bilgisayara özgü görsel stil (renk sıcaklığı, desen tercihi, kontrast, noise)
- **Zaman Damgası**: Sol alt köşede tarih/saat, ortada milisaniye hassasiyetli zaman damgası
- **Frame Numarası**: Opsiyonel sağ alt köşe numaralandırma
- **Video Üretimi**: 10 saniyelik video üretimi (30 FPS) ile her 3 saniyede arkaplan değişimi
- **Dikey/Yatay Format**: Kare (640x640) veya dikey (480x854) çıktı
- **Noise Efektleri**: Mandelbrot arkaplanlarında karıncalı TV ve un serpilmiş efektleri

## Kurulum

```bash
npm install
# veya
yarn install
```

## Kullanım

### Temel Kullanım

```bash
# Basit resim üretimi (varsayılan: 640x640, rastgele desen)
node index.js
```

### Parametreler

| Parametre | Kısa | Açıklama | Örnek |
|-----------|------|----------|-------|
| `--signature` | `-s` | Makineye özgü görsel imza (renk, desen, kontrast tercihleri) | `-s` |
| `--frame` | `-f` | Sağ alt köşeye frame numarası ekler | `-f 42` |
| `--vertical` | `-v` | Dikey format (480x854) | `-v` |
| `--mandelbrot` | `-m` | Sadece Mandelbrot deseni | `-m` |
| `--dir` | `-d` | Özel çıktı dizini | `-d ./output` |
| `--video` | `--mp4` | Video üretimi (10 saniye, 30 FPS) | `--video` |

### Kullanım Örnekleri

#### Resim Üretimi

```bash
# Basit resim
node index.js

# Makine imzalı resim (tutarlı stil)
node index.js -s

# Frame numarası ile resim
node index.js -f 42

# Dikey format resim
node index.js -v

# Sadece Mandelbrot fraktalı
node index.js -m

# Makine imzalı Mandelbrot
node index.js -s -m

# Özel dizine kaydet
node index.js -d ./images

# Dikey Mandelbrot, frame 100, özel dizin, makine imzalı
node index.js -v -m -f 100 -d ./test-images -s

# Yatay, frame numaralı, özel dizin
node index.js -f 25 -d ~/Desktop/output
```

#### Video Üretimi

```bash
# Basit video (10 saniye, 30 FPS, her 3 saniyede arkaplan değişir)
node index.js --video

# Makine imzalı video (tutarlı stil)
node index.js -s --video

# Dikey format video
node index.js -v --video

# Sadece Mandelbrot videsu
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
- **Sağ Alt Köşe**: Frame numarası (opsiyonel, `-f` ile)

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

## Gereksinimler

- Node.js 14+
- FFmpeg (sadece video üretimi için)

## Lisans

MIT
