import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import GlobalChrome from "./components/GlobalChrome";

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
        <GlobalChrome />

        {children}

        <Footer />
      </body>
    </html>
  );
}
