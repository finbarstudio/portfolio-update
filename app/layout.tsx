import type { Metadata } from "next";
import { Archivo_Narrow } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

// Single font family — Archivo Narrow used for both body and mono/label text.
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "finbar✶studio — Graphic Designer & Designer/Developer",
  description:
    "Brisbane-based graphic designer and Framer developer with 4+ years across brand identity, digital, web, and publication design. Open for work.",
  openGraph: {
    title: "finbar✶studio",
    description:
      "Brisbane-based graphic designer and Framer developer. Open for work.",
    url: "https://finbar.studio",
    siteName: "finbar✶studio",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={archivoNarrow.variable}
    >
      <body className="bg-bg text-ink font-sans antialiased min-h-screen">
        <div className="flex min-h-screen">
          {/* Persistent sidebar — handles its own mobile state */}
          <Sidebar />

          {/* Main content: offset left on desktop, offset top on mobile */}
          <main
            className="flex-1 min-w-0 md:ml-56 pt-14 md:pt-0"
            id="main-content"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
