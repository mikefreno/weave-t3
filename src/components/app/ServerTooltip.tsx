import React from "react";

const ServerTooltip = (props: { serverName: string; serverBlurb: string }) => {
  const { serverName, serverBlurb } = props;
  return (
    <div>
      <div className="text-center text-xl underline underline-offset-4">{serverName}</div>
      <p className="w-36 text-sm">{serverBlurb}</p>
    </div>
  );
};

export default ServerTooltip;
