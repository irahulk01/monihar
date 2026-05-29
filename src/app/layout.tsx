import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Monihar | Handpicked Fashion Jewellery for Modern Women",
  description: "Explore Monihar's exquisite collection of handpicked fashion jewellery. Premium rings, earrings, necklaces, bracelets, anklets, and sets crafted for the modern woman.",
  keywords: ["jewellery", "luxury jewellery", "fashion jewellery", "rings", "earrings", "necklaces", "bracelets", "anklets", "monihar"],
  authors: [{ name: "Monihar Team" }],
  openGraph: {
    title: "Monihar | Handpicked Fashion Jewellery for Modern Women",
    description: "Indulge in our exquisite gold, sterling silver, and diamond collections.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased text-[#2E2528] bg-[#FFF6F6]`}
      >
        {children}
      </body>
    </html>
  );
}
