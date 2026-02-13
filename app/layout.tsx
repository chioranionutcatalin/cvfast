import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./components/AppShell";
import Providers from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hero4job.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",
  title: {
    default: "Hero4Job | CV Builder",
    template: "%s | Hero4Job",
  },
  description: "Build, preview, and download a professional CV in minutes with Hero4Job.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hero4Job | CV Builder",
    description: "Create a polished CV fast with editable sections and PDF export.",
    url: "/",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Hero4Job CV Builder",
      },
    ],
    siteName: "Hero4Job",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hero4Job | CV Builder",
    description: "Create, preview, and export your CV as PDF.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
