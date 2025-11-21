"use client";
import { useEffect, useState } from "react";
import { swipe } from "./transitions";

export default function ImageViewer(props: { imageSrcs: string[], initialIndex: number}) {
    const len = props.imageSrcs.length;

    return (
        <div className="img-overlay">
            {props.imageSrcs.map((src, index) => (
                    <img className="overlay-image"
                        key={index}
                        id={"img-"+{index}}
                        src={src}
                        alt={`Image ${index + 1}`}
                        style={{ left: index === (props.initialIndex) ? '50%' : 
                            ((props.initialIndex === 0 && index === len - 1) || index < props.initialIndex && !(index === 0 && props.initialIndex === len - 1)) ? '-150%' 
                            : '150%',
                        opacity: index === (props.initialIndex) ? 1 : 0}}

                    />
                ))
            }
            
        </div>
    );
}