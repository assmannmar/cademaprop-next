import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import GlobalChrome from "./components/GlobalChrome";
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

const staticDocumentNavigationScript = `
(function () {
  function isModifiedClick(event) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
  }

  function normalizePath(pathname) {
    return pathname.replace(/\\/$/, "") || "/";
  }

  function shouldReloadTo(url) {
    return url.origin === window.location.origin &&
      normalizePath(url.pathname) !== normalizePath(window.location.pathname);
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || isModifiedClick(event)) return;

    var target = event.target;
    if (!target || !target.closest) return;

    var link = target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;

    var url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    var samePageHash = normalizePath(url.pathname) === normalizePath(window.location.pathname) &&
      url.search === window.location.search &&
      url.hash &&
      url.hash !== window.location.hash;

    if (samePageHash) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.location.href = url.href;
  }, true);

  function patchHistoryMethod(methodName) {
    var original = window.history[methodName];

    window.history[methodName] = function (state, title, url) {
      if (typeof url === "string" || url instanceof URL) {
        var nextUrl = new URL(url, window.location.href);
        if (shouldReloadTo(nextUrl)) {
          window.location.href = nextUrl.href;
          return;
        }
      }

      return original.apply(this, arguments);
    };
  }

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");
}());
`;

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
        {process.env.NEXT_PUBLIC_API_TARGET === "php" && (
          <script
            dangerouslySetInnerHTML={{ __html: staticDocumentNavigationScript }}
          />
        )}
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
