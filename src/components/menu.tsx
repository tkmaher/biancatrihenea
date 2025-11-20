"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Menu() {
    const menuItems = [
        {"href": "/portfolio", "text": "Portfolio"},
        {"href": "/about", "text": "About"},
        {"href": "/contact", "text": "Contact"},
    ];
    const pathName = usePathname();
    
    function MenuItem(props: { href: string; text: string }) {
        return (
            <div style={{color: pathName == props.href ? "white" : "auto"}} >
                <Link href={props.href}
                id={pathName == props.href ? "node2" : ""}>{props.text}</Link>
            </div>
        );
    }

    return (
            
        <div className="menu-column">
            
            {menuItems.map((item) => {
                return <MenuItem key={item["text"]}
                                href={item["href"]} 
                                text={item["text"]}/>;
            })}
        </div>
    );
}
//<Link style={{float: "right"}} href="https://www.timeanddate.com/worldclock/" target="_blank" >{new Date().getFullYear()}</Link>