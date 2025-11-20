import type { Metadata } from "next";
import "./globals.css";
import Main from "@/src/components/main";


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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <Main children={children} />
    </html>
  );
}
