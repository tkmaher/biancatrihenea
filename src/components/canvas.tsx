"use client";
import React, { useRef, useEffect, useState } from 'react';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [beginDrawing, setBeginDrawing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Initialize canvas properties like line width, color etc.
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';

    if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
  
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };
  
        window.addEventListener('resize', handleResize);
  
        // Cleanup function to remove the event listener
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
  }, []);

  const handleMouseDown = (e) => {
    setBeginDrawing(true);
    setLastPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseMove = (e) => {
    if (beginDrawing) {
        setIsDrawing(true);
    }
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.stroke();
    setLastPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setBeginDrawing(false);
  };

  return (
    <canvas
        style={{zIndex: isDrawing ? "9000" : "-1"}}
        className='canvas'
        width={windowWidth}
        height={windowHeight}
        ref={canvasRef}

        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop drawing if mouse leaves canvas
    />
  );
};

export default DrawingCanvas;