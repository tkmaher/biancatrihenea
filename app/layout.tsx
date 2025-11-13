import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <div className="text-spread-container">
          <div className="menu-stretch">
            <Link href="/" style={{width: "100%"}}>Bianca Trihenea</Link>
            <Link href="https://www.timeanddate.com/worldclock/" target="_blank" className="right">{new Date().getFullYear()}</Link>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
