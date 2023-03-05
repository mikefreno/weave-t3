import React from "react";

const ChevronDown = (props: {
  height: number;
  width: number;
  stroke: string;
  strokeWidth: number;
  className?: string;
}) => {
  return (
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
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
};

export default ChevronDown;
