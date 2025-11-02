import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickCaption - Generate Alt Text",
  description: "Generate accessible alt text variants for images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

