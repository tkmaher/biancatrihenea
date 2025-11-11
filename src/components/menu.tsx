"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Menu() {
    const menuItems = [
        {"href": "/portfolio", "text": "Portfolio", "class": "left"},
        {"href": "/about", "text": "About", "class": "center"},
        {"href": "/contact", "text": "Contact", "class": "right"},
    ];
    const pathName = usePathname();
    
    function MenuItem(props: { href: string; text: string; class: string }) {
        return (
            <>
                <span className={props.class} style={{textDecoration: pathName == props.href ? "underline" : "none"}}>
                    <Link href={props.href}>{props.text}</Link>
                </span>
            </>
        );
    }

    return (
        <div className="text-spread-container">
        <div className="menu-stretch">
            {menuItems.map((item) => {
                return <MenuItem key={item["text"]}
                                 href={item["href"]} 
                                 text={item["text"]}
                                 class={item["class"]}/>;
            })}
        </div>
        </div>
    );
}