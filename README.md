# Image Generator

A Node.js application that generates unique images for testing and mock purposes. Creates different visuals each time using Mandelbrot fractals and abstract patterns.

## Why?

Sometimes you need to quickly generate unique images for software testing or prototypes. This tool does exactly that - creates a new image with different colors and patterns on each run.

## Installation

```bash
npm install
```

FFmpeg is required for video generation:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

## Usage

Three different modes available:

### Desktop Application

```bash
npm run app
```

Control all parameters visually with the Electron-based interface.

### Web Interface

```bash
npm run web
```

Open `http://localhost:3000` in your browser.

### Command Line

```bash
# Basic image
node index.js

# Vertical format (480x854)
node index.js -v

# Mandelbrot fractal only
node index.js -m

# Add custom text
node index.js -f "Test 001"

# Generate video (10 seconds)
node index.js --video

# Combine parameters
node index.js -v -m -f "Frame 42" -d ./output
```

### Parameters

| Parameter | Short | Description |
|-----------|-------|-------------|
| `--vertical` | `-v` | Vertical format |
| `--mandelbrot` | `-m` | Mandelbrot pattern only |
| `--frame` | `-f` | Add text to image |
| `--dir` | `-d` | Output directory |
| `--video` | `--mp4` | Generate video |
| `--signature` | `-s` | Machine-specific consistent style |

## Output

- Images: BMP, 640x640 (or vertical: 480x854)
- Videos: MP4, 10 seconds, 30 FPS
- Default directory: `./generated/`

## License

MIT
