"use client";
import { useState, useEffect, useEffectEvent } from "react";
import ReactMarkdown from 'react-markdown';
import ImageViewer from "../imageviewer";
import { useRouter, useSearchParams } from 'next/navigation'; 
import { fadeIn, fadeOut } from "@/src/components/transitions";

function ImageSpread({ imageURLs }: { imageURLs: string[] }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerindex, setViewerIndex] = useState(0);

  const numPics = imageURLs.length;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      
      if (event.key === "Escape") {
        setViewerOpen(false);
      } else if (event.key === "ArrowRight") {
        forwardScroll();
      } else if (event.key === "ArrowLeft") {
        backwardScroll();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const forwardScroll = useEffectEvent(() => {
    console.log(viewerindex);
    setViewerIndex((viewerindex + 1) % numPics);
    console.log("right");
  });

  const backwardScroll = useEffectEvent(() => {
    setViewerIndex(((viewerindex - 1 + numPics) % numPics));
    console.log("left");
  });

  return (
    <div>
    {viewerOpen && 
        <>
          <button className="img-closer" onClick={() => setViewerOpen(false)}>X</button>
          <button className="img-scroller" style={{right: "10px"}} onClick={forwardScroll}>&gt;</button>
          <button className="img-scroller" style={{left: "10px"}} onClick={backwardScroll}>&lt;</button>
          <ImageViewer imageSrcs={imageURLs} initialIndex={viewerindex}/>
        </>
      }
      <div className="image-row-container">
        {imageURLs.map((image, index) => (
            <img className="image-row-container-img" onClick={() => {setViewerIndex(index); setViewerOpen(true)}} key={index} src={image} alt={`Image ${index + 1}`} />
        ))}
        
      </div>
    </div>
  );
}

function PortfolioSpread({
  info,
}: {
  info: {
    pid: number;
    projectname: string;
    imageURLs: string[];
    description: string;
    dimensions: string;
    date: string;
  };
}) {
  
  return (
    <div>
      <ImageSpread imageURLs={info.imageURLs} />
      <div className="text-body">
        <div className="header">{info.projectname}</div>
        <div>{info.date}</div>
        <em>{info.dimensions}</em>
        <br/><br/>
        <ReactMarkdown>{info.description}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function PortfolioDisplay() {
  const searchParams = useSearchParams();
  const [currentProject, setCurrentProject] = useState(searchParams.get("index") ? parseInt(searchParams.get("index") || "0") : 0);

  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const workerURL = new URL(
    "https://biancatrihenea-worker.tomaszkkmaher.workers.dev/"
  );

  const router = useRouter();

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
        setProjects(jsonData);
        if (jsonData.length > 0 && (currentProject < 0 || currentProject >= jsonData.length)) {
          setCurrentProject(0);
          router.replace('/portfolio?index=0', undefined);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        
        if (!error) fadeIn("content-area", 50);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fadeOut("portfolio-column");
    fadeIn("portfolio-column", 500);

  }, [currentProject]);

  const numProjects = projects.length;

  const MenuItem = ({
    title,
    date,
    pid,
    index
  }: {
    title: string;
    date: string;
    pid: number;
    index: number; // pid and index are different; pid = row in database while index = row in menu
  }) => (
    <div
      className="menu-item-portfolio"
      
      style={{
        color: currentProject === index ? "white" : "auto",
      }}
      id={
        currentProject === index ? "node3" : ""
      }
    >
      <a onClick={() => {
        setCurrentProject(index);
        router.push('/portfolio?index=' + index, undefined);
      }}>
        {title}
      </a>
    </div>
  );

  const ProjectMenu = () => (
    <div>
      {projects.map((project, index) => (
        <MenuItem
          key={index}
          title={project.projectname}
          date={project.date}
          pid={project.pid}
          index={index}
        />
      ))}
    </div>
  );

  const NavBar = () => {
    const forward = () => {
      const newProj = (currentProject + 1) % numProjects;
      setCurrentProject(newProj);
      router.push('/portfolio?index=' + newProj, undefined);
    };
    const backward = () => {
      const newProj = (currentProject - 1 + numProjects) % numProjects;
      setCurrentProject(newProj);
      router.push('/portfolio?index=' + newProj, undefined);
    };

    return (
      <div>
        <a className="left" onClick={backward}>
          Previous
        </a>
        <a className="right" onClick={forward}>
          Next
        </a>
      </div>
    );
  };

  return (
    <>
      {error ? (
        <div>Error fetching portfolio!</div>
      ) : (
        <div className="column-flex-container">
          <div className="portfolio-menu-column">
            <ProjectMenu />
          </div>
          <div id="portfolio-column">
            { numProjects > 0 ? <PortfolioSpread info={projects[currentProject]} /> : 
              <div><br/>(No projects available.)<br/><br/></div> 
            }
            <NavBar />
          </div>
        </div>
      )}
    </>
  );
}
