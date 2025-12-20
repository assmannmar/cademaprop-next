import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cadema Prop",
  description: "Inmobiliaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* NAVBAR - Aparece en todas las páginas */}
        <Navbar />

        {/* CONTENIDO DE CADA PÁGINA */}
        {/*<div className="pt-[70px]">
          {children}
        </div>

        {/* FOOTER - Aparece en todas las páginas */}
        <Footer />
      </body>
    </html>
  );
}