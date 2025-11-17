import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import DrawingCanvas from "@/src/components/canvas";

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
      <body style={{position: "relative"}}>

        <div className="text-spread-container">
          <div className="menu-stretch">
            <Link href="/" style={{width: "100%"}}>Bianca Trihenea</Link>
            <Link href="https://www.timeanddate.com/worldclock/" target="_blank" className="right">{new Date().getFullYear()}</Link>
          </div>
        </div >
        {children}
        <DrawingCanvas />
      </body>
    </html>
  );
}
