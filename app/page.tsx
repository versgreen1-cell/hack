"use client";

import { useState, useRef } from "react";

interface AltTextVariants {
  accessible: string;
  short: string;
  seo: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [variants, setVariants] = useState<AltTextVariants | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError(null);
    setFilename(file.name);
    setVariants(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(",")[1];
      setImage(result);
      return base64;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const generateAltText = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      // Extract base64 and mime type from data URL
      const [header, base64] = image.split(",");
      const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";

      const response = await fetch("/api/alttext", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64,
          mimeType,
          filename,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate alt text");
      }

      const data = await response.json();
      setVariants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            QuickCaption
          </h1>
          <p className="text-gray-600">Generate accessible alt text for images</p>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 mb-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!image ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="space-y-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Select Image
                  </button>
                  <p className="mt-2 text-sm text-gray-600">
                    or drag and drop
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg mx-auto"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setVariants(null);
                    setFilename("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={generateAltText}
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Generating..." : "Generate Alt Text"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {variants && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Accessible
                </h3>
                <button
                  onClick={() => copyToClipboard(variants.accessible, "accessible")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {copied === "accessible" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-gray-700">{variants.accessible}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Short</h3>
                <button
                  onClick={() => copyToClipboard(variants.short, "short")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {copied === "short" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-gray-700">{variants.short}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">SEO</h3>
                <button
                  onClick={() => copyToClipboard(variants.seo, "seo")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {copied === "seo" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-gray-700">{variants.seo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

