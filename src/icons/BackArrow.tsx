import React from "react";

const BackArrow = (props: {
  height: number;
  width: number;
  stroke: string;
  strokeWidth: number;
  className?: string;
}) => {
  return (
    <div className={props.className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={props.strokeWidth}
        stroke={props.stroke}
        height={props.height}
        width={props.width}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
    </div>
  );
};

export default BackArrow;
