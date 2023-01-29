import React, { useRef, useEffect } from "react";
import BotModal from "./BotModal";
import ConfigModal from "./ConfigModal";
import SecurityModal from "./SecurityModal";

const Parallax = (props: { fillColor: string }) => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      let offset = window.pageYOffset;
      Array.from(parallaxRef.current!.children).forEach(
        (layer: HTMLElement, index) => {
          let speed = parseFloat(layer.getAttribute("data-speed")!);
          if (index === 0) {
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
    <div className="parallax-container absolute  w-full" ref={parallaxRef}>
      <div className="parallax-layer" data-speed="0.2">
        <div className="animate-up-down layer3 absolute left-20 mt-48">
          <BotModal fill={props.fillColor} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.5">
        <div className="animate-up-down layer-2 absolute left-96 ml-36 mt-24">
          <SecurityModal fill={props.fillColor} />
        </div>
      </div>
      <div className="parallax-layer" data-speed="0.3">
        <div className="animate-up-down layer1 absolute right-24">
          <ConfigModal fill={props.fillColor} />
        </div>
      </div>
    </div>
  );
};

export default Parallax;
