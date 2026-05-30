import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/common/CustomCursor";
import FloatingCart from "@/components/common/FloatingCart";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "House of Monihar | Fashion Jewellery For Every Story",
  description: "Explore Monihar's exquisite collection of handpicked fashion jewellery. Premium artificial, Korean, pearl, handmade, resin, and terracotta jewellery pieces designed for your individual story.",
  keywords: ["jewellery", "luxury jewellery", "fashion jewellery", "artificial jewellery", "costume jewellery", "korean jewellery", "pearl jewellery", "monihar"],
  authors: [{ name: "House of Monihar Team" }],
  openGraph: {
    title: "House of Monihar | Fashion Jewellery For Every Story",
    description: "Curated fashion jewellery inspired by elegance, femininity, and modern style.",
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
        className={`${playfair.variable} ${poppins.variable} font-sans antialiased text-[#2C1B24] bg-[#FFF9FC]`}
        suppressHydrationWarning
      >
        {children}
        <CustomCursor />
        <FloatingCart />
      </body>
    </html>
  );
}
