import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
  title: "BuildIoT Labs",
  description: "Embedded and IoT engineering lab in Dhaka.",
};

export const viewport: Viewport = {
  themeColor: "#661414",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${b612.variable}`}>
      <body>
        <div className="vt-stage" aria-hidden="true" />
        <header style={{ viewTransitionName: "site-header" }} className="sticky top-0 z-50 h-[var(--header-h)] bg-mat/90 backdrop-blur border-b border-line-soft"><div className="wrap flex h-full items-center font-semibold [font-stretch:120%]">BuildIoT Labs</div></header>
        {children}
      </body>
    </html>
  );
}
