import React from "react";

export default function MenuBarsMobile(props: { stroke: string | undefined; fullscreen: boolean }) {
  return (
    <div>
      <svg width="36" height="30" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Mask group">
          <g id="Frame 1">
            <rect width="120" height="100" />
            <line
              id="LineAMobile"
              x1="11.5"
              y1="31.5"
              x2="108.5"
              y2="31.5"
              stroke={props.stroke}
              strokeWidth="6"
              strokeLinecap="round"
              className={props.fullscreen ? "" : "LineA"}
            />
            <line
              id="LineBMobile"
              x1="11.5"
              y1="64.5"
              x2="108.5"
              y2="64.5"
              stroke={props.stroke}
              strokeWidth="6"
              strokeLinecap="round"
              className={props.fullscreen ? "" : "LineB"}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
