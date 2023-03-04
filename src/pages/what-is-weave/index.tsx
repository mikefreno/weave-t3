import Navbar from "@/src/components/Navbar";
import React, { useRef } from "react";

const WhatIsWeave = () => {
  const switchRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Navbar switchRef={switchRef} />
    </div>
  );
};

export default WhatIsWeave;
