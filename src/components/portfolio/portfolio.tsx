"use client";
import { useState } from "react";

function ImageSpread(props: {images: string[]}) {
    return (
        <div className="image-row-container">
            {props.images.map((image, index) => {
                return <div key={index} className="image-item">
                    <img src={image} alt={`Image ${index + 1}`} />
                </div>
            })}
        </div>
    );
}

function PortfolioSpread(props: {
    info: {"pid": number, 
    "projecttitle": string, 
    "images": string[], 
    "description": string,
    "date": string},
    isVisible: boolean}
    
) {
    
    const itemStyle: React.CSSProperties = {
        display: props.isVisible ? 'block' : 'none',
    };

    return (
        <div className="spread-container" style={itemStyle}>
            <ImageSpread images={props.info["images"]}/>
            <div className="text-spread-container">
                {props.info["description"]}
            </div>
        </div>
    );
}

export default function PortfolioDisplay() {
    const [currentProject, setCurrrentProject] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    const workerURL = new URL("https://portfolio-worker.tomaszkkmaher.workers.dev/");
    // load in projects---replace this with returned JSON
    const projects = [];

    const numProjects = projects.length;

    function MenuItem(props: {title: string, date: string, pid: number}) {
        return (<div className="menu-item-portfolio" 
            onClick={() => {setCurrrentProject(props.pid)}}
            style={{fontWeight: currentProject == props.pid ? "bold" : "normal"}}>
            <span style={{float: "left"}}>{props.title}</span>
            <span style={{float: "right"}}>{props.date}</span>
            <div style={{clear: "both"}}></div>
        </div>);
    }

    function Menu() {
        return (
            <div className="text-spread-container">
                {projects.map((project) => {
                    return <MenuItem key={project["pid"]} 
                            title={project["projecttitle"]} 
                            date={project["date"]}
                            pid={project["pid"]}/>
                })}
            </div>
        )
    }

    function NavBar() {

        function forward() {
            setCurrrentProject((currentProject + 1) % numProjects);
        }
        function backward() {
            setCurrrentProject((((currentProject - 1) % numProjects) + numProjects) % numProjects);
        }

        function menu() {
            setMenuOpen(!menuOpen);
        }

        return (
            <div className="menu-stretch">
                <a className="left" onClick={backward}>Previous</a>
                <a className="center" onClick={menu}>Menu</a>
                <a className="right" onClick={forward}>Next</a>
            </div>
        );
    }

    //set style opacity to 0 or 100 based on current project
    return (
        <>
            <div className="text-spread-container">
                <NavBar />
                {menuOpen ? <Menu /> : <MenuItem pid={currentProject} 
                                                 title={projects[currentProject]["projecttitle"]}
                                                 date={projects[currentProject]["date"]}/>}
            </div>
            {projects.map((project, index) => {
                return <PortfolioSpread key={project["pid"]} info={project} isVisible={index === currentProject}/>;
            })}
            
        </>
    );
}