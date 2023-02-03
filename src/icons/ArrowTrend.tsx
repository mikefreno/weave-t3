import React from "react";

const ArrowTrend = (props: {
  height: number;
  width: number;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      height={props.height}
      width={props.width}
      fill={props.color}
    >
      <path d="M576 112V288C576 296.844 568.844 304 560 304S544 296.844 544 288V150.625L331.312 363.312C328.188 366.438 324.094 368 320 368S311.812 366.438 308.688 363.312L192 246.625L27.312 411.312C24.188 414.438 20.094 416 16 416C6.861 416 0 408.527 0 400C0 395.906 1.562 391.812 4.688 388.688L180.688 212.688C183.812 209.562 187.906 208 192 208S200.188 209.562 203.312 212.688L320 329.375L521.375 128H384C375.156 128 368 120.844 368 112S375.156 96 384 96H560C568.844 96 576 103.156 576 112Z" />
    </svg>
  );
};

export default ArrowTrend;