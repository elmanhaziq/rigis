import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.shortName} — ${siteConfig.name}`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  openGraph: {
    type: "website",
    siteName: `${siteConfig.shortName} — ${siteConfig.name}`,
    title: `${siteConfig.shortName} — ${siteConfig.name}`,
    description: siteConfig.description,
    url: "/",
    images: [{ url: "/branding/og-image.png", width: 1200, height: 630, alt: "RIGIS" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/branding/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#10243A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
