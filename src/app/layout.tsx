import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";

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
  title: "Jose Sebastian — Web Developer & Interface Engineer",
  description:
    "Freelance web developer building fast, tactile, motion-driven interfaces with Next.js, WebGL and TypeScript.",
  metadataBase: new URL("https://josesebastian.dev"),
  openGraph: {
    title: "Jose Sebastian — Web Developer & Interface Engineer",
    description:
      "Freelance web developer building fast, tactile, motion-driven interfaces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${space.variable} ${inter.variable}`}>
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
