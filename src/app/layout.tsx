import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Jersey_25 } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jersey25 = Jersey_25({
  variable: "--font-jersey-25",
  subsets: ["latin"],
  weight: "400"
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://beta.konductor.ai'),
  title: "Konductor.ai - AI-First ERP Platform",
  description: "Konductor.ai is an AI orchestration platform that helps you manage and deploy your AI Minions.",
  openGraph: {
    title: "Konductor.ai - AI-First ERP Platform",
    description: "Konductor.ai is an AI orchestration platform that helps you manage and deploy your AI Minions.",
    images: [
      {
        url: "/logos/k_cover.jpg", // Assuming this path is correct relative to your public directory
        width: 1200,
        height: 630,
        alt: "Konductor.AI",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jersey25.variable} ${pressStart2P.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
