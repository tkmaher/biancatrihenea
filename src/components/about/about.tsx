"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { fadeIn } from "@/src/components/transitions";
import Link from "next/link";

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
            <div>Error fetching portfolio!</div>
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
            </div>
        )}
        </>
    );
}