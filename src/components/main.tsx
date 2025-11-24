"use client";
import { useState, useEffect } from "react";
import DrawingCanvas from "@/src/components/canvas";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import About from "@/src/components/about/about"

export default function Main({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [infoOpen, setInfoOpen] = useState(false);
  const pathname = usePathname();



  return (

    <body style={{position: "relative"}}>
      <span className="title">
        <Link href="/" style={{width: "100%"}} id="node1">bianca trihenea</Link>
        <a style={{float: "right", zIndex: infoOpen ? 9999 : 1}} onClick={() => setInfoOpen(!infoOpen)}>Info</a>
      </span>
      <div
        className={`img-overlay ${infoOpen ? "visible" : "hidden"}`}
        onClick={() => setInfoOpen(!infoOpen)}
      >
        <About />
      </div>
      <div className="column-flex-container">
        <div id="content-area" key={pathname}>{children}</div>
      </div >        
      
      <DrawingCanvas />
    </body>
  );
}
