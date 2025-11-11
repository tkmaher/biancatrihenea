import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "../src/components/menu";

export const metadata: Metadata = {
  title: "Bianca Trihenea",
  description: "The website of Bianca Trihenea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Menu />

      </body>
    </html>
  );
}
