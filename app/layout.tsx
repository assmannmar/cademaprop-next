import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsappButton";

export const metadata: Metadata = {
  title: "Cadema Bienes Raíces",
  description: "Inmobiliaria",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="antialiased bg-gray-50"
      >
        <Navbar />

        {children}

        <Footer />

        <WhatsAppButton />
      </body>
    </html>
  );
}
