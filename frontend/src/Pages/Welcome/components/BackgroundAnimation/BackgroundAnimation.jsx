import React, { useEffect, useRef } from "react";
import "./BackgroundAnimation.css";

const BackgroundAnimation = ({ subtle = false }) => {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (!cursorDot.current || !cursorRing.current) return;

      cursorDot.current.style.left = `${e.clientX}px`;
      cursorDot.current.style.top = `${e.clientY}px`;

      cursorRing.current.style.left = `${e.clientX}px`;
      cursorRing.current.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div
        className={`background-animation ${
          subtle ? "background-animation--subtle" : ""
        }`}
      >
        <div className="orbit orbit-1">
          <span className="dot dot-1"></span>
        </div>

        <div className="orbit orbit-2">
          <span className="dot dot-2"></span>
        </div>

        <div className="orbit orbit-3">
          <span className="dot dot-3"></span>
          <span className="dot dot-4"></span>
        </div>
      </div>

      <div ref={cursorRing} className="cursor-ring"></div>
      <div ref={cursorDot} className="cursor-dot"></div>
    </>
  );
};

export default BackgroundAnimation;
