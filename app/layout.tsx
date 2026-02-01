import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"; // [MODIFIED]
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mymo - Sua Cápsula de Memórias Inesquecíveis",
  description: "Transforme sentimentos em um Mymo. Crie uma experiência digital única com fotos, músicas e mensagens para quem você ama.",
  keywords: ["mymo", "carinho digital", "homenagem", "surpresa", "cápsula de memórias", "mymo personalizado"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Mymo - Sua Cápsula de Memórias",
    description: "Crie um Mymo personalizado e emocione quem você ama de um jeito moderno e simples.",
    images: ["/logo.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://s.ytimg.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
