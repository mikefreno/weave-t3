import React, { useRef, useEffect, useContext } from "react";
import BotModal from "./BotModal";
import ConfigModal from "./ConfigModal";
import SecurityModal from "./SecurityModal";
import ThemeContext from "../ThemeContextProvider";

const Parallax = () => {
  const { isDarkTheme } = useContext(ThemeContext);

  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset;
      Array.from(parallaxRef.current!.children).map((layer: Element, index) => {
        let speed = parseFloat(layer.getAttribute("data-speed")!);
        if (index === 0 || index === 2) {
          speed = speed * -1;
        }
        (layer as HTMLElement).style.transform = `translateY(${offset * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="parallax-container absolute  w-full" ref={parallaxRef}>
      <div className="parallax-layer" data-speed="0.3">
        <div className="animate-up-down layer3 absolute left-20 mt-48">
          <BotModal isDarkTheme={isDarkTheme} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.2">
        <div className="animate-up-down layer-2 absolute ml-56 mt-24 xl:left-80">
          <SecurityModal isDarkTheme={isDarkTheme} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.4">
        <div className="animate-up-down layer1 absolute right-24">
          <ConfigModal isDarkTheme={isDarkTheme} />
        </div>
      </div>
    </div>
  );
};

export default Parallax;
