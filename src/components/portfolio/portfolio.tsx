"use client";
import { useState, useEffect, useEffectEvent } from "react";
import ReactMarkdown from 'react-markdown';
import ImageViewer from "../imageviewer";

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
    <div className="image-row-container">
      {imageURLs.map((image, index) => (
        <a key={index} className="image-item" onClick={() => {setViewerIndex(index); setViewerOpen(true)}}>
          <img src={image} alt={`Image ${index + 1}`} />
        </a>
      ))}
      {viewerOpen && 
        <>
          <button className="img-closer" onClick={() => setViewerOpen(false)}>X</button>
          <button className="img-scroller" style={{right: "10px"}} onClick={forwardScroll}>&gt;</button>
          <button className="img-scroller" style={{left: "10px"}} onClick={backwardScroll}>&lt;</button>
          <ImageViewer imageSrcs={imageURLs} initialIndex={viewerindex}/>
        </>
      }
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
    date: string;
  };
}) {
  return (
    <div className="spread-container">
      <ImageSpread imageURLs={info.imageURLs} />
      <div className="text-spread-container">
      <ReactMarkdown>{info.description}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function PortfolioDisplay() {
  const [currentProject, setCurrentProject] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const workerURL = new URL(
    "https://biancatrihenea-worker.tomaszkkmaher.workers.dev/"
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
        setProjects(jsonData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        if (!error) setLoading(false);
      }
    };

    fetchData();
  }, []);

  const numProjects = projects.length;

  const MenuItem = ({
    title,
    date,
    pid,
  }: {
    title: string;
    date: string;
    pid: number;
  }) => (
    <div
      className="menu-item-portfolio"
      onClick={() => setCurrentProject(pid)}
      style={{
        fontWeight: currentProject === pid ? "bold" : "normal",
      }}
    >
      <span style={{ float: "left" }}>{title}</span>
      <span style={{ float: "right" }}>{date}</span>
      <div style={{ clear: "both" }}></div>
    </div>
  );

  const Menu = () => (
    <div className="text-spread-container">
      {projects.map((project, index) => (
        <MenuItem
          key={project.pid}
          title={project.projectname}
          date={project.date}
          pid={project.pid}
        />
      ))}
    </div>
  );

  const NavBar = () => {
    const forward = () =>
      setCurrentProject((currentProject + 1) % numProjects);
    const backward = () =>
      setCurrentProject(
        ((currentProject - 1 + numProjects) % numProjects)
      );
    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
      <div className="menu-stretch">
        <a className="left" onClick={backward}>
          Previous
        </a>
        <a className="center" onClick={toggleMenu}>
          Menu
        </a>
        <a className="right" onClick={forward}>
          Next
        </a>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        error ? (
          <div>Error fetching portfolio!</div>
        ) : (
          <div>Loading...</div>
        )
      ) : (
        <>
          <div className="text-spread-container">
            <NavBar />
            {menuOpen ? (
              <Menu />
            ) : (
              <MenuItem
                pid={currentProject}
                title={projects[currentProject].projectname}
                date={projects[currentProject].date}
              />
            )}
          </div>
          <PortfolioSpread info={projects[currentProject]} />
        </>
      )}
    </>
  );
}
