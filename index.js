import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSolidColorImageFile = ({width = 320, height = 320, patternMode = 'random'} = {}) => {
    const headerSize = 54;
    const imageSize = width * height * 3;
    const fileSize = headerSize + imageSize;
    const bmpData = new Uint8Array(fileSize);

    // BMP Header
    bmpData[0] = 0x42;
    bmpData[1] = 0x4d;
    writeUint32LE(bmpData, 2, fileSize);
    writeUint32LE(bmpData, 6, 0);
    writeUint32LE(bmpData, 10, headerSize);
    writeUint32LE(bmpData, 14, 40);
    writeUint32LE(bmpData, 18, width);
    writeUint32LE(bmpData, 22, height);
    writeUint16LE(bmpData, 26, 1);
    writeUint16LE(bmpData, 28, 24);
    writeUint32LE(bmpData, 30, 0);
    writeUint32LE(bmpData, 34, imageSize);
    writeUint32LE(bmpData, 38, 2835);
    bmpData[42] = 2835 & 0xff;
    bmpData[43] = (2835 >> 8) & 0xff;
    bmpData[44] = (2835 >> 16) & 0xff;
    bmpData[45] = (2835 >> 24) & 0xff;
    bmpData[46] = 0;
    bmpData[47] = 0;
    bmpData[48] = 0;
    bmpData[49] = 0;
    bmpData[50] = 0;
    bmpData[51] = 0;
    bmpData[52] = 0;
    bmpData[53] = 0;

    // Genişletilmiş renk paletleri
    const colorPalettes = [
        // Cyberpunk neon
        [
            {r: 255, g: 0, b: 110},    // Neon pink
            {r: 0, g: 255, b: 255},    // Cyan
            {r: 138, g: 43, b: 226},   // Blue violet
            {r: 255, g: 20, b: 147},   // Deep pink
            {r: 0, g: 191, b: 255}     // Deep sky blue
        ],
        // Sunset gradient
        [
            {r: 255, g: 94, b: 77},    // Coral
            {r: 255, g: 121, b: 63},   // Orange
            {r: 252, g: 142, b: 172},  // Pink
            {r: 145, g: 152, b: 229},  // Lavender
            {r: 83, g: 82, b: 237}     // Purple blue
        ],
        // Ocean depths
        [
            {r: 0, g: 180, b: 216},    // Turquoise
            {r: 0, g: 119, b: 182},    // Ocean blue
            {r: 3, g: 4, b: 94},       // Navy
            {r: 2, g: 62, b: 138},     // Royal blue
            {r: 72, g: 202, b: 228}    // Sky blue
        ],
        // Forest aurora
        [
            {r: 26, g: 188, b: 156},   // Turquoise green
            {r: 46, g: 213, b: 115},   // Emerald
            {r: 0, g: 168, b: 107},    // Green
            {r: 52, g: 211, b: 153},   // Medium spring
            {r: 22, g: 160, b: 133}    // Light sea green
        ],
        // Retro synthwave
        [
            {r: 255, g: 0, b: 128},    // Hot pink
            {r: 255, g: 111, b: 0},    // Orange
            {r: 204, g: 0, b: 204},    // Magenta
            {r: 102, g: 0, b: 153},    // Purple
            {r: 255, g: 51, b: 153}    // Pink
        ],
        // Cosmic purple
        [
            {r: 106, g: 27, b: 154},   // Deep purple
            {r: 142, g: 68, b: 173},   // Medium purple
            {r: 155, g: 89, b: 182},   // Amethyst
            {r: 123, g: 36, b: 163},   // Purple
            {r: 171, g: 71, b: 188}    // Orchid
        ],
        // Warm autumn
        [
            {r: 230, g: 126, b: 34},   // Chocolate
            {r: 231, g: 76, b: 60},    // Red
            {r: 243, g: 156, b: 18},   // Orange
            {r: 211, g: 84, b: 0},     // Dark orange
            {r: 192, g: 57, b: 43}     // Dark red
        ],
        // Cool mint
        [
            {r: 26, g: 188, b: 156},   // Turquoise
            {r: 22, g: 160, b: 133},   // Green sea
            {r: 52, g: 152, b: 219},   // Blue
            {r: 41, g: 128, b: 185},   // Peter river
            {r: 46, g: 204, b: 113}    // Emerald
        ],
        // Fire and ice
        [
            {r: 255, g: 69, b: 0},     // Orange red
            {r: 255, g: 140, b: 0},    // Dark orange
            {r: 0, g: 191, b: 255},    // Deep sky blue
            {r: 30, g: 144, b: 255},   // Dodger blue
            {r: 255, g: 215, b: 0}     // Gold
        ],
        // Tropical paradise
        [
            {r: 255, g: 105, b: 180},  // Hot pink
            {r: 255, g: 215, b: 0},    // Gold
            {r: 0, g: 255, b: 127},    // Spring green
            {r: 64, g: 224, b: 208},   // Turquoise
            {r: 255, g: 182, b: 193}   // Light pink
        ],
        // Deep space
        [
            {r: 25, g: 25, b: 112},    // Midnight blue
            {r: 138, g: 43, b: 226},   // Blue violet
            {r: 75, g: 0, b: 130},     // Indigo
            {r: 147, g: 112, b: 219},  // Medium purple
            {r: 72, g: 61, b: 139}     // Dark slate blue
        ],
        // Candy land
        [
            {r: 255, g: 182, b: 193},  // Light pink
            {r: 255, g: 192, b: 203},  // Pink
            {r: 255, g: 105, b: 180},  // Hot pink
            {r: 255, g: 20, b: 147},   // Deep pink
            {r: 199, g: 21, b: 133}    // Medium violet red
        ],
        // Desert sunset
        [
            {r: 255, g: 127, b: 80},   // Coral
            {r: 255, g: 99, b: 71},    // Tomato
            {r: 255, g: 165, b: 0},    // Orange
            {r: 218, g: 165, b: 32},   // Goldenrod
            {r: 244, g: 164, b: 96}    // Sandy brown
        ],
        // Electric blue
        [
            {r: 0, g: 255, b: 255},    // Cyan
            {r: 0, g: 191, b: 255},    // Deep sky blue
            {r: 30, g: 144, b: 255},   // Dodger blue
            {r: 100, g: 149, b: 237},  // Cornflower blue
            {r: 135, g: 206, b: 250}   // Light sky blue
        ],
        // Velvet night
        [
            {r: 72, g: 61, b: 139},    // Dark slate blue
            {r: 106, g: 90, b: 205},   // Slate blue
            {r: 123, g: 104, b: 238},  // Medium slate blue
            {r: 147, g: 112, b: 219},  // Medium purple
            {r: 138, g: 43, b: 226}    // Blue violet
        ],
        // Spring blossom
        [
            {r: 255, g: 182, b: 193},  // Light pink
            {r: 255, g: 192, b: 203},  // Pink
            {r: 255, g: 240, b: 245},  // Lavender blush
            {r: 221, g: 160, b: 221},  // Plum
            {r: 216, g: 191, b: 216}   // Thistle
        ],
        // Lava flow
        [
            {r: 178, g: 34, b: 34},    // Firebrick
            {r: 220, g: 20, b: 60},    // Crimson
            {r: 255, g: 0, b: 0},      // Red
            {r: 255, g: 69, b: 0},     // Orange red
            {r: 255, g: 99, b: 71}     // Tomato
        ],
        // Arctic ice
        [
            {r: 175, g: 238, b: 238},  // Pale turquoise
            {r: 176, g: 224, b: 230},  // Powder blue
            {r: 173, g: 216, b: 230},  // Light blue
            {r: 135, g: 206, b: 250},  // Light sky blue
            {r: 135, g: 206, b: 235}   // Sky blue
        ],
        // Neon city
        [
            {r: 255, g: 0, b: 255},    // Magenta
            {r: 0, g: 255, b: 255},    // Cyan
            {r: 255, g: 255, b: 0},    // Yellow
            {r: 0, g: 255, b: 0},      // Lime
            {r: 255, g: 0, b: 127}     // Deep pink
        ],
        // Golden hour
        [
            {r: 255, g: 215, b: 0},    // Gold
            {r: 255, g: 223, b: 0},    // Golden yellow
            {r: 255, g: 185, b: 15},   // Dark goldenrod
            {r: 255, g: 193, b: 37},   // Goldenrod
            {r: 255, g: 165, b: 0}     // Orange
        ],
        // Cherry blossom
        [
            {r: 255, g: 183, b: 197},  // Cherry blossom
            {r: 255, g: 192, b: 203},  // Pink
            {r: 255, g: 218, b: 224},  // Light pink
            {r: 255, g: 240, b: 245},  // Lavender blush
            {r: 255, g: 228, b: 225}   // Misty rose
        ]
    ];

    // Renk farkını hesaplayan yardımcı fonksiyon (Euclidean distance)
    const getColorDistance = (c1, c2) => {
        const rDiff = c1.r - c2.r;
        const gDiff = c1.g - c2.g;
        const bDiff = c1.b - c2.b;
        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    };

    // Rengin yeterince canlı olup olmadığını kontrol et
    const isColorVibrant = (color) => {
        const max = Math.max(color.r, color.g, color.b);
        const min = Math.min(color.r, color.g, color.b);
        const range = max - min;
        // En az 60 birim fark olmalı (gri tonlarını engeller)
        return range >= 60;
    };

    // Paletteki renkler arasında yeterli fark var mı kontrol et
    const isPaletteDistinct = (palette) => {
        const minDistance = 80; // Minimum renk farkı (0-441 arası, 80 iyi bir eşik)

        for (let i = 0; i < palette.length; i++) {
            for (let j = i + 1; j < palette.length; j++) {
                if (getColorDistance(palette[i], palette[j]) < minDistance) {
                    return false;
                }
            }
        }
        return true;
    };

    // Renk paleti seçim modu: %40 doğrudan palet, %40 karışık, %20 tamamen rastgele
    const paletteMode = Math.random();
    let selectedPalette;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        attempts++;

        if (paletteMode < 0.4) {
            // Doğrudan bir palet seç
            selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        } else if (paletteMode < 0.8) {
            // Farklı paletlerden rastgele renkler karıştır
            const paletteSize = 4 + Math.floor(Math.random() * 3); // 4-6 renk
            selectedPalette = [];

            while (selectedPalette.length < paletteSize && attempts < maxAttempts) {
                const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
                const randomColor = randomPalette[Math.floor(Math.random() * randomPalette.length)];

                // Renk yeterince canlı mı ve paletteki diğer renklerden yeterince farklı mı?
                if (isColorVibrant(randomColor)) {
                    let isDifferent = true;
                    for (const existingColor of selectedPalette) {
                        if (getColorDistance(randomColor, existingColor) < 80) {
                            isDifferent = false;
                            break;
                        }
                    }
                    if (isDifferent) {
                        selectedPalette.push(randomColor);
                    }
                }
            }
        } else {
            // Tamamen rastgele renkler
            const paletteSize = 4 + Math.floor(Math.random() * 4); // 4-7 renk
            selectedPalette = [];

            while (selectedPalette.length < paletteSize && attempts < maxAttempts) {
                const newColor = {
                    r: Math.floor(Math.random() * 256),
                    g: Math.floor(Math.random() * 256),
                    b: Math.floor(Math.random() * 256)
                };

                // Renk yeterince canlı mı ve paletteki diğer renklerden yeterince farklı mı?
                if (isColorVibrant(newColor)) {
                    let isDifferent = true;
                    for (const existingColor of selectedPalette) {
                        if (getColorDistance(newColor, existingColor) < 80) {
                            isDifferent = false;
                            break;
                        }
                    }
                    if (isDifferent) {
                        selectedPalette.push(newColor);
                    }
                }
            }
        }

        // Eğer yeterli renk toplanamadıysa tekrar dene
        if (selectedPalette.length < 4) {
            selectedPalette = null;
        }

    } while (!selectedPalette || !isPaletteDistinct(selectedPalette));

    // Fallback: Eğer hala uygun palet bulunamadıysa en kontrastlı paleti kullan
    if (!selectedPalette || selectedPalette.length < 4) {
        selectedPalette = colorPalettes[0];
    }

    const getColorFromPalette = (t) => {
        const scaledT = t * (selectedPalette.length - 1);
        const index = Math.floor(scaledT);
        const nextIndex = Math.min(index + 1, selectedPalette.length - 1);
        const blend = scaledT - index;

        const color1 = selectedPalette[index];
        const color2 = selectedPalette[nextIndex];

        return {
            r: Math.floor(color1.r * (1 - blend) + color2.r * blend),
            g: Math.floor(color1.g * (1 - blend) + color2.g * blend),
            b: Math.floor(color1.b * (1 - blend) + color2.b * blend),
        };
    };

    // Pattern seçimi - Mandelbrot'a %60 ağırlık
    let patternType;
    if (patternMode === 'mandelbrot') {
        patternType = 0; // Mandelbrot
    } else if (patternMode === 'random') {
        const patternRandom = Math.random();
        if (patternRandom < 0.6) {
            patternType = 0; // %60 Mandelbrot
        } else {
            patternType = 1 + Math.floor(Math.random() * 5); // %40 diğerleri (1-5)
        }
    } else {
        patternType = Math.floor(Math.random() * 6);
    }

    // Mandelbrot için parametreler
    const zoom = Math.random() * 3 + 0.5;
    const offsetX = Math.random() * 3 - 1.5;
    const offsetY = Math.random() * 3 - 1.5;
    const maxIter = 50 + Math.floor(Math.random() * 200);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let t = 0;

            switch (patternType) {
                case 0: {
                    // Mandelbrot with noise background
                    let zx = (x - width / 2) / (width / 4) / zoom + offsetX;
                    let zy = (y - height / 2) / (height / 4) / zoom + offsetY;
                    const cx = zx;
                    const cy = zy;
                    let iteration = 0;

                    while (zx * zx + zy * zy < 4 && iteration < maxIter) {
                        const tmp = zx * zx - zy * zy + cx;
                        zy = 2 * zx * zy + cy;
                        zx = tmp;
                        iteration++;
                    }

                    t = iteration / maxIter;

                    // Pseudo-random noise - karıncalı TV efekti
                    const noiseX = x * 12.9898 + y * 78.233;
                    const noiseSeed = Math.sin(noiseX) * 43758.5453;
                    const noise = (noiseSeed - Math.floor(noiseSeed));

                    // Un serpilmiş efekti için daha yumuşak noise
                    const smoothNoise = (Math.sin(x * 0.5) * Math.cos(y * 0.3) + 1) / 2;
                    const combinedNoise = noise * 0.3 + smoothNoise * 0.7;

                    // Arka plana gürültü ekle (dış alanlar için - t === 1)
                    if (t === 1) {
                        t = 0.85 + combinedNoise * 0.15;
                    } else {
                        // İçindeki fraktal desenlerine de hafif noise ekle
                        // Orijinal deseni bozmaması için çok küçük miktarda
                        t = t + (combinedNoise - 0.5) * 0.08;
                        // Sınırları koru
                        t = Math.max(0, Math.min(1, t));
                    }
                    break;
                }
                case 1: {
                    // Güçlü dalga deseni - Dalgalı şeritler
                    const frequency = 0.015 + Math.random() * 0.02;
                    const amplitude1 = 80 + Math.random() * 60;
                    const amplitude2 = 60 + Math.random() * 40;
                    const phase = Math.random() * Math.PI * 2;

                    const wave1 = Math.sin(x * frequency + phase) * amplitude1;
                    const wave2 = Math.cos(y * frequency * 1.3 + phase) * amplitude2;
                    const combined = y + wave1 + Math.sin(x * frequency * 0.5) * wave2;

                    t = (Math.sin(combined * 0.015) + 1) / 2;
                    // Kontrastı artır
                    t = Math.pow(t, 0.7);
                    break;
                }
                case 2: {
                    // Spiral patlama deseni
                    const centerX = width / 2 + (Math.random() - 0.5) * width * 0.3;
                    const centerY = height / 2 + (Math.random() - 0.5) * height * 0.3;
                    const dx = x - centerX;
                    const dy = y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    const spiralFactor = 3 + Math.floor(Math.random() * 5);

                    t = (Math.sin(dist * 0.04 + angle * spiralFactor) + 1) / 2;
                    // Keskin geçişler için
                    t = t > 0.5 ? Math.pow((t - 0.5) * 2, 0.6) * 0.5 + 0.5 : Math.pow(t * 2, 0.6) * 0.5;
                    break;
                }
                case 3: {
                    // Dramatik akışkan şeritler
                    const frequency = 0.008 + Math.random() * 0.01;
                    const amplitude = 100 + Math.random() * 80;
                    const flow = Math.sin(x * frequency) * amplitude + Math.cos(y * frequency * 1.5) * amplitude * 0.7;

                    t = (Math.sin((y + flow) * 0.01) * Math.cos((x + flow * 0.5) * 0.008) + 1) / 2;
                    // Kontrastı artır
                    t = t < 0.3 ? 0 : (t > 0.7 ? 1 : (t - 0.3) / 0.4);
                    break;
                }
                case 4: {
                    // Keskin çapraz desenler
                    const stripeWidth = 20 + Math.random() * 40;
                    const angle = Math.random() * Math.PI;
                    const distortion = Math.sin(y * 0.01) * 40 + Math.cos(x * 0.008) * 40;

                    const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
                    const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);

                    t = (Math.sin((rotatedX + rotatedY + distortion) / stripeWidth * Math.PI) + 1) / 2;
                    // Daha keskin şeritler
                    t = Math.round(t * 4) / 4;
                    break;
                }
                case 5: {
                    // Çoklu merkez patlaması
                    const numCenters = 3 + Math.floor(Math.random() * 3);
                    let maxVal = 0;

                    for (let i = 0; i < numCenters; i++) {
                        const cx = (Math.random() * 0.6 + 0.2) * width;
                        const cy = (Math.random() * 0.6 + 0.2) * height;
                        const dx = x - cx;
                        const dy = y - cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx);
                        const rays = 6 + Math.floor(Math.random() * 8);

                        const val = (Math.sin(dist * 0.05 + angle * rays) + 1) / 2;
                        maxVal = Math.max(maxVal, val);
                    }

                    t = maxVal;
                    // Daha belirgin desenler
                    t = Math.pow(t, 0.6);
                    break;
                }
            }

            // Normalize t to [0, 1]
            t = Math.max(0, Math.min(1, t));

            const color = getColorFromPalette(t);
            const row = height - 1 - y;
            const offset = headerSize + (row * width + x) * 3;
            bmpData[offset] = color.b;
            bmpData[offset + 1] = color.g;
            bmpData[offset + 2] = color.r;
        }
    }

    return bmpData;
};

const generateImageWithTimestamp = ({width = 320, height = 320, timestamp = new Date(), outputDir = null, patternMode = 'random', frameNumber = null} = {}) => {
    const bmpData = generateSolidColorImageFile({width, height, patternMode});
    addDateTimeToImage(bmpData, width, height, 54, timestamp, frameNumber);

    const targetDir = outputDir || path.join(__dirname, 'generated');

    // Dizin yoksa oluştur
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true});
    }

    const fileName = `mock_${Date.now()}.bmp`;
    const filePath = path.join(targetDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(bmpData));
    return filePath;
};

const writeUint32LE = (buffer, offset, value) => {
    buffer[offset] = value & 0xff;
    buffer[offset + 1] = (value >> 8) & 0xff;
    buffer[offset + 2] = (value >> 16) & 0xff;
    buffer[offset + 3] = (value >> 24) & 0xff;
};

const writeUint16LE = (buffer, offset, value) => {
    buffer[offset] = value & 0xff;
    buffer[offset + 1] = (value >> 8) & 0xff;
};

function addDateTimeToImage(bmpData, width, height, headerSize, timestamp = new Date(), frameNumber = null) {
    const now = timestamp;
    const dateStr = now.toLocaleDateString('tr-TR');
    const timeStr = now.toTimeString().split(' ')[0];
    const millisStr = now.getMilliseconds().toString().padStart(3, '0');

    const scale = 2; // Sol ve sağ alt için scale
    const fontHeight = 8 * scale;
    const baseCharWidth = 8;
    const charSpacing = 1 * scale;
    const stripePaddingX = 10;
    const stripePaddingY = 10;

    // Yazı genişliklerini hesapla
    const timeTextWidth = timeStr.length * (baseCharWidth * scale + charSpacing);
    const dateTextWidth = dateStr.length * (baseCharWidth * scale + charSpacing);
    const maxTextWidth = Math.max(timeTextWidth, dateTextWidth);

    // Beyaz şerit boyutları: yazı genişliği + 2 * padding
    const stripeWidth = maxTextWidth + (stripePaddingX * 2);
    const stripeHeight = fontHeight * 2 + (stripePaddingY * 2) + 4; // 4 satır arası boşluk
    const startY = height - stripeHeight;

    // Sol alt - Beyaz arka plan şeridi çiz
    for (let y = 0; y < stripeHeight; y++) {
        for (let x = 0; x < stripeWidth; x++) {
            const pixelX = x;
            const pixelY = startY + y;
            const actualY = height - 1 - pixelY;
            const offset = headerSize + (actualY * width + pixelX) * 3;

            if (offset >= headerSize && offset < bmpData.length - 2) {
                bmpData[offset] = 255;
                bmpData[offset + 1] = 255;
                bmpData[offset + 2] = 255;
            }
        }
    }

    const textColor = {r: 0, g: 0, b: 0};
    const font = getDefaultFont();
    const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Sol alt yazılar (tarih ve saat) - scale = 2
    drawText(
        bmpData,
        timeStr,
        stripePaddingX,
        startY + stripePaddingY,
        width,
        height,
        headerSize,
        textColor,
        font,
        scale,
    );

    drawText(
        bmpData,
        dateStr,
        stripePaddingX,
        startY + stripePaddingY + fontHeight + 4,
        width,
        height,
        headerSize,
        textColor,
        font,
        scale,
    );

    // Orta - Zaman damgası (HH:MM:SS.mmm)
    const centerTimeStr = `${timeStr}.${millisStr}`;
    const centerScale = 3;
    const centerTextWidth = centerTimeStr.length * (baseCharWidth * centerScale + centerScale);
    const centerTextHeight = baseCharWidth * centerScale;
    const centerX = Math.floor((width - centerTextWidth) / 2);
    const centerY = Math.floor((height - centerTextHeight) / 2);

    // Orta için beyaz arka plan
    const bgPadding = 10;
    for (let y = -bgPadding; y < centerTextHeight + bgPadding; y++) {
        for (let x = -bgPadding; x < centerTextWidth + bgPadding; x++) {
            const pixelX = centerX + x;
            const pixelY = centerY + y;

            if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
                const actualY = height - 1 - pixelY;
                const offset = headerSize + (actualY * width + pixelX) * 3;

                if (offset >= headerSize && offset < bmpData.length - 2) {
                    bmpData[offset] = 255;
                    bmpData[offset + 1] = 255;
                    bmpData[offset + 2] = 255;
                }
            }
        }
    }

    // Orta zaman yazısı
    drawText(
        bmpData,
        centerTimeStr,
        centerX,
        centerY,
        width,
        height,
        headerSize,
        textColor,
        font,
        centerScale,
    );

    // Sağ alt - Frame numarası (eğer verilmişse)
    if (frameNumber !== null) {
        const frameStr = String(frameNumber);
        const frameTextWidth = frameStr.length * (baseCharWidth * scale + charSpacing);
        const frameStripeWidth = frameTextWidth + (stripePaddingX * 2);
        const frameStripeHeight = fontHeight + (stripePaddingY * 2);
        const frameStartX = width - frameStripeWidth;
        const frameStartY = height - frameStripeHeight;

        // Sağ alt - Beyaz arka plan şeridi çiz
        for (let y = 0; y < frameStripeHeight; y++) {
            for (let x = 0; x < frameStripeWidth; x++) {
                const pixelX = frameStartX + x;
                const pixelY = frameStartY + y;
                const actualY = height - 1 - pixelY;
                const offset = headerSize + (actualY * width + pixelX) * 3;

                if (offset >= headerSize && offset < bmpData.length - 2) {
                    bmpData[offset] = 255;
                    bmpData[offset + 1] = 255;
                    bmpData[offset + 2] = 255;
                }
            }
        }

        // Sağ alt frame numarası yazısı
        drawText(
            bmpData,
            frameStr,
            frameStartX + stripePaddingX,
            frameStartY + stripePaddingY,
            width,
            height,
            headerSize,
            textColor,
            font,
            scale,
        );
    }
}

const drawText = (
    bmpData,
    text,
    startX,
    startY,
    width,
    height,
    headerSize,
    color,
    font,
    scale = 1,
) => {
    const baseCharWidth = 8;
    const baseCharHeight = 8;
    const spacing = 1 * scale;

    const charWidth = baseCharWidth * scale;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charData = font[char];

        if (!charData) continue;

        const charX = startX + i * (charWidth + spacing);

        for (let row = 0; row < baseCharHeight; row++) {
            const rowData = charData[row];

            for (let col = 0; col < baseCharWidth; col++) {
                if (rowData & (0x80 >> col)) {
                    for (let sy = 0; sy < scale; sy++) {
                        for (let sx = 0; sx < scale; sx++) {
                            const pixelX = charX + col * scale + sx;
                            const pixelY = startY + row * scale + sy;

                            if (
                                pixelX >= 0 &&
                                pixelX < width &&
                                pixelY >= 0 &&
                                pixelY < height
                            ) {
                                const actualY = height - 1 - pixelY;
                                const offset = headerSize + (actualY * width + pixelX) * 3;

                                if (offset >= headerSize && offset < bmpData.length - 2) {
                                    bmpData[offset] = color.b;
                                    bmpData[offset + 1] = color.g;
                                    bmpData[offset + 2] = color.r;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const getDefaultFont = () => {
    const FONT = {
        '0': [0x3c, 0x66, 0x6e, 0x76, 0x66, 0x66, 0x3c, 0x00],
        '1': [0x18, 0x38, 0x18, 0x18, 0x18, 0x18, 0x7e, 0x00],
        '2': [0x3c, 0x66, 0x06, 0x0c, 0x18, 0x30, 0x7e, 0x00],
        '3': [0x3c, 0x66, 0x06, 0x1c, 0x06, 0x66, 0x3c, 0x00],
        '4': [0x0c, 0x1c, 0x3c, 0x6c, 0x7e, 0x0c, 0x1e, 0x00],
        '5': [0x7e, 0x60, 0x7c, 0x06, 0x06, 0x66, 0x3c, 0x00],
        '6': [0x1c, 0x30, 0x60, 0x7c, 0x66, 0x66, 0x3c, 0x00],
        '7': [0x7e, 0x06, 0x0c, 0x18, 0x30, 0x30, 0x30, 0x00],
        '8': [0x3c, 0x66, 0x66, 0x3c, 0x66, 0x66, 0x3c, 0x00],
        '9': [0x3c, 0x66, 0x66, 0x3e, 0x06, 0x0c, 0x38, 0x00],
        ':': [0x00, 0x18, 0x18, 0x00, 0x00, 0x18, 0x18, 0x00],
        '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x18, 0x00],
        '/': [0x02, 0x06, 0x0c, 0x18, 0x30, 0x60, 0x40, 0x00],
        ' ': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'A': [0x18, 0x3c, 0x66, 0x7e, 0x66, 0x66, 0x66, 0x00],
        'B': [0x7c, 0x66, 0x66, 0x7c, 0x66, 0x66, 0x7c, 0x00],
        'C': [0x3c, 0x66, 0x60, 0x60, 0x60, 0x66, 0x3c, 0x00],
        'D': [0x78, 0x6c, 0x66, 0x66, 0x66, 0x6c, 0x78, 0x00],
        'E': [0x7e, 0x60, 0x60, 0x7c, 0x60, 0x60, 0x7e, 0x00],
        'F': [0x7e, 0x60, 0x60, 0x7c, 0x60, 0x60, 0x60, 0x00],
        'G': [0x3c, 0x66, 0x60, 0x6e, 0x66, 0x66, 0x3c, 0x00],
        'H': [0x66, 0x66, 0x66, 0x7e, 0x66, 0x66, 0x66, 0x00],
        'I': [0x3c, 0x18, 0x18, 0x18, 0x18, 0x18, 0x3c, 0x00],
        'J': [0x1e, 0x0c, 0x0c, 0x0c, 0x0c, 0x6c, 0x38, 0x00],
        'K': [0x66, 0x6c, 0x78, 0x70, 0x78, 0x6c, 0x66, 0x00],
        'L': [0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x7e, 0x00],
        'M': [0x63, 0x77, 0x7f, 0x6b, 0x63, 0x63, 0x63, 0x00],
        'N': [0x66, 0x76, 0x7e, 0x7e, 0x6e, 0x66, 0x66, 0x00],
        'O': [0x3c, 0x66, 0x66, 0x66, 0x66, 0x66, 0x3c, 0x00],
        'P': [0x7c, 0x66, 0x66, 0x7c, 0x60, 0x60, 0x60, 0x00],
        'Q': [0x3c, 0x66, 0x66, 0x66, 0x6e, 0x6c, 0x36, 0x00],
        'R': [0x7c, 0x66, 0x66, 0x7c, 0x6c, 0x66, 0x66, 0x00],
        'S': [0x3e, 0x60, 0x60, 0x3c, 0x06, 0x06, 0x7c, 0x00],
        'T': [0x7e, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x00],
        'U': [0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x3c, 0x00],
        'V': [0x66, 0x66, 0x66, 0x66, 0x66, 0x3c, 0x18, 0x00],
        'W': [0x63, 0x63, 0x63, 0x6b, 0x7f, 0x77, 0x63, 0x00],
        'X': [0x66, 0x66, 0x3c, 0x18, 0x3c, 0x66, 0x66, 0x00],
        'Y': [0x66, 0x66, 0x66, 0x3c, 0x18, 0x18, 0x18, 0x00],
        'Z': [0x7e, 0x06, 0x0c, 0x18, 0x30, 0x60, 0x7e, 0x00],
    };

    return FONT;
};

// Video üretme fonksiyonu
const generateVideo = async ({width, height, duration = 10, fps = 30, outputDir = null, patternMode = 'random'}) => {
    const frameCount = duration * fps;
    const framesDir = path.join(__dirname, 'frames');

    // Frames dizinini temizle/oluştur
    if (fs.existsSync(framesDir)) {
        fs.rmSync(framesDir, {recursive: true});
    }
    fs.mkdirSync(framesDir);

    console.log(`${frameCount} frame üretiliyor...`);

    const startTime = new Date();
    let lastBackgroundChange = 0;
    let currentBmpData = generateSolidColorImageFile({width, height, patternMode});

    for (let i = 0; i < frameCount; i++) {
        const currentTimeMs = (i / fps) * 1000;
        const timestamp = new Date(startTime.getTime() + currentTimeMs);

        // Her 3 saniyede bir arka plan değişir
        if (Math.floor(currentTimeMs / 1000) > lastBackgroundChange) {
            currentBmpData = generateSolidColorImageFile({width, height, patternMode});
            lastBackgroundChange = Math.floor(currentTimeMs / 1000);
        }

        // Her frame için yeni bmpData kopyası oluştur ve timestamp + frame numarası ekle
        const frameBmpData = new Uint8Array(currentBmpData);
        addDateTimeToImage(frameBmpData, width, height, 54, timestamp, i);

        const framePath = path.join(framesDir, `frame_${String(i).padStart(5, '0')}.bmp`);
        fs.writeFileSync(framePath, Buffer.from(frameBmpData));

        if ((i + 1) % 30 === 0) {
            console.log(`${i + 1}/${frameCount} frame oluşturuldu`);
        }
    }

    console.log('FFmpeg ile video oluşturuluyor...');

    const targetDir = outputDir || path.join(__dirname, 'generated');

    // Dizin yoksa oluştur
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true});
    }

    const outputFile = path.join(targetDir, `video_${Date.now()}.mp4`);

    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-framerate', String(fps),
            '-i', path.join(framesDir, 'frame_%05d.bmp'),
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-y',
            outputFile
        ]);

        ffmpeg.stderr.on('data', (data) => {
            // FFmpeg çıktısını bastır
        });

        ffmpeg.on('close', (code) => {
            // Frames dizinini temizle
            fs.rmSync(framesDir, {recursive: true});

            if (code === 0) {
                resolve(outputFile);
            } else {
                reject(new Error(`FFmpeg çıkış kodu: ${code}`));
            }
        });
    });
};

// Ana program
const args = process.argv.slice(2);
const isVertical = args.includes('--v') || args.includes('-v');
const isVideo = args.includes('--video') || args.includes('--mp4');
const isMandelbrot = args.includes('-m') || args.includes('--mandelbrot');

// -d parametresi kontrolü
let customDir = null;
const dirIndex = args.findIndex(arg => arg === '-d' || arg === '--dir');
if (dirIndex !== -1 && args[dirIndex + 1]) {
    customDir = args[dirIndex + 1];
    // Mutlak path değilse mutlak yap
    if (!path.isAbsolute(customDir)) {
        customDir = path.resolve(process.cwd(), customDir);
    }
}

// -f parametresi kontrolü (frame numarası)
let frameNumber = null;
const frameIndex = args.findIndex(arg => arg === '-f' || arg === '--frame');
if (frameIndex !== -1 && args[frameIndex + 1]) {
    frameNumber = parseInt(args[frameIndex + 1], 10);
    if (isNaN(frameNumber)) {
        console.error('Hata: Frame numarası geçerli bir sayı olmalıdır.');
        process.exit(1);
    }
}

const patternMode = isMandelbrot ? 'mandelbrot' : 'random';

const dimensions = isVertical
    ? {width: 480, height: 854}  // 9:16 dikey
    : {width: 640, height: 640};  // kare

if (isVideo) {
    console.log('Video üretiliyor...');
    generateVideo({...dimensions, duration: 10, fps: 30, outputDir: customDir, patternMode})
        .then(filePath => {
            console.log(`Video oluşturuldu: ${filePath}`);
        })
        .catch(err => {
            console.error('Video oluşturma hatası:', err.message);
            process.exit(1);
        });
} else {
    console.log('Resim üretiliyor...');
    const filePath = generateImageWithTimestamp({...dimensions, outputDir: customDir, patternMode, frameNumber});
    console.log(`Resim oluşturuldu: ${filePath}`);
}
