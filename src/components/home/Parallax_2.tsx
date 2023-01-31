import React, { useRef, useEffect, useContext, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import ChatModal from "./ChatModal";
import GameModal from "./GameModal";
import WorkModal from "./WorkModal";

const Parallax_2 = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => {
      let offset = window.pageYOffset;
      Array.from(parallaxRef.current!.children).forEach(
        (layer: HTMLElement, index) => {
          let speed = parseFloat(layer.getAttribute("data-speed")!);
          if (index === 0 || index === 2) {
            speed = speed * -1;
          }
          layer.style.transform = `translateY(${offset * speed}px)`;
        }
      );
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className="parallax-container absolute z-20 mt-48 w-full"
      ref={parallaxRef}
    >
      <div className="parallax-layer" data-speed="0.2">
        <div className="animate-up-down layer1 absolute right-16 mt-60 xl:right-36">
          <ChatModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.5">
        <div className="animate-up-down layer2 absolute right-4 -mt-48 xl:right-48">
          <GameModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.3">
        <div className="animate-up-down layer3 absolute left-6 -mt-32 xl:left-36 xl:mt-0">
          <WorkModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
      </div>
    </div>
  );
};

export default Parallax_2;
