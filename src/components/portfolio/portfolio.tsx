"use client";
import { useState, useEffect, useEffectEvent } from "react";
import ReactMarkdown from 'react-markdown';
import ImageViewer from "../imageviewer";
import { useRouter, useSearchParams } from 'next/navigation'; 
import { fadeIn } from "@/src/components/transitions";
import { projectTypes } from "@/src/constants"

function ImageSpread({ imageURLs }: { imageURLs: string[] }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerindex, setViewerIndex] = useState(0);

  const numPics = imageURLs.length;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      
      if (event.key === "Escape") {
        setViewerOpen(false);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        forwardScroll();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
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
          <button className="img-closer" style={{left: "10px"}} onClick={() => setViewerOpen(false)}>X</button>
          <button className="img-scroller" style={{right: "10px"}} onClick={forwardScroll}>&gt;</button>
          <button className="img-scroller" style={{left: "10px"}} onClick={backwardScroll}>&lt;</button>
          <div className="img-overlay" onClick={() => setViewerOpen(false)}>
            <ImageViewer imageSrcs={imageURLs} initialIndex={viewerindex}/>
          </div>
        </>
      }
      <div className="image-row-container">
        {imageURLs.map((image, index) => (
            <img className="image-row-container-img" onClick={() => {setViewerIndex(index); setViewerOpen(true)}} key={index} src={image} alt={`Image ${index + 1}`} />
        )) }
        
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
        
        <span style={{marginRight: "1em"}}>{info.date}</span>
        <span className="header">{info.projectname}</span >
        <span className="dimensions">Dimensions: {info.dimensions}<br/></span >
        
        <div className="text-description">
          <ReactMarkdown >{info.description}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioDisplay() {
  const searchParams = useSearchParams();
  const [currentProject, setCurrentProject] = useState(searchParams.get("index") ? parseInt(searchParams.get("index") || "0") : 0);

  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const [scrollPercent, setScrollPercent] = useState(1.0);

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
          router.replace('/?index=0', undefined);
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
    fadeIn("portfolio-column", 200);
  }, [currentProject]);

  const handleScroll = () => { 
    const vwConvert = (window.innerWidth) / 100;
    setScrollPercent(Math.max(1 - (Math.sqrt(window.scrollX / (vwConvert) / 16) ), 0.0)); 
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const numProjects = projects.length;

  const MenuItem = ({
    title,
    index
  }: {
    title: string;
    index: number; // pid and index are different; pid = row in database while index = row in menu
  }) => (
    <div
      className="menu-item-portfolio"
      style={{
        color: currentProject === index ? "white" : "auto",
      }}
    >
      <a onClick={() => {
        setCurrentProject(index);
        router.push('/?index=' + index, undefined);
      }}>
        {title}
      </a>
    </div>
  );

  const ProjectMenu = () => (
    <div>
      {projectTypes.map((type, index1) => (
        <div key={index1} className="type-section">{type}
            {projects.map((project, index2) => (
              (project.projecttype === type) && <MenuItem
                key={index2}
                title={project.projectname}
                index={index2}
              /> 
            ))}
        </div>
      ))}
      
    </div>
  );

  const NavBar = () => {
    const forward = () => {
      const newProj = (currentProject + 1) % numProjects;
      setCurrentProject(newProj);
      router.push('/?index=' + newProj, undefined);
    };
    const backward = () => {
      const newProj = (currentProject - 1 + numProjects) % numProjects;
      setCurrentProject(newProj);
      router.push('/?index=' + newProj, undefined);
    };

    return (
      <div>
        <br/>
        <a onClick={backward}>
          Previous
        </a>
        <br/>
        <a onClick={forward}>
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
          <div className="portfolio-menu-column" style={{transformOrigin: "left", transform: "scaleX(" + scrollPercent + ")"}}>
            <ProjectMenu />
            <NavBar />
          </div>
          <div id="portfolio-column">
            { numProjects > 0 ? <PortfolioSpread info={projects[currentProject]} /> : 
              <div><br/>(No projects available.)<br/><br/></div> 
            }
            
          </div>
        </div>
      )}
    </>
  );
}
