import Navbar from "@/src/components/Navbar";
import React, { useRef } from "react";

export default function ApiIntro() {
  const switchRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Navbar switchRef={switchRef} />
    </>
  );
}
