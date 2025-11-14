"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import React from "react";

export default function ImageViewer(props: { imageSrcs: string[], initialIndex: number}) {
    return (
        <div className="img-overlay">
            {props.imageSrcs.map((src, index) => (
                    <img className="overlay-image"
                        key={index}
                        src={src}
                        alt={`Image ${index + 1}`}
                        style={{ display: index === (props.initialIndex) ? 'block' : 'none' }}
                    />
                ))
            }

        </div>
    );
}