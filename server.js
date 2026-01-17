import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
import {spawn} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/generated', express.static('generated'));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Görüntü oluşturma endpoint'i
app.post('/api/generate', (req, res) => {
    const {type, orientation, pattern, useSignature, customText} = req.body;

    const args = ['index.js'];

    if (orientation === 'vertical') {
        args.push('-v');
    }

    if (pattern === 'mandelbrot') {
        args.push('-m');
    }

    if (useSignature) {
        args.push('-s');
    }

    if (type === 'video') {
        args.push('--video');
    }

    // Özel metin varsa -f parametresi ile ekle
    if (customText && customText.trim()) {
        args.push('-f');
        args.push(customText.trim());
    }

    const nodeProcess = spawn('node', args);

    let output = '';
    let errorOutput = '';

    nodeProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log(data.toString());
    });

    nodeProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(data.toString());
    });

    nodeProcess.on('close', (code) => {
        if (code === 0) {
            // Oluşturulan dosyayı bul
            const generatedDir = path.join(__dirname, 'generated');
            const files = fs.readdirSync(generatedDir);

            // En son oluşturulan dosyayı bul
            const latestFile = files
                .map(f => ({
                    name: f,
                    time: fs.statSync(path.join(generatedDir, f)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time)[0];

            if (latestFile) {
                res.json({
                    success: true,
                    file: `/generated/${latestFile.name}`,
                    type: latestFile.name.endsWith('.mp4') ? 'video' : 'image',
                    message: output
                });
            } else {
                res.json({
                    success: false,
                    error: 'Dosya oluşturulamadı'
                });
            }
        } else {
            res.json({
                success: false,
                error: errorOutput || 'Oluşturma başarısız'
            });
        }
    });
});

// Oluşturulan dosyaları listeleme
app.get('/api/files', (req, res) => {
    const generatedDir = path.join(__dirname, 'generated');

    if (!fs.existsSync(generatedDir)) {
        return res.json({files: []});
    }

    const files = fs.readdirSync(generatedDir)
        .filter(f => f.endsWith('.bmp') || f.endsWith('.mp4'))
        .map(f => ({
            name: f,
            path: `/generated/${f}`,
            type: f.endsWith('.mp4') ? 'video' : 'image',
            size: fs.statSync(path.join(generatedDir, f)).size,
            created: fs.statSync(path.join(generatedDir, f)).mtime
        }))
        .sort((a, b) => b.created - a.created);

    res.json({files});
});

// Dosya silme
app.delete('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'generated', filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({success: true});
    } else {
        res.json({success: false, error: 'Dosya bulunamadı'});
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Image Generator Web UI`);
    console.log(`📍 Server çalışıyor: http://localhost:${PORT}`);
    console.log(`\n🎨 Tarayıcınızda açın ve görüntü üretmeye başlayın!\n`);
});
