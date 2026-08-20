import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jose Sebastian — IT Manager & Web Developer in Dubai",
  description:
    "IT Manager and web developer in Dubai. Websites that load fast, rank high and stay up — build, hosting, security and SEO, handled end to end.",
  metadataBase: new URL("https://joseviews.com"),
  openGraph: {
    title: "Jose Sebastian — IT Manager & Web Developer in Dubai",
    description:
      "Websites that load fast, rank high and stay up. Dubai-based, 7+ years, build to hosting to SEO.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${space.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sets data-theme before first paint. Without it the page renders in
            the server's dark default and snaps to light on hydration. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="grain antialiased">
        <Preloader />
        <SmoothScroll>
          <ScrollProgress />
          <Cursor />
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
