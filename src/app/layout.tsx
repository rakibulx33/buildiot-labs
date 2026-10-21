import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/site/Header";
import { absoluteUrl, site } from "@/content/site";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/archivo-latin-wdth.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

const b612 = localFont({
  src: [
    { path: "./fonts/b612-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/b612-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-b612",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "BuildIoT Labs: firmware, low-power hardware and telemetry, Dhaka",
    template: "%s | BuildIoT Labs",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: absoluteUrl("/"),
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#dce3e4",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${b612.variable}`}>
      <body>
        <div className="vt-stage" aria-hidden="true" />
        <Header />
        {children}
      </body>
    </html>
  );
}
