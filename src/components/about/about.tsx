"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { fadeIn } from "@/src/components/transitions";
import Link from "next/link";

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every 1000 milliseconds (1 second)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <p>The current time is {currentTime.toLocaleTimeString()}.</p>
    </div>
  );
};

export default function About() {
    const [links, setLinks] = useState<any[]>([]);
    const [about, setAbout] = useState("");
    const [error, setError] = useState(false);
    const hasFetched = useRef(false);

    const workerURL = new URL(
        "https://biancatrihenea-worker.tomaszkkmaher.workers.dev/?page=about"
    );

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

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
            setLinks(jsonData["links"]);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(true);
        } finally {
            if (!error) {
                fadeIn("content-area", 50);
            }
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
            <div>Error fetching about section!</div>
        ) : (
            <div className="about-flex-container">
                <div className="about-area">
                    <div className="info-header">About</div>
                    <ReactMarkdown>{about}</ReactMarkdown>
                </div>
                <div className="about-area">
                    <div className="info-header">Contact</div>
                    {links.map((link, index) => {
                        return <AboutLink key={index} linkInfo={link} />;
                    })}
                </div>
                <Clock/>
            </div>
        )}
        </>
    );
}