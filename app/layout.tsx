import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import GlobalChrome from "./components/GlobalChrome";
import StaticDocumentNavigation from "./components/StaticDocumentNavigation";
import {
  absoluteUrl,
  brandName,
  defaultDescription,
  defaultTitle,
  jsonLdScript,
  organizationJsonLd,
  siteUrl,
  socialProfiles,
  websiteJsonLd,
} from "./lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: brandName,
  title: {
    default: defaultTitle,
    template: `%s | ${brandName}`,
  },
  description: defaultDescription,
  keywords: [
    "inmobiliaria Campana",
    "inmobiliaria Zarate",
    "propiedades en venta",
    "propiedades en alquiler",
    "tasaciones inmobiliarias",
    "emprendimientos inmobiliarios",
    "inmuebles industriales",
    "galpones industriales",
    "Corredor Norte",
  ],
  authors: [{ name: brandName, url: siteUrl }],
  creator: brandName,
  publisher: brandName,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: brandName,
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    images: [
      {
        url: absoluteUrl("/logos/logo-portada.png"),
        width: 1200,
        height: 630,
        alt: brandName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [absoluteUrl("/logos/logo-portada.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "real estate",
  other: {
    "business:contact_data:locality": "Campana",
    "business:contact_data:region": "Buenos Aires",
    "business:contact_data:country_name": "Argentina",
    "og:see_also": socialProfiles.join(","),
  },
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
      <body className="antialiased bg-gray-50">
        <StaticDocumentNavigation />
        <GlobalChrome />

        {children}

        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript([
            organizationJsonLd(),
            websiteJsonLd(),
          ])}
        />
      </body>
    </html>
  );
}
