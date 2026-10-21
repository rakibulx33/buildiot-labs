import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/site/Header";
import { absoluteUrl, isPreview, ogImage, site } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/archivo-latin-wdth.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

// Monospace for legends and codes only, so one weight and no preload.
const b612 = localFont({
  src: "./fonts/b612-mono-400.woff2",
  weight: "400",
  variable: "--font-b612",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `BuildIoT Lab | ${site.motto.replace(/\.$/, "")}`,
    template: "%s | BuildIoT Lab",
  },
  description: site.description,
  applicationName: site.name,
  // The GitHub Pages address is a preview; only buildiotlabs.com is indexed.
  robots: isPreview ? { index: false, follow: false } : undefined,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", images: [ogImage.url] },
  // Optional search-console ownership tags, set as repository variables (see README).
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#dce3e4",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${b612.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <div className="vt-stage" aria-hidden="true" />
        <Header />
        {children}
      </body>
    </html>
  );
}
