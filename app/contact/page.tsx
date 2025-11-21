"use client";
import { fadeIn } from "@/src/components/transitions";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [links, setLinks] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const workerURL = new URL(
    "https://biancatrihenea-worker.tomaszkkmaher.workers.dev/?page=about"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from worker...");
        const response = await fetch(workerURL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log("Fetched data:", jsonData);
        setLinks(jsonData["links"]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        if (!error) fadeIn("content-area", 50);
      }
    };

    fetchData();
  }, []);

  function AboutLink(props: { linkInfo: {id: number, link: string, text: string} }) {
    return (
      <>
        <Link href={props.linkInfo.link} target="_blank" rel="noopener noreferrer">
          {props.linkInfo.text}
        </Link>
        <br/>
      </>
    )
  }

  return (
    <>

    
      {error ? (
          <div>Error fetching portfolio!</div>
      ) : (
        <div className="info">
          <div className="header">Contact</div>
          {links.map((link, index) => {
            return <AboutLink key={index} linkInfo={link} />;
          })}
        </div>
      )}
    </>
  );
}
