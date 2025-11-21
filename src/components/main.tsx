"use client";
import { useState, useEffect } from "react";
import DrawingCanvas from "@/src/components/canvas";
import Menu from "@/src/components/menu";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Main({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const pathname = usePathname();

  

  return (

    <body style={{position: "relative"}}>
        <h1>
          <Link href="/" style={{width: "100%"}} id="node1">bianca trihenea</Link>
        </h1>
        <div className="column-flex-container">
          <Menu />
          <div id="content-area" key={pathname}>{children}</div>
        </div >        
      
      <DrawingCanvas />
    </body>
  );
}
