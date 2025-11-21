"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { fadeIn } from "@/src/components/transitions";

export default function Home() {
  const [about, setAbout] = useState("");
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
        setAbout(jsonData["about"]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        if (!error) fadeIn("content-area", 50);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {error ? (
        <div>Error fetching portfolio!</div>
      ) : (
        <div className="info">
          <div className="header">About</div>
          <ReactMarkdown>{about}</ReactMarkdown>
          
        </div>
      )}
    </>
  );
}
