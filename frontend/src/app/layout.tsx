import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "RP GPIO Control",
  description: "Raspberry Pi GPIO control — Python + Next.js by Bek Kobro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.variable} ${geistMono.variable} flex min-h-full flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
