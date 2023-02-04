import React from "react";

const LongArrow = (props: {
  height: number;
  width: number;
  stroke: string;
  strokeWidth: number;
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
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};

export default LongArrow;
