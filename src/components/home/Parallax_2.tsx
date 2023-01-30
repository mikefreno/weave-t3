import React, { useRef, useEffect, useContext } from "react";
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
    <div className="parallax-container absolute mt-48 w-full" ref={parallaxRef}>
      <div className="parallax-layer" data-speed="0.2">
        <div className="animate-up-down layer1 absolute right-36 mt-60">
          <ChatModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.65">
        <div className="animate-up-down layer2 absolute right-36 mr-24 -mt-36">
          <GameModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.3">
        <div className="animate-up-down layer3 absolute left-36">
          <WorkModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
      </div>
    </div>
  );
};

export default Parallax_2;
