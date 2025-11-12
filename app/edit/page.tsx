"use client";
import { useState } from "react";
import { MouseEvent } from 'react';


export default function EditPage() {
    //structure:
    // 1. edit about section
    // 2. edit links section
    // 3. list of projects with collapsible edit forms + image upload

    const [contactLinks, updateContactLinks] = useState<[string, string][]>([]); 

    const addUrl = (e : MouseEvent, text: string, url: string) => {
        e.preventDefault();
        if (!url.includes("http://") && !url.includes("https://")) {
            alert("Please enter a valid URL that starts with http:// or https://");
            return;
        }
        if (text.length > 0 && url.length > 0) {
            updateContactLinks(prevLinks => [...prevLinks, [text, url]]);
        } else {
            alert("Please fill out both fields to add a new contact link.");
        }
    };

    const removeUrl = (e : MouseEvent, index: number | undefined) => {
        e.preventDefault();
        if (index !== undefined) {
            updateContactLinks(prevLinks => prevLinks.filter((_, i) => i !== index));
        }
    }

    function ContactLink(props: {info: [string, string], empty: boolean, index?: number}) {
        const [text, setText] = useState<string>(props.info[0]);
        const [url, setUrl] = useState<string>(props.info[1]);
        return (
            <div>
                <label>
                    Platform:
                    <input type="text" name="platform" value={text} onChange={(e) => {setText(e.target.value)}}/>
                    URL:
                    <input type="text" name="url" value={url} onChange={(e) => {setUrl(e.target.value)}}/>
                    
                    {props.empty ? 
                        (<button type="button" style={{float: "right"}} onClick={(e) => addUrl(e, text, url)}>Add</button>) : 
                        (<button type="button" style={{float: "right"}} onClick={(e) => removeUrl(e, props.index)}>Remove</button>)
                    }
                </label>
                <br/>
                    
            </div>
        )
    }

    function Project(props: {pid: number}) {
        return (
            <>  </>
        )
    }

    return (
        <div className="text-spread-container">
            <h1 style={{fontSize: "3em"}}>Settings</h1>
            <form>
                <h2>Edit About Section</h2>
                <textarea style={{width: "100%", height: "200px"}} defaultValue={"This is the about section. Edit me!"}></textarea>
                <br/>
                <br/>
                <h2>Edit Contact Links</h2>
                {contactLinks.map((info, index) => {
                    return <ContactLink key={index} info={info} empty={false} index={index}/>
                })}
                <ContactLink info={["", ""]} empty={true}/>

                <button type="submit">Update</button>
            </form>
        </div>
    )
}