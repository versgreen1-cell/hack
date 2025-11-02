<div align="center">

# QuickCaption

An AI-powered tool that generates accessible alt text variants for images, helping you create inclusive and SEO-friendly content with no API keys required.

[Installation](#installation) •
[How To Use](#how-to-use) •
[How It Works](#how-it-works) •
[Features](#features)

</div>

## About This Project

QuickCaption addresses the challenge of creating effective alt text for images—a critical component of web accessibility and SEO. Using open-source AI technology, we analyze uploaded images and generate three optimized variants: accessible descriptions for screen readers, concise short descriptions, and SEO-optimized text with relevant keywords. All processing happens locally using Ollama, ensuring privacy and eliminating the need for API keys.

## Installation

To get QuickCaption running on your machine, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone YOUR_GITHUB_REPO_URL
   cd quickcaption
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Install and Configure Ollama:**
   - Download Ollama from [https://ollama.ai](https://ollama.ai)
   - Install and start the Ollama service
   - Pull a vision model:
     ```bash
     ollama pull llava
     ```
   - Or use a smaller model: `ollama pull llava:7b` or `ollama pull bakllava`

4. **Optional: Configure Environment Variables:**
   - Create a `.env.local` file in the project root (or copy `.env.example`)
   - Configure Ollama settings if needed:
     ```
     OLLAMA_API_URL=http://localhost:11434
     OLLAMA_MODEL=llava
     ```
   - Defaults work for local Ollama installations

5. **Run the Application:**
   ```bash
   npm run dev
   ```

6. **Verification:**
   - Navigate to http://localhost:3000 in your web browser
   - You should see the QuickCaption interface ready to use
   - **Note**: The app works without Ollama but will use placeholder text based on filename

## How To Use

Generate accessible alt text in three simple steps:

1. **Upload an Image:**
   - Drag and drop an image onto the upload area, or
   - Click "Select Image" to choose a file from your device
   - Supported formats: All common image formats (PNG, JPG, GIF, WebP, etc.)

2. **Generate Alt Text:**
   - Click the "Generate Alt Text" button
   - The AI will analyze your image and create three optimized variants

3. **Copy and Use:**
   - Review the three alt text variants displayed:
     - **Accessible**: Full descriptive sentence optimized for screen readers
     - **Short**: Concise 8-word description for quick reference
     - **SEO**: Search-engine optimized description with relevant keywords
   - Click "Copy" next to any variant to copy it to your clipboard
   - Use the copied text in your HTML `alt` attributes or image captions

## How It Works

QuickCaption combines open-source AI with intelligent image processing:

Technical Approach:
- **Image Processing**: Converts uploaded images to base64 format for AI analysis
- **AI Enhancement**: Leverages Ollama's LLaVA vision model to analyze image content
- **Structured Output**: Generates three distinct variants optimized for different use cases
- **JSON Validation**: Ensures consistent response format with automatic retry logic
- **Smart Fallback**: Uses deterministic placeholders based on filename if Ollama is unavailable

Key Technologies:
- **Next.js 15** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Ollama** - Local open-source LLM with vision capabilities (no API keys needed)
- **React** - Interactive user interface

Processing Flow:
1. User uploads image → Client converts to base64
2. POST request to `/api/alttext` with image data
3. Server calls Ollama Vision API (if available)
4. AI analyzes image and generates structured JSON response
5. Three variants extracted and validated
6. Results displayed with copy-to-clipboard functionality
7. Automatic fallback to placeholders if Ollama unavailable

## Demo

See QuickCaption in action:

The interface provides a clean, minimal design with:
- Drag-and-drop image upload zone
- Live image preview
- Real-time generation with loading states
- Three distinct output cards with instant copy functionality
- Mobile-responsive layout

## Features

✨ **AI-Powered Generation** - Analyzes images with local Ollama vision models
🔒 **Privacy-First** - All processing happens locally, no data sent to external APIs
🚀 **No API Keys** - Completely free and open-source, no registration required
📱 **Mobile-Friendly** - Responsive design works on all devices
📋 **Three Variants** - Accessible, Short, and SEO-optimized alt text
⚡ **Fast Processing** - Quick generation with optimized prompts
🔄 **Smart Fallback** - Works even without Ollama using filename-based placeholders
📊 **Strict JSON** - Validated responses with automatic retry logic

## Use Cases

- **Web Developers**: Quickly generate accessible alt text for images in websites and applications
- **Content Creators**: Create SEO-friendly descriptions for blog posts and social media
- **Accessibility Teams**: Ensure compliance with WCAG guidelines for image descriptions
- **Designers**: Generate consistent alt text for design portfolios and presentations
- **E-commerce**: Create product image descriptions optimized for search engines
- **Educational Content**: Generate descriptive text for educational materials and courses

## Troubleshooting

### Ollama Connection Issues

If you see "Ollama is not running" errors:

1. **Verify Ollama is running:**
   ```bash
   ollama serve
   ```
   Or ensure the Ollama service is running in the background.

2. **Check if the model is installed:**
   ```bash
   ollama list
   ```
   If `llava` (or your configured model) isn't listed, pull it:
   ```bash
   ollama pull llava
   ```

3. **Test Ollama API directly:**
   ```bash
   curl http://localhost:11434/api/tags
   ```
   This should return a list of available models.

4. **Check the model supports vision:**
   - Use `llava`, `llava:7b`, `bakllava`, or other vision-capable models
   - Regular text models won't work with images

### Fallback to Placeholders

If Ollama isn't available or encounters an error, the app automatically falls back to deterministic placeholder text based on the filename. This ensures the app always works, even without Ollama.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── alttext/
│   │       └── route.ts      # API endpoint for alt text generation
│   ├── globals.css            # Global styles with Tailwind
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── lib/
│   └── ai.ts                  # Ollama API integration & fallback
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## API Endpoint

**POST `/api/alttext`**

Request body:
```json
{
  "base64": "base64-encoded-image-string",
  "mimeType": "image/png",
  "filename": "example.png"
}
```

Response:
```json
{
  "accessible": "A descriptive sentence for screen readers.",
  "short": "Short description",
  "seo": "SEO-optimized description with keywords."
}
```

## License

See LICENSE file for details.

## Contact

For questions about this project, please open an issue in this repository.

---
