import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./components/AppShell";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Hero for Job",
  description: "Build your CV with Hero for Job",
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
